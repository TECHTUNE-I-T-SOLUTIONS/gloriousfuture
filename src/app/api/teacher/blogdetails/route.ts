import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uin = searchParams.get("uin"); // 🟢 Fetch UIN from request

  if (!uin) {
    return NextResponse.json({ success: false, error: "Missing UIN" }, { status: 400 });
  }

  // 🟢 Fetch teacher details using UIN instead of user_id
  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("full_name, uin") // Include `uin` for verification
    .eq("uin", uin) // Match by `uin`
    .single();

  if (error || !teacher) {
    return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, teacher }, { status: 200 });
}
