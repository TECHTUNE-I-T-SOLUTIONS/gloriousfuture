import { NextResponse } from "next/server";

// Minimal /api/pupils route: direct callers to specific endpoints (signup/login/etc.)
export async function GET() {
  return NextResponse.json({
    message: "Pupils API root - use /api/pupils/signup or /api/pupils/login or other pupil endpoints",
  })
}
