import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pupil_id = searchParams.get("pupil_id");

  const { data, error } = await supabase.from("assignments").select("*").eq("pupil_id", pupil_id);
  return error ? NextResponse.json({ error }) : NextResponse.json(data);
}
