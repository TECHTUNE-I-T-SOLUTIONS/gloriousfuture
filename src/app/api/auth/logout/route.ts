import { NextResponse } from "next/server";
import { stringifyCookie } from "cookie";

export async function POST() {
  const expired = stringifyCookie("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return new NextResponse(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Set-Cookie": expired, "Content-Type": "application/json" },
  });
}
