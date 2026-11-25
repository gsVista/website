import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminCookie,
  isAdmin,
  isCorrectPassword,
  setAdminCookie,
} from "@/lib/auth";
import { jsonError, serverError } from "@/lib/api";

export async function GET() {
  return NextResponse.json({ success: true, authenticated: await isAdmin() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isCorrectPassword(body?.password || "")) {
      return jsonError("Incorrect password", 401);
    }
    await setAdminCookie();
    return NextResponse.json({ success: true, authenticated: true });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ success: true, authenticated: false });
}
