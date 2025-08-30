import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uin = searchParams.get("uin");
    if (!uin) return NextResponse.json({ success: false, error: "Missing uin" }, { status: 400 });

    const { data, error } = await supabase.from("teachers").select("id").eq("uin", uin).maybeSingle();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 });

    return NextResponse.json({ success: true, teacher_id: data.id });
  } catch {
    return NextResponse.json({ success: false, error: "Internal" }, { status: 500 });
  }
}
