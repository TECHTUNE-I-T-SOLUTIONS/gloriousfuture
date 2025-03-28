import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create a response that clears the session cookie
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the session cookie by setting it to an empty value with max-age 0
    response.cookies.set("session", "", { path: "/", httpOnly: true, secure: true, sameSite: "strict", maxAge: 0 });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Error clearing session" }, { status: 500 });
  }
}
