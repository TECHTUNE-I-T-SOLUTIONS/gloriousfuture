import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  try {
    const { data, error } = await supabase.from("classes").select("id, name");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
