import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await supabase.from("tests_quizzes").select("*");
  return error ? NextResponse.json({ error }) : NextResponse.json(data);
}

export async function POST(req: Request) {
  const { title, description, due_date, class_id } = await req.json();
  const { data, error } = await supabase.from("tests_quizzes").insert([{ title, description, due_date, class_id }]).single();
  return error ? NextResponse.json({ error }) : NextResponse.json(data);
}

export async function PUT(req: Request) {
  const { id, title, description, due_date, class_id } = await req.json();
  const { error } = await supabase.from("tests_quizzes").update({ title, description, due_date, class_id }).eq("id", id);
  return error ? NextResponse.json({ error }) : NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { error } = await supabase.from("tests_quizzes").delete().eq("id", id);
  return error ? NextResponse.json({ error }) : NextResponse.json({ success: true });
}
