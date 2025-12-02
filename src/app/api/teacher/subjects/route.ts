import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  try {
    const { data, error } = await supabase.from("subjects").select("id,name").order("name", { ascending: true });
    if (error) throw error;
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("/api/teacher/subjects error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
