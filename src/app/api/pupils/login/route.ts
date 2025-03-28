import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Using service role key for secure DB access
);

export async function POST(req: NextRequest) {
  try {
    const { uin, password } = await req.json();

    if (!uin || !password) {
      return NextResponse.json({ error: "UIN and Password are required!" }, { status: 400 });
    }

    // Fetch pupil details from the database
    const { data, error } = await supabase
      .from("pupils")
      .select("*")
      .eq("uin", uin)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid UIN or Password!" }, { status: 401 });
    }

    // Compare entered password with hashed password stored in DB
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid UIN or Password!" }, { status: 401 });
    }

    // Create session data
    const sessionData = JSON.stringify({ 
      uin: data.uin, 
      role: "pupil", 
      user: { name: data.name, email: data.email }
    });

    // Create HTTP-only session cookie
    const sessionCookie = serialize("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Prepare and send the response with cookie
    const response = new NextResponse(JSON.stringify({
      message: "Login successful!",
      pupil: { id: data.id, name: data.name, email: data.email },
    }), {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Pupil login error:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
