import { NextResponse } from "next/server";
import getSupabaseClient from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const assignment_id = formData.get("assignment_id") as string;
  const submission_text = formData.get("submission_text") as string;
  const file = formData.get("file") as File | null;

  let file_url = null;
  if (file) {
    const supabase = getSupabaseClient()
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    // upload expects a Blob or Buffer; cast the File to a Blob for the browser form-data case
    // In Node, you should convert the file to a Buffer before uploading.
    const { data, error } = await supabase.storage.from("submissions").upload(`assignments/${file.name}`, file as unknown as Blob)
    if (error) return NextResponse.json({ error: String(error.message || error) }, { status: 500 })
    const responseData = data as { path?: string } | null
    file_url = responseData?.path ?? null
  }
  const supabase = getSupabaseClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  const { error } = await supabase.from("submissions").insert([
    { assignment_id, submission_text, submission_file: file_url },
  ])

  return error ? NextResponse.json({ error: String(error.message || error) }, { status: 500 }) : NextResponse.json({ success: true })
}
