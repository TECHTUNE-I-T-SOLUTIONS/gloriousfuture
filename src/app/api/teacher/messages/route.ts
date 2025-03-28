import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { teacher_id, pupil_id, message } = await req.json();

    const { data, error } = await supabase
      .from("messages")
      .insert([{ teacher_id, pupil_id, message }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("messages").select("*");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
