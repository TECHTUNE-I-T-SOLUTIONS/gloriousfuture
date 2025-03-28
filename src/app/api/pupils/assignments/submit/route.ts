export async function POST(req: Request) {
  const formData = await req.formData();
  const assignment_id = formData.get("assignment_id") as string;
  const submission_text = formData.get("submission_text") as string;
  const file = formData.get("file") as File | null;

  let file_url = null;
  if (file) {
    const { data, error } = await supabase.storage.from("submissions").upload(`assignments/${file.name}`, file);
    if (error) return NextResponse.json({ error });
    file_url = data.path;
  }

  const { error } = await supabase.from("submissions").insert([
    { assignment_id, submission_text, submission_file: file_url },
  ]);

  return error ? NextResponse.json({ error }) : NextResponse.json({ success: true });
}
