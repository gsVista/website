import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { ensureDatabase, getSql } from "@/lib/db";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function serverError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Unexpected server error";
  return jsonError(message, 500);
}

export async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAdmin())) return jsonError("Unauthorized access", 401);
  return null;
}

export interface ResourceConfig {
  table: string;
  orderBy: string;
  schema: z.ZodType<Record<string, any>>;
  fromRow: (row: any) => any;
  toColumns: (item: any) => Record<string, unknown>;
  normalize?: (input: any) => any;
}

/** Builds list/create/update/delete handlers for a content table. */
export function createResourceRoute(config: ResourceConfig) {
  const list = async () => {
    try {
      await ensureDatabase();
      const rows = await getSql().unsafe(
        `SELECT * FROM ${config.table} ${config.orderBy}`,
      );
      return NextResponse.json({
        success: true,
        items: rows.map(config.fromRow),
      });
    } catch (error) {
      return serverError(error);
    }
  };

  const write = async (req: NextRequest) => {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
      const body = await req.json();
      const normalized = config.normalize ? config.normalize(body) : body;
      const parsed = config.schema.safeParse(normalized);
      if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message || "Invalid data");
      }

      const item = {
        ...parsed.data,
        id:
          parsed.data.id?.trim?.() ||
          `${config.table.replace("gsvista_", "")}-${randomUUID()}`,
      };
      const columns = config.toColumns(item);
      const keys = Object.keys(columns);
      const values: unknown[] = keys.map((key) => columns[key]);
      const quoted = (key: string) => `"${key}"`;
      const insert = `INSERT INTO ${config.table} (${keys.map(quoted).join(", ")}) VALUES (${keys
        .map((_, index) => `$${index + 1}`)
        .join(", ")})`;
      const updates = keys
        .filter((key) => key !== "id")
        .map((key) => `${quoted(key)} = EXCLUDED.${quoted(key)}`)
        .join(", ");

      await ensureDatabase();
      await getSql().unsafe(
        `${insert} ON CONFLICT (id) DO UPDATE SET ${updates}, updated_at = NOW()`,
        values as never[],
      );

      return NextResponse.json({ success: true, item });
    } catch (error) {
      return serverError(error);
    }
  };

  const GET = async () => list();
  const POST = async (req: NextRequest) => write(req);
  const PUT = async (req: NextRequest) => write(req);
  const DELETE = async (req: NextRequest) => {
    const denied = await requireAdmin();
    if (denied) return denied;

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return jsonError("Missing id");

    try {
      await ensureDatabase();
      await getSql().unsafe(`DELETE FROM ${config.table} WHERE id = $1`, [id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      return serverError(error);
    }
  };

  return { GET, POST, PUT, DELETE };
}
