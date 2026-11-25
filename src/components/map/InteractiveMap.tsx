"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Layers,
  Maximize2,
  Minimize2,
  MapPin,
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

  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [basemap, setBasemap] = useState<"osm" | "satellite">("osm");
  const [layers, setLayers] = useState<MapLayerItem[]>([]);
  const [visibleLayerIds, setVisibleLayerIds] = useState<
    Record<string, boolean>
  >({});
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string;
    description: string;
    category?: string;
  } | null>(null);

  // Fetch published layers from the database via the API
  useEffect(() => {
    apiFetch<{ success: boolean; items: MapLayerItem[] }>("/api/layers")
      .then(({ items: activeLayers }) => {
        // Normalize any layer that contains non-4326 GeoJSON data
        const normalizedLayers = activeLayers.map((layer) => {
          if (layer.type === "geojson" && layer.data) {
            try {
              return {
                ...layer,
                data: normalizeGeoJSONToWGS84(layer.data),
              };
            } catch {
              return layer;
            }
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
      try {
        const maplibregl = await import("maplibre-gl");

        if (!document.getElementById("maplibre-css")) {
          const link = document.createElement("link");
          link.id = "maplibre-css";
          link.rel = "stylesheet";
          link.href =
            "https://unpkg.com/maplibre-gl@6.19.0/dist/maplibre-gl.css";
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

    layers.forEach((layer) => {
      const sourceId = `src-${layer.id}`;
      const fillLayerId = `fill-${layer.id}`;
      const lineLayerId = `line-${layer.id}`;
      const isVisible = visibleLayerIds[layer.id] !== false;

      // Determine data source: URL or inline GeoJSON
      const hasData = layer.type === "geojson" && (layer.data || layer.url);
      if (!hasData) return;

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
        // Compute normalized data if provided directly
        const layerData = layer.data
          ? normalizeGeoJSONToWGS84(layer.data)
          : layer.url;

        map.addSource(sourceId, {
          type: "geojson",
          data: layerData as any,
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
        // Update visibility only
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
    });
  }, [layers, visibleLayerIds, mapLoaded]);

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

  const toggleLayerVisibility = (id: string) => {
    setVisibleLayerIds((prev) => {
      const willBeVisible = !prev[id];

      // "turning on a layer should cause the map to zoom into it"
      if (willBeVisible && mapRef.current) {
        const targetLayer = layers.find((l) => l.id === id);
        if (targetLayer && targetLayer.data) {
          const bounds = getGeoJSONBounds(targetLayer.data);
          if (bounds) {
            mapRef.current.fitBounds(
              [
                [bounds[0], bounds[1]],
                [bounds[2], bounds[3]],
              ],
              { padding: 60, maxZoom: 15, duration: 1200 },
            );
          }
        }
      }

      return {
        ...prev,
        [id]: willBeVisible,
      };
    });
  };

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
              Toggle on / off
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
                return (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors border ${
                      isChecked
                        ? "bg-surface-2/90 border-line text-ink"
                        : "bg-surface-2/40 border-line text-muted hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color || "#0284c7" }}
                      />
                      <span className="truncate font-medium">{layer.name}</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? "bg-brand border-brand/40 text-ink"
                          : "border-line bg-paper"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </button>
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
