import { Service } from "@/types";

/** Seed content for the services/capabilities section. Editable from /admin. */
export const INITIAL_SERVICES: Service[] = [
  {
    id: "svc-flood",
    icon: "Waves",
    title: "Coastal Inundation & Catchment Flood Modeling",
    category: "Hydrology & Hazard Assessment",
    description:
      "Evaluating low-lying terrain, historical flood extent, and natural surface runoff corridors to aid civil infrastructure planning and risk mitigation.",
    tools: ["Sentinel-1 SAR", "Digital Elevation Models (DEM)", "QGIS", "GDAL"],
    deliverables: [
      "Inundation probability vector layers (GeoPackage / Shapefile)",
      "Drainage depression & runoff direction maps",
      "Technical hazard assessment documentation",
    ],
    methodology:
      "We process radar satellite backscatter (Sentinel-1) during storm peaks to delineate water surface extent beneath cloud cover, coupled with elevation models to simulate drainage ponding.",
    order: 1,
  },
  {
    id: "svc-ndvi",
    icon: "Sprout",
    title: "Multispectral Crop Health & NDVI Mapping",
    category: "Precision Agriculture",
    description:
      "Time-series satellite monitoring measuring vegetative vigor (NDVI) across farmland to detect irrigation stress and localized growth anomalies.",
    tools: [
      "Sentinel-2 MSI",
      "Python (Rasterio, GeoPandas)",
      "NDVI / NDRE indices",
    ],
    deliverables: [
      "Zonal NDVI vegetation index maps",
      "Targeted ground sampling and soil inspection zones",
      "Periodic crop vigor change summaries",
    ],
    methodology:
      "Multispectral optical bands (Near-Infrared and Red) are radiometrically calibrated to measure chlorophyll absorption, allowing farmers to detect canopy variation before visible inspection.",
    order: 2,
  },
  {
    id: "svc-lulc",
    icon: "Building",
    title: "Land Use / Land Cover (LULC) & Urban Sprawl Analysis",
    category: "Urban & Environmental Planning",
    description:
      "Multi-temporal satellite imagery classification comparing urban built-up expansion, wetland boundaries, and vegetation change over time.",
    tools: [
      "Landsat & Sentinel-2 Archives",
      "Supervised Classification",
      "QGIS",
    ],
    deliverables: [
      "Vector built-up surface polygons",
      "Wetland and open water boundary delineations",
      "Decadal land cover change matrices",
    ],
    methodology:
      "Satellite archives are stacked and classified using statistical and machine learning classifiers to evaluate conversion rates between natural land cover and impervious urban concrete.",
    order: 3,
  },
  {
    id: "svc-siting",
    icon: "Sun",
    title: "Site Selection Analysis & Feasibility Screening",
    category: "Commercial Siting, Energy & Infrastructure",
    description:
      "Multi-criteria spatial screening evaluating terrain slope, demographic catchment, flood hazard, and infrastructure proximity to rank optimal parcels for facilities and commercial expansion.",
    tools: [
      "SRTM / Copernicus DEM",
      "Multi-Criteria Decision Analysis (MCDA)",
      "ArcGIS / QGIS",
    ],
    deliverables: [
      "Ranked candidate site constraint & suitability matrices",
      "Terrain slope, elevation profiles & buffer corridors",
      "Preliminary spatial feasibility briefings for investment boards",
    ],
    methodology:
      "We combine elevation models, flood layers, road access buffers, and spatial zoning datasets into a weighted overlay to eliminate costly location guesswork and identify high-yield sites.",
    order: 4,
  },
  {
    id: "svc-imagery",
    icon: "Satellite",
    title: "Satellite Imagery Acquisition & Pre-processing",
    category: "Earth Observation Data",
    description:
      "Sourcing, atmospheric correction, orthorectification, and cloud-masking of optical and radar satellite imagery for custom Areas of Interest.",
    tools: ["Sentinel Hub / Copernicus Open Access", "PlanetScope", "GDAL CLI"],
    deliverables: [
      "Cloud-masked surface reflectance GeoTIFFs",
      "Orthorectified true-color and false-color composites",
      "Metadata and spatial coordinate alignment records",
    ],
    methodology:
      "Raw sensor scenes are ingested, geometrically corrected, projected to appropriate local coordinate systems (e.g., UTM Zone 31N), and clipped to the exact project boundary.",
    order: 5,
  },
  {
    id: "svc-webgis",
    icon: "Database",
    title: "Spatial Database & WebGIS Integration",
    category: "Geospatial Data Engineering",
    description:
      "Structuring project geodatabases, producing Cloud-Optimized GeoTIFFs (COG), and integrating spatial layers into interactive map interfaces.",
    tools: [
      "PostGIS",
      "GeoJSON",
      "MapLibre GL / Leaflet",
      "Cloud-Optimized GeoTIFF",
    ],
    deliverables: [
      "Standardized spatial database schemas",
      "Web-accessible GeoJSON endpoints and layer packages",
      "Embedded interactive map viewers",
    ],
    methodology:
      "We convert complex spatial datasets into web-ready formats that can be visualized directly in standard browsers or loaded into enterprise software.",
    order: 6,
  },
];
