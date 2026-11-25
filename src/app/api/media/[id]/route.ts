import { NextResponse } from "next/server";
import { ensureDatabase, getSql } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await ensureDatabase();
    const rows = await getSql().unsafe<
      { mime_type: string; data: Buffer | Uint8Array }[]
    >("SELECT mime_type, data FROM gsvista_media WHERE id = $1", [id]);
    const file = rows[0];
    if (!file) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(Buffer.from(file.data), {
      headers: {
        "Content-Type": file.mime_type,
        "Content-Length": String(file.data.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
