import proj4 from "proj4";

// Register common projected coordinate systems used in geospatial workflows
// UTM North (e.g. Nigeria Zone 31N, 32N, 33N)
proj4.defs("EPSG:32631", "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
// UTM South (e.g. Rwanda Zone 35S, 36S, 38S)
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
// Web Mercator
proj4.defs(
  "EPSG:3857",
  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs",
);

/**
 * Detects CRS from GeoJSON object properties or URNs
 */
export function detectCRS(geojson: any): string | null {
  if (!geojson) return null;
  const crs = geojson.crs;
  if (!crs) return null;

  if (typeof crs === "string") {
    const match = crs.match(/(?:EPSG:{1,2}|urn:ogc:def:crs:EPSG::?)(\d+)/i);
    if (match) return `EPSG:${match[1]}`;
  }

  if (crs.properties?.name) {
    const nameStr = String(crs.properties.name);
    const match = nameStr.match(/(?:EPSG:{1,2}|urn:ogc:def:crs:EPSG::?)(\d+)/i);
    if (match) return `EPSG:${match[1]}`;
  }

  return null;
}

/**
 * Recursively transforms coordinate arrays from source CRS to EPSG:4326 [lng, lat]
 */
function transformCoords(coords: any, sourceCRS: string): any {
  if (!Array.isArray(coords)) return coords;
  if (
    coords.length >= 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number"
  ) {
    // If coords are already roughly within [-180..180, -90..90], no projection needed
    if (
      coords[0] >= -180 &&
      coords[0] <= 180 &&
      coords[1] >= -90 &&
      coords[1] <= 90
    ) {
      return coords;
    }
    try {
      const [lng, lat] = proj4(sourceCRS, "EPSG:4326", [coords[0], coords[1]]);
      return [lng, lat, ...(coords.slice(2) || [])];
    } catch {
      return coords;
    }
  }
  return coords.map((c: any) => transformCoords(c, sourceCRS));
}

/**
 * Normalizes any GeoJSON into standard EPSG:4326 (WGS84 lon/lat).
 * Handles UTM zones (31N, 32N, 38S, etc.) and Web Mercator automatically.
 */
export function normalizeGeoJSONToWGS84(geojson: any): any {
  if (!geojson) return null;
  const sourceCRS = detectCRS(geojson);

  // If already standard WGS84, return as is
  if (!sourceCRS || sourceCRS === "EPSG:4326") {
    // Quick heuristic sanity check on first coordinate
    const sampleCoord = getFirstCoordinate(geojson);
    if (
      sampleCoord &&
      (Math.abs(sampleCoord[0]) > 180 || Math.abs(sampleCoord[1]) > 90)
    ) {
      // Coordinates are clearly projected (e.g. UTM meters > 100,000)
      // Default to UTM 31N (West Africa / Lagos) if unspecified
      return reprojectGeoJSON(geojson, "EPSG:32631");
    }
    return geojson;
  }

  // Ensure definition exists in proj4 for UTM zones
  const match = sourceCRS.match(/EPSG:(\d+)/);
  if (match) {
    const code = parseInt(match[1], 10);
    if (!proj4.defs(sourceCRS)) {
      if (code >= 32601 && code <= 32660) {
        const zone = code - 32600;
        proj4.defs(
          sourceCRS,
          `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`,
        );
      } else if (code >= 32701 && code <= 32760) {
        const zone = code - 32700;
        proj4.defs(
          sourceCRS,
          `+proj=utm +zone=${zone} +south +datum=WGS84 +units=m +no_defs`,
        );
      }
    }
  }

  return reprojectGeoJSON(geojson, sourceCRS);
}

function reprojectGeoJSON(geojson: any, sourceCRS: string): any {
  try {
    const clone = JSON.parse(JSON.stringify(geojson));
    if (clone.type === "FeatureCollection" && Array.isArray(clone.features)) {
      clone.features = clone.features.map((feature: any) => {
        if (feature.geometry) {
          feature.geometry.coordinates = transformCoords(
            feature.geometry.coordinates,
            sourceCRS,
          );
        }
        return feature;
      });
    } else if (clone.type === "Feature" && clone.geometry) {
      clone.geometry.coordinates = transformCoords(
        clone.geometry.coordinates,
        sourceCRS,
      );
    } else if (clone.coordinates) {
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
 * Extracts bounding box [minLng, minLat, maxLng, maxLat] from any GeoJSON feature or collection
 */
export function getGeoJSONBounds(
  geojson: any,
): [number, number, number, number] | null {
  if (!geojson) return null;
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
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
      return;
    }
    coords.forEach(collect);
  }

  if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
    geojson.features.forEach((f: any) => {
      if (f.geometry?.coordinates) collect(f.geometry.coordinates);
    });
  } else if (geojson.geometry?.coordinates) {
    collect(geojson.geometry.coordinates);
  } else if (geojson.coordinates) {
    collect(geojson.coordinates);
  }

  if (minLng === Infinity || minLat === Infinity) return null;
  return [minLng, minLat, maxLng, maxLat];
}

function getFirstCoordinate(geojson: any): [number, number] | null {
  if (!geojson) return null;
  let found: [number, number] | null = null;
  function search(coords: any) {
    if (found || !Array.isArray(coords)) return;
    if (
      coords.length >= 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      found = [coords[0], coords[1]];
      return;
    }
    coords.forEach(search);
  }
  if (
    geojson.type === "FeatureCollection" &&
    geojson.features?.[0]?.geometry?.coordinates
  ) {
    search(geojson.features[0].geometry.coordinates);
  } else if (geojson.geometry?.coordinates) {
    search(geojson.geometry.coordinates);
  } else if (geojson.coordinates) {
    search(geojson.coordinates);
  }
  return found;
}
