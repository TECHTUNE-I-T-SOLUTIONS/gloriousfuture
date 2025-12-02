import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function normalizeText(s: unknown) {
  if (!s) return "";
  const str = String(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return str;
}

function tokenScore(a: string, b: string) {
  if (!a || !b) return 0;
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  // substring checks
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  const ta = new Set(na.split(" ").filter(Boolean));
  const tb = new Set(nb.split(" ").filter(Boolean));
  const inter = Array.from(ta).filter((x) => tb.has(x)).length;
  const union = new Set([...Array.from(ta), ...Array.from(tb)]).size || 1;
  return inter / union;
}

export async function POST() {
  try {
    // load subjects
    const { data: subjects } = await supabase.from("subjects").select("id,name");
    if (!subjects || subjects.length === 0) return NextResponse.json({ success: false, message: "No subjects found" }, { status: 400 });

    const tables: { name: string; idCol?: string; textCols: string[] }[] = [
      { name: "cbt_exams", textCols: ["subject"] },
      { name: "tests_quizzes", textCols: ["title", "description"] },
      { name: "assignments", textCols: ["subject", "description"] },
      { name: "exam_results", textCols: ["subject"] },
    ];

    const updates: Record<string, number> = {}

    for (const t of tables) {
      // fetch rows missing subject_id and with some text
      const { data: rows } = await supabase.from(t.name).select("id, " + t.textCols.join(", ")).is("subject_id", null).limit(1000);
      if (!rows || rows.length === 0) continue;
      let updatedCount = 0;
      for (const row of rows) {
        // build candidate text from configured columns
        const candidate = t.textCols.map((c) => String(((row as unknown) as Record<string, unknown>)[c] ?? "")).join(" ").trim();
        if (!candidate) continue;
        let best: { subjectId: string; name: string; score: number } | null = null;
        for (const s of subjects) {
          const score = tokenScore(candidate, s.name as string);
          if (!best || score > best.score) best = { subjectId: s.id as string, name: s.name as string, score };
        }
        if (best && best.score >= 0.6) {
          const { error } = await supabase.from(t.name).update({ subject_id: best.subjectId }).eq("id", ((row as unknown) as Record<string, unknown>).id);
          if (!error) updatedCount++;
        }
      }
      updates[t.name] = updatedCount;
    }

    return NextResponse.json({ success: true, updates });
  } catch (err) {
    console.error("Fuzzy backfill failed:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
