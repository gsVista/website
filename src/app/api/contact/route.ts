import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin, serverError } from "@/lib/api";
import { ensureDatabase, getSql, toInquiry } from "@/lib/db";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().default(""),
  organization: z.string().default(""),
  inquiryType: z.string().default("General"),
  message: z.string().min(1, "Message is required"),
  budget: z.string().default(""),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await ensureDatabase();
    const rows = await getSql().unsafe(
      "SELECT * FROM gsvista_inquiries ORDER BY created_at DESC",
    );
    return NextResponse.json({ success: true, items: rows.map(toInquiry) });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = inquirySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid inquiry");
    }

    const inquiry = parsed.data;
    await ensureDatabase();
    await getSql().unsafe(
      `INSERT INTO gsvista_inquiries
        (id, name, email, phone, organization, inquiry_type, message, budget, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new')`,
      [
        `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.organization,
        inquiry.inquiryType,
        inquiry.message,
        inquiry.budget,
      ],
    );

    return NextResponse.json({
      success: true,
      message:
        "Inquiry received successfully. Our team will contact you shortly at info@gsvista.com.",
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const status = z
      .enum(["new", "reviewed", "contracted"])
      .safeParse(body?.status);
    if (!body?.id || !status.success)
      return jsonError("Missing id or invalid status");

    await ensureDatabase();
    await getSql().unsafe(
      "UPDATE gsvista_inquiries SET status = $1 WHERE id = $2",
      [status.data, body.id],
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
