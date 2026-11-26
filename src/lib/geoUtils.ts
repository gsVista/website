import proj4 from "proj4";

const WGS84 = "EPSG:4326";
const WEB_MERCATOR = "EPSG:3857";

// Register common projected coordinate systems used in geospatial workflows.
// UTM zones are also registered on demand in ensureProjection().
proj4.defs("EPSG:32631", "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
proj4.defs(
  "EPSG:32735",
  "+proj=utm +zone=35 +south +datum=WGS84 +units=m +no_defs",
);
proj4.defs(
  "EPSG:32736",
  "+proj=utm +zone=36 +south +datum=WGS84 +units=m +no_defs",
);
proj4.defs(
  "EPSG:32738",
  "+proj=utm +zone=38 +south +datum=WGS84 +units=m +no_defs",
);
proj4.defs(
  "EPSG:3857",
  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs",
);

/** Turns "32631", "EPSG:32631", "urn:ogc:def:crs:EPSG::32631" or "auto" into an EPSG code. */
export function normalizeCrsName(value?: string | null): string | null {
  if (!value) return null;
  const text = String(value).trim();
  if (!text || /^auto\b/i.test(text)) return null;

  const epsg = text.match(/EPSG[:\s]*(\d{4,5})/i);
  if (epsg) return `EPSG:${epsg[1]}`;
  if (/CRS:?84|WGS\s*84|WGS84/i.test(text)) return WGS84;
  if (/web\s*mercator/i.test(text)) return WEB_MERCATOR;
  if (/^\d{4,5}$/.test(text)) return `EPSG:${text}`;
  return text.toUpperCase();
}

/** True when proj4 can transform from this CRS. */
export function isSupportedCrs(value?: string | null): boolean {
  const crs = normalizeCrsName(value);
  if (!crs) return true; // empty / auto-detect
  return ensureProjection(crs);
}

/** Parses GeoJSON text; returns null when the text is not valid JSON. */
export function parseGeoJSON(input: unknown): any {
  if (typeof input !== "string") return input ?? null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function ensureProjection(crs: string): boolean {
  if (crs === WGS84 || crs === WEB_MERCATOR) return true;
  if (proj4.defs(crs)) return true;

  const match = crs.match(/^EPSG:(\d+)$/);
  if (!match) return false;
  const code = Number(match[1]);

  if (code >= 32601 && code <= 32660) {
    proj4.defs(crs, `+proj=utm +zone=${code - 32600} +datum=WGS84 +units=m +no_defs`);
    return true;
  }
  if (code >= 32701 && code <= 32760) {
    proj4.defs(
      crs,
      `+proj=utm +zone=${code - 32700} +south +datum=WGS84 +units=m +no_defs`,
    );
    return true;
  }
  return false;
}

function crsFromString(value: string): string | null {
  if (!value) return null;
  const authority = value.match(/AUTHORITY\["EPSG"\s*,\s*"(\d+)"\]/i);
  if (authority) return `EPSG:${authority[1]}`;
  const epsg = value.match(/EPSG[:\s]*(\d{4,5})/i);
  if (epsg) return `EPSG:${epsg[1]}`;
  if (/CRS:?84|WGS\s*84|WGS84/i.test(value)) return WGS84;
  if (/web\s*mercator/i.test(value)) return WEB_MERCATOR;
  return null;
}

/** Detects the CRS declared inside a GeoJSON object (all common legacy formats). */
export function detectCRS(geojson: any): string | null {
  const parsed = parseGeoJSON(geojson);
  if (!parsed || typeof parsed !== "object") return null;

  const crs = parsed.crs;
  if (!crs) return null;
  if (typeof crs === "string") return crsFromString(crs);
  if (typeof crs === "number") return `EPSG:${crs}`;

  const candidates = [
    crs.properties?.name,
    crs.properties?.href,
    crs.name,
    crs.href,
    crs.properties?.code,
  ];
  for (const candidate of candidates) {
    if (candidate == null) continue;
    if (typeof candidate === "number") return `EPSG:${candidate}`;
    const detected = crsFromString(String(candidate));
    if (detected) return detected;
  }
  return null;
}

/**
 * Best-effort guess for data that has no CRS metadata.
 * Returns null when the data is ambiguous (e.g. UTM without a stated zone),
 * so the admin can pick the correct source CRS instead of placing it wrongly.
 */
export function suggestSourceCrs(input: unknown): string | null {
  const geojson = parseGeoJSON(input);
  if (!geojson) return null;

  const declared = detectCRS(geojson);
  if (declared) return declared;

  const bounds = getGeoJSONBounds(geojson);
  if (!bounds) return null;
  if (isGeographic(bounds)) return WGS84;

  const [minX, minY, maxX, maxY] = bounds;
  const maxAbsX = Math.max(Math.abs(minX), Math.abs(maxX));
  const maxAbsY = Math.max(Math.abs(minY), Math.abs(maxY));

  if (maxAbsX > 20037508 || maxAbsY > 20037508) return null;
  // UTM eastings never exceed ~834 km and northings never exceed ~9.33 million.
  if (maxAbsX > 1_000_000 || maxAbsY > 10_000_000) return WEB_MERCATOR;
  return null;
}

function isGeographic([minX, minY, maxX, maxY]: [
  number,
  number,
  number,
  number,
]): boolean {
  return (
    minX >= -180 &&
    maxX <= 180 &&
    minY >= -90 &&
    maxY <= 90 &&
    !(Math.abs(minX) < 1e-9 && Math.abs(maxX) < 1e-9)
  );
}

function transformCoords(coords: any, sourceCRS: string): any {
  if (!Array.isArray(coords)) return coords;
  if (
    coords.length >= 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number"
  ) {
    const [x, y] = coords;
    // Already geographic (e.g. data was normalised earlier) — leave it alone.
    if (x >= -180 && x <= 180 && y >= -90 && y <= 90) return coords;
    try {
      const [lng, lat] = proj4(sourceCRS, WGS84, [x, y]);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return coords;
      return [lng, lat, ...(coords.slice(2) || [])];
    } catch {
      return coords;
    }
  }
  return coords.map((c: any) => transformCoords(c, sourceCRS));
}

/**
 * Normalises any GeoJSON into standard EPSG:4326 (WGS84 lon/lat).
 *
 * @param input GeoJSON object or JSON text.
 * @param sourceCrs Optional override (e.g. "EPSG:32632"). When omitted, the
 *   CRS declared inside the file is used, then a safe heuristic.
 */
export function normalizeGeoJSONToWGS84(
  input: unknown,
  sourceCrs?: string | null,
): any {
  const geojson = parseGeoJSON(input);
  if (!geojson || typeof geojson !== "object") return geojson;

  const override = normalizeCrsName(sourceCrs);
  if (override) {
    if (override === WGS84) return markAsWgs84(geojson);
    if (!ensureProjection(override)) {
      console.warn(`Unsupported source CRS: ${override}. Layer left unchanged.`);
      return geojson;
    }
    return reprojectGeoJSON(geojson, override);
  }

  const declared = detectCRS(geojson);
  if (declared) {
    if (declared === WGS84) return markAsWgs84(geojson);
    if (!ensureProjection(declared)) {
      console.warn(`Unsupported source CRS: ${declared}. Layer left unchanged.`);
      return geojson;
    }
    return reprojectGeoJSON(geojson, declared);
  }

  const bounds = getGeoJSONBounds(geojson);
  if (!bounds || isGeographic(bounds)) return geojson;

  const guessed = suggestSourceCrs(geojson);
  if (!guessed) {
    console.warn(
      "Layer has projected coordinates but no CRS metadata. Set the source CRS in the admin to place it correctly.",
    );
    return geojson;
  }
  return reprojectGeoJSON(geojson, guessed);
}

function markAsWgs84(geojson: any): any {
  if (!geojson || typeof geojson !== "object") return geojson;
  return {
    ...geojson,
    crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  };
}

function reprojectGeoJSON(geojson: any, sourceCRS: string): any {
  try {
    const clone = JSON.parse(JSON.stringify(geojson));
    const transformGeometry = (geometry: any) => {
      if (!geometry || typeof geometry !== "object") return geometry;
      if (geometry.type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
        geometry.geometries = geometry.geometries.map(transformGeometry);
        return geometry;
      }
      if (Array.isArray(geometry.coordinates)) {
        geometry.coordinates = transformCoords(geometry.coordinates, sourceCRS);
      }
      return geometry;
    };

    if (clone.type === "FeatureCollection" && Array.isArray(clone.features)) {
      clone.features = clone.features.map((feature: any) => {
        if (feature?.geometry) transformGeometry(feature.geometry);
        return feature;
      });
    } else if (clone.type === "Feature" && clone.geometry) {
      transformGeometry(clone.geometry);
    } else if (clone.type === "GeometryCollection") {
      transformGeometry(clone);
    } else if (Array.isArray(clone.coordinates)) {
      clone.coordinates = transformCoords(clone.coordinates, sourceCRS);
    }

    clone.crs = {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    };
    return clone;
  } catch (err) {
    console.warn("Failed to reproject GeoJSON:", err);
    return geojson;
  }
}

/**
 * Extracts bounding box [minLng, minLat, maxLng, maxLat] from any GeoJSON.
 */
export function getGeoJSONBounds(
  geojson: any,
): [number, number, number, number] | null {
  const parsed = parseGeoJSON(geojson);
  if (!parsed || typeof parsed !== "object") return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  function collect(coords: any) {
    if (!Array.isArray(coords)) return;
    if (
      coords.length >= 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      const lng = coords[0];
      const lat = coords[1];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
      return;
    }
    coords.forEach(collect);
  }

  function collectGeometry(geometry: any) {
    if (!geometry || typeof geometry !== "object") return;
    if (geometry.type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
      geometry.geometries.forEach(collectGeometry);
      return;
    }
    if (geometry.coordinates) collect(geometry.coordinates);
  }

  if (parsed.type === "FeatureCollection" && Array.isArray(parsed.features)) {
    parsed.features.forEach((feature: any) => collectGeometry(feature?.geometry));
  } else if (parsed.type === "Feature") {
    collectGeometry(parsed.geometry);
  } else if (parsed.type === "GeometryCollection") {
    collectGeometry(parsed);
  } else if (parsed.coordinates) {
    collect(parsed.coordinates);
  }

  if (minLng === Infinity || minLat === Infinity) return null;
  return [minLng, minLat, maxLng, maxLat];
}
