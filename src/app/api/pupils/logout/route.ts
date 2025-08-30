import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response that clears the session cookie
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the session cookie by setting it to an empty value with max-age 0
    response.cookies.set("session", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("Error clearing pupil session:", err);
    return NextResponse.json({ message: "Error clearing session" }, { status: 500 });
  }
}
