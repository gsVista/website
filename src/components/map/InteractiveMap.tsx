"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Layers,
  Maximize2,
  Minimize2,
  Satellite,
  Globe,
  Check,
} from "lucide-react";
import { MapLayerItem } from "@/types";
import { apiFetch } from "@/lib/client";
import { normalizeGeoJSONToWGS84, getGeoJSONBounds } from "@/lib/geoUtils";

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const urlDataCache = useRef<Record<string, any>>({});

  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [basemap, setBasemap] = useState<"osm" | "satellite">("osm");
  const [layers, setLayers] = useState<MapLayerItem[]>([]);
  const [visibleLayerIds, setVisibleLayerIds] = useState<
    Record<string, boolean>
  >({});
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string;
    description: string;
    category?: string;
  } | null>(null);

  // Fetch published layers from the database via the API
  useEffect(() => {
    apiFetch<{ success: boolean; items: MapLayerItem[] }>("/api/layers")
      .then(({ items: activeLayers }) => {
        // Reproject every layer once, using its declared/selected source CRS.
        const normalizedLayers = activeLayers.map((layer) => {
          if (layer.type === "geojson" && layer.data) {
            return {
              ...layer,
              data: normalizeGeoJSONToWGS84(layer.data, layer.sourceCrs),
            };
          }
          return layer;
        });

        setLayers(normalizedLayers);
        const initialVis: Record<string, boolean> = {};
        normalizedLayers.forEach((l: MapLayerItem) => {
          initialVis[l.id] = l.visible !== false;
        });
        setVisibleLayerIds(initialVis);
      })
      .catch(() => setLayers([]));
  }, []);

  // Initialize MapLibre
  useEffect(() => {
    let mapInstance: any = null;

    const initMap = async () => {
      setMapLoaded(false);
      try {
        const maplibregl = await import("maplibre-gl");

        // Next.js breaks MapLibre's `import.meta.url` worker discovery, so
        // point it at the self-hosted worker copied into public/maplibre.
        maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

        if (!document.getElementById("maplibre-css")) {
          const link = document.createElement("link");
          link.id = "maplibre-css";
          link.rel = "stylesheet";
          link.href = "/maplibre/maplibre-gl.css";
          document.head.appendChild(link);
        }

        if (!mapContainer.current) return;

        // Clean OpenStreetMap style (default) or Esri World Imagery (Satellite)
        const styleUrl =
          basemap === "satellite"
            ? {
                version: 8,
                sources: {
                  "satellite-source": {
                    type: "raster",
                    tiles: [
                      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    ],
                    tileSize: 256,
                    attribution: "Tiles &copy; Esri",
                  },
                },
                layers: [
                  {
                    id: "satellite-layer",
                    type: "raster",
                    source: "satellite-source",
                    minzoom: 0,
                    maxzoom: 19,
                  },
                ],
              }
            : {
                version: 8,
                sources: {
                  "osm-source": {
                    type: "raster",
                    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    tileSize: 256,
                    attribution: "&copy; OpenStreetMap contributors",
                  },
                },
                layers: [
                  {
                    id: "osm-layer",
                    type: "raster",
                    source: "osm-source",
                    minzoom: 0,
                    maxzoom: 19,
                  },
                ],
              };

        mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style: styleUrl as any,
          center: [3.45, 6.45], // Lagos, Nigeria
          zoom: 10.5,
          pitch: 0, // Flat top-down GIS view (NO TILT)
          bearing: 0, // True North
        });

        mapRef.current = mapInstance;

        mapInstance.addControl(
          new maplibregl.NavigationControl({
            showCompass: true,
            visualizePitch: false,
          }),
          "top-right",
        );

        mapInstance.on("load", () => {
          setMapLoaded(true);
        });
      } catch (err) {
        console.warn("MapLibre init notice:", err);
      }
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
      }
    };
  }, [basemap]);

  // Synchronize GeoJSON layers whenever layers or visibility change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    let cancelled = false;

    const syncLayers = async () => {
      for (const layer of layers) {
        if (cancelled) return;
        if (layer.type !== "geojson") continue;

        const sourceId = `src-${layer.id}`;
        const fillLayerId = `fill-${layer.id}`;
        const lineLayerId = `line-${layer.id}`;
        const isVisible = visibleLayerIds[layer.id] !== false;

        // Inline data is already normalised; remote GeoJSON is fetched and
        // reprojected here so URL layers behave like uploaded ones.
        let data: any = layer.data ?? null;
        if (!data && layer.url) {
          data = urlDataCache.current[layer.id] ?? null;
          if (!data) {
            try {
              const response = await fetch(layer.url);
              data = normalizeGeoJSONToWGS84(
                await response.json(),
                layer.sourceCrs,
              );
              urlDataCache.current[layer.id] = data;
            } catch {
              // Let MapLibre try to load the URL itself.
              data = layer.url;
            }
          }
        }
        if (!data) continue;

        // Data-driven colour expression for layers that expose a "combined" score
        const fillColor: any =
          layer.colorField === "combined"
            ? [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "combined"], 0],
                0,
                "#1e3a5f",
                0.3,
                "#2563eb",
                0.6,
                "#22c55e",
                1.0,
                "#facc15",
                1.4,
                "#f97316",
                1.77,
                "#ef4444",
              ]
            : layer.colorField === "polsby"
              ? [
                  "interpolate",
                  ["linear"],
                  ["to-number", ["get", "polsby"], 0],
                  0.27,
                  "#fca5a5",
                  0.32,
                  "#ef4444",
                  0.36,
                  "#b91c1c",
                ]
              : layer.color || "#0284c7";

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data: data as any,
          });

          // Fill Layer
          map.addLayer({
            id: fillLayerId,
            type: "fill",
            source: sourceId,
            paint: {
              "fill-color": fillColor,
              "fill-opacity": isVisible ? (layer.opacity ?? 0.65) : 0,
            },
          });

          // Boundary Line Layer
          map.addLayer({
            id: lineLayerId,
            type: "line",
            source: sourceId,
            paint: {
              "line-color": "#ffffff",
              "line-width": layer.colorField ? 0.4 : 1.5,
              "line-opacity": isVisible ? 0.6 : 0,
            },
          });

          // Interactive click popup
          map.on("click", fillLayerId, (e: any) => {
            if (e.features && e.features[0]) {
              const props = e.features[0].properties || {};
              const scoreLabel =
                props.combined != null
                  ? `MCDA Score: ${parseFloat(props.combined).toFixed(4)}`
                  : props.polsby != null
                    ? `Polsby-Popper: ${parseFloat(props.polsby).toFixed(4)}`
                    : null;
              setSelectedFeature({
                name: props.name || layer.name,
                description:
                  scoreLabel ||
                  props.description ||
                  layer.description ||
                  "Analysis feature.",
                category: props.category || layer.description,
              });
            }
          });

          map.on("mouseenter", fillLayerId, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", fillLayerId, () => {
            map.getCanvas().style.cursor = "";
          });
        } else {
          // Keep edited data in sync with the live source
          if (typeof data !== "string") {
            const source = map.getSource(sourceId) as any;
            if (source?.setData) source.setData(data);
          }
          if (map.getLayer(fillLayerId)) {
            map.setPaintProperty(
              fillLayerId,
              "fill-opacity",
              isVisible ? (layer.opacity ?? 0.65) : 0,
            );
          }
          if (map.getLayer(lineLayerId)) {
            map.setPaintProperty(
              lineLayerId,
              "line-opacity",
              isVisible ? 0.6 : 0,
            );
          }
        }
      }
    };

    syncLayers();
    return () => {
      cancelled = true;
    };
  }, [layers, visibleLayerIds, mapLoaded]);

  /** Zooms the map to a layer's full extent. */
  const zoomToLayer = async (layer: MapLayerItem) => {
    const map = mapRef.current;
    if (!map) return;

    let data: any = layer.data ?? null;
    if (!data && layer.type === "geojson" && layer.url) {
      data = urlDataCache.current[layer.id] ?? null;
      if (!data) {
        try {
          const response = await fetch(layer.url);
          data = normalizeGeoJSONToWGS84(
            await response.json(),
            layer.sourceCrs,
          );
          urlDataCache.current[layer.id] = data;
        } catch {
          return;
        }
      }
    }
    if (!data) return;

    const bounds = getGeoJSONBounds(data);
    if (!bounds) return;

    const [minLng, minLat, maxLng, maxLat] = bounds;
    if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) return;

    const isPoint =
      Math.abs(maxLng - minLng) < 0.0005 && Math.abs(maxLat - minLat) < 0.0005;

    if (isPoint) {
      map.flyTo({
        center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
        zoom: Math.max(map.getZoom(), 14),
        duration: 1200,
      });
      return;
    }

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 60, maxZoom: 15, duration: 1200 },
    );
  };

  /** Selects a layer, makes it visible and flies to it. */
  const selectLayer = (layer: MapLayerItem) => {
    setActiveLayerId(layer.id);
    setVisibleLayerIds((prev) =>
      prev[layer.id] === false ? { ...prev, [layer.id]: true } : prev,
    );
    zoomToLayer(layer);
  };

  const toggleLayerVisibility = (id: string) => {
    setVisibleLayerIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fullscreen toggle with automatic map resize
  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    }, 150);
  };

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 150);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full rounded-xl overflow-hidden border border-line/80 bg-paper transition-all ${
        isFullscreen
          ? "h-screen w-screen rounded-none border-none"
          : "h-[580px]"
      }`}
    >
      {/* Map Canvas */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Left: Basemap Switcher */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1 bg-paper/90 backdrop-blur-sm border border-line rounded-lg shadow-md">
        <button
          onClick={() => setBasemap("osm")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            basemap === "osm"
              ? "bg-brand text-paper"
              : "text-ink hover:text-ink hover:bg-surface-2"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>OpenStreetMap</span>
        </button>
        <button
          onClick={() => setBasemap("satellite")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            basemap === "satellite"
              ? "bg-brand text-paper"
              : "text-ink hover:text-ink hover:bg-surface-2"
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
      </div>

      {/* Top Right: Fullscreen Button */}
      <div className="absolute top-4 right-14 z-10">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-paper/90 backdrop-blur-sm border border-line text-ink hover:text-ink hover:bg-surface-2 shadow-md transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Bottom Left: Layer Switcher */}
      <div className="absolute bottom-4 left-4 z-10 w-72 max-w-[calc(100vw-2rem)]">
        <div className="p-3.5 rounded-xl bg-paper/95 backdrop-blur-sm border border-line/90 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-strong" />
              <span>Project Layers</span>
            </span>
            <span className="text-[11px] text-muted font-normal">
              Click to zoom
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {layers.length === 0 ? (
              <p className="text-xs text-muted py-1">
                No custom layers published.
              </p>
            ) : (
              layers.map((layer) => {
                const isChecked = visibleLayerIds[layer.id] !== false;
                const isActive = activeLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    className={`w-full flex items-center gap-1 p-1 rounded-lg border transition-colors ${
                      isActive
                        ? "bg-brand-soft/60 border-brand/50"
                        : isChecked
                          ? "bg-surface-2/90 border-line"
                          : "bg-surface-2/40 border-line"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectLayer(layer)}
                      title={`Zoom to ${layer.name}`}
                      className="flex-1 min-w-0 flex items-center gap-2 p-1.5 rounded-md text-left text-xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color || "#0284c7" }}
                      />
                      <span
                        className={`truncate font-medium ${
                          isChecked ? "text-ink" : "text-muted"
                        }`}
                      >
                        {layer.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLayerVisibility(layer.id)}
                      aria-pressed={isChecked}
                      aria-label={`${isChecked ? "Hide" : "Show"} ${layer.name}`}
                      title={isChecked ? "Hide layer" : "Show layer"}
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-brand border-brand text-paper"
                          : "border-line bg-paper text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Selected Feature Card */}
      {selectedFeature && (
        <div className="absolute bottom-4 right-4 z-10 w-80 max-w-[calc(100vw-2rem)] p-4 rounded-xl bg-paper/95 backdrop-blur-sm border border-line shadow-xl space-y-2 text-xs">
          <div className="flex items-start justify-between gap-2 border-b border-line pb-2">
            <div>
              {selectedFeature.category && (
                <span className="text-[10px] font-medium text-brand-strong uppercase tracking-wide">
                  {selectedFeature.category}
                </span>
              )}
              <h4 className="font-semibold text-ink text-sm">
                {selectedFeature.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-muted hover:text-ink p-1 text-sm font-bold"
            >
              &times;
            </button>
          </div>

          <p className="text-ink leading-relaxed">
            {selectedFeature.description}
          </p>
        </div>
      )}
    </div>
  );
}
