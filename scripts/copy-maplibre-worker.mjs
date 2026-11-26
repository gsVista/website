// MapLibre GL JS derives its worker URL from `import.meta.url`, which Next.js
// rewrites to a non-http value. The worker then falls back to an empty URL and
// GeoJSON layers never render. Copy MapLibre's self-contained worker and
// stylesheet into public/ so the app can serve them itself.
import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const packagePath = require.resolve("maplibre-gl/package.json");
const distDir = path.join(path.dirname(packagePath), "dist");
const outDir = path.join(process.cwd(), "public", "maplibre");

const files = ["maplibre-gl-worker.mjs", "maplibre-gl.css"];

await mkdir(outDir, { recursive: true });
for (const file of files) {
  await copyFile(path.join(distDir, file), path.join(outDir, file));
}

console.log(`Copied ${files.join(", ")} to public/maplibre`);
