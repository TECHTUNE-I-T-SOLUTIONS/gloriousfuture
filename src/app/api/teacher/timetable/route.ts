import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { teacher_id, subject, class_id, day, time } = await req.json();

    if (!teacher_id || !subject || !class_id || !day || !time) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("timetable")
      .insert([{ teacher_id, subject, class_id, day, time }])
      .select(); // Fetch the inserted row

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error inserting timetable entry:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("timetable").select("*");

    if (error) throw error;

    // Ensure the response is always an array
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
