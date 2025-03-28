import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessionData = JSON.parse(sessionCookie);

    if (!sessionData.uin) {
      return NextResponse.json({ error: "Session missing UIN" }, { status: 400 });
    }

    return NextResponse.json({ session: sessionData }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
