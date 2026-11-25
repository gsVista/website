import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { jsonError, requireAdmin, serverError } from "@/lib/api";
import { ensureDatabase, getSql } from "@/lib/db";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel function payload limit is ~4.5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/geo+json",
  "application/json",
  "text/plain",
]);

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("No file uploaded");

    if (file.size > MAX_BYTES) {
      return jsonError("File is too large. Maximum upload size is 4 MB.", 413);
    }
    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(mimeType)) {
      return jsonError(
        "Unsupported file type. Upload an image, GeoJSON, JSON, or text file.",
      );
    }

    const id = randomUUID();
    const buffer = Buffer.from(await file.arrayBuffer());
    await ensureDatabase();
    await getSql().unsafe(
      "INSERT INTO gsvista_media (id, filename, mime_type, data, size) VALUES ($1, $2, $3, $4, $5)",
      [id, file.name.slice(0, 255), mimeType, buffer, buffer.length],
    );

    return NextResponse.json({
      success: true,
      id,
      url: `/api/media/${id}`,
      filename: file.name,
      size: buffer.length,
    });
  } catch (error) {
    return serverError(error);
  }
}
