import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await supabase.from("tests_quizzes").select("*");
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json(data, { status: 200 });
}
