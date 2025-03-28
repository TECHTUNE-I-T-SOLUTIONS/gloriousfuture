import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// **GET: Retrieve Teacher Details**
export async function GET(req: NextRequest) {
  const cookies = parse(req.headers.get("cookie") || "");
  if (!cookies.session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = JSON.parse(cookies.session);
  if (session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { data, error } = await supabase
    .from("teachers")
    .select("name, profile_picture, email, subject, uin")
    .eq("uin", session.uin)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}
