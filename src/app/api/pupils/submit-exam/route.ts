export async function POST(req: Request) {
  const { examId, answers } = await req.json();
  const { data: exam } = await supabase.from("cbt_exams").select("questions").eq("id", examId).single();

  let score = 0;
  exam?.questions.forEach((q: any, index: number) => {
    if (q.correctAnswer === answers[index]) score++;
  });

  await supabase.from("exam_attempts").insert([{ exam_id: examId, score }]);
  return NextResponse.json({ success: true });
}
