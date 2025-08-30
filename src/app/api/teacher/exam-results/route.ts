import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { teacher_id, pupil_id, subject, score } = await req.json();

  const supabase = getSupabaseClient()
  if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

  const { data, error } = await supabase.from("exam_results").insert([{ teacher_id, pupil_id, subject, score }])

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function GET() {
  try {
  const supabase = getSupabaseClient()
  if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

  const { data, error } = await supabase.from("exam_results").select("*")
  if (error) throw error
  return NextResponse.json(data)
  } catch (error) {
  return NextResponse.json({ success: false, error: String(error) });
  }
}
