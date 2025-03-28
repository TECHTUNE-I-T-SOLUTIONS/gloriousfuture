import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { uin, password } = await req.json();

    if (!uin || !password) {
      return NextResponse.json({ error: "UIN and Password are required!" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("uin", uin)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid UIN or Password!" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid UIN or Password!" }, { status: 401 });
    }

    const sessionData = JSON.stringify({ 
      uin: data.uin, 
      role: "teacher", 
      user: { email: data.email } 
    });

    const sessionCookie = serialize("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const response = new NextResponse(JSON.stringify({
      message: "Login successful!",
      teacher: { id: data.id, name: data.name, email: data.email },
    }), {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie, // Set cookie in response
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
