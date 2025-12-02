import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/teacher/final-results/generate
// body: { classId: string }
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const classId = body.classId
    if (!classId) return NextResponse.json({ error: 'classId is required' }, { status: 400 })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Get pupils for class
    const { data: pupils, error: pupilsErr } = await supabase
      .from('pupils')
      .select('id,full_name')
      .eq('class_id', classId)

    if (pupilsErr) return NextResponse.json({ error: pupilsErr.message }, { status: 500 })

    // Helper: compute grade from percent
    function percentToGrade(p: number) {
      if (p >= 70) return 'A'
      if (p >= 60) return 'B'
      if (p >= 50) return 'C'
      if (p >= 45) return 'D'
      if (p >= 40) return 'E'
      return 'F'
    }

    const results: unknown[] = []

    // For each pupil, gather assignments, exams, tests
    for (const pupil of pupils || []) {
      const pid = pupil.id

      // assignments scores (assumes assignments table has subject_id or subject)
      const { data: assignments, error: asgErr } = await supabase
        .from('submissions')
        .select('grade,assignment_id')
        .eq('pupil_id', pid)

      if (asgErr) return NextResponse.json({ error: asgErr.message }, { status: 500 })

      // Map assignment_id to assignment subject if possible
      const assignmentScores: Record<string, number[]> = {}
      for (const s of assignments || []) {
        try {
          const g = typeof s.grade === 'number' ? s.grade : Number(s.grade) || 0
          const aid = (s.assignment_id as string) || 'unknown'
          if (!assignmentScores[aid]) assignmentScores[aid] = []
          assignmentScores[aid].push(g)
        } catch { }
      }

      // exam attempts
      const { data: examAttempts, error: eaErr } = await supabase
        .from('cbt_exam_attempts')
        .select('score,exam_id')
        .eq('pupil_id', pid)

      if (eaErr) return NextResponse.json({ error: eaErr.message }, { status: 500 })

      const examScoresByExam: Record<string, number[]> = {}
      for (const a of examAttempts || []) {
        const sc = typeof a.score === 'number' ? a.score : Number(a.score) || 0
        const eid = (a.exam_id as string) || 'unknown'
        if (!examScoresByExam[eid]) examScoresByExam[eid] = []
        examScoresByExam[eid].push(sc)
      }

      // test submissions
      const { data: tests, error: tErr } = await supabase
        .from('test_submissions')
        .select('score,test_id')
        .eq('pupil_id', pid)

      if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })

      const testScoresByTest: Record<string, number[]> = {}
      for (const t of tests || []) {
        const sc = typeof t.score === 'number' ? Number(t.score) : Number(t.score) || 0
        const tid = (t.test_id as string) || 'unknown'
        if (!testScoresByTest[tid]) testScoresByTest[tid] = []
        testScoresByTest[tid].push(sc)
      }

      // Calculate subject-level aggregation where possible
      // We will attempt to join assignment/exam/test -> subject via assignment/exam/test tables

      // Fetch assignment details for involved assignment_ids
      const assignmentIds = Object.keys(assignmentScores).filter((id) => id !== 'unknown')
      const examIds = Object.keys(examScoresByExam).filter((id) => id !== 'unknown')
      const testIds = Object.keys(testScoresByTest).filter((id) => id !== 'unknown')

      const subjectMap: Record<string, { assignment_scores: number[]; exam_scores: number[]; test_scores: number[] }> = {}

      if (assignmentIds.length) {
        const { data: asgRows } = await supabase.from('assignments').select('id,subject_id,subject').in('id', assignmentIds)
        for (const row of asgRows || []) {
          const sid = row.subject_id || row.subject || 'Unknown'
          const scores = assignmentScores[row.id] || []
          if (!subjectMap[sid]) subjectMap[sid] = { assignment_scores: [], exam_scores: [], test_scores: [] }
          subjectMap[sid].assignment_scores.push(...scores)
        }
      }

      if (examIds.length) {
        const { data: examRows } = await supabase.from('cbt_exams').select('id,subject_id,subject').in('id', examIds)
        for (const row of examRows || []) {
          const sid = row.subject_id || row.subject || 'Unknown'
          const scores = examScoresByExam[row.id] || []
          if (!subjectMap[sid]) subjectMap[sid] = { assignment_scores: [], exam_scores: [], test_scores: [] }
          subjectMap[sid].exam_scores.push(...scores)
        }
      }

      if (testIds.length) {
        const { data: testRows } = await supabase.from('tests_quizzes').select('id,subject_id,subject').in('id', testIds)
        for (const row of testRows || []) {
          const sid = row.subject_id || row.subject || 'Unknown'
          const scores = testScoresByTest[row.id] || []
          if (!subjectMap[sid]) subjectMap[sid] = { assignment_scores: [], exam_scores: [], test_scores: [] }
          subjectMap[sid].test_scores.push(...scores)
        }
      }
      // compute averages per component and weighted totals
      const perSubjectResults: Record<string, unknown> = {}
      let total = 0
      let countSubjects = 0
      for (const [sid, info] of Object.entries(subjectMap)) {
        const assignArr = info.assignment_scores || []
        const examArr = info.exam_scores || []
        const testArr = info.test_scores || []

        if (!assignArr.length && !examArr.length && !testArr.length) continue

        const assignAvg = assignArr.length ? assignArr.reduce((a, b) => a + b, 0) / assignArr.length : null
        const examAvg = examArr.length ? examArr.reduce((a, b) => a + b, 0) / examArr.length : null
        const testAvg = testArr.length ? testArr.reduce((a, b) => a + b, 0) / testArr.length : null

        const assignMax = assignArr.length ? Math.max(...assignArr) : null
        const examMax = examArr.length ? Math.max(...examArr) : null
        const testMax = testArr.length ? Math.max(...testArr) : null

        const weights = { exam: 0.6, test: 0.3, assignment: 0.1 }
        const comps = [ { score: examAvg, weight: weights.exam }, { score: testAvg, weight: weights.test }, { score: assignAvg, weight: weights.assignment } ]
        let weightedSum = 0
        let weightSum = 0
        for (const c of comps) {
          if (c.score !== null && !Number.isNaN(c.score)) { weightedSum += (c.score as number) * c.weight; weightSum += c.weight }
        }
        const weightedTotal = weightSum ? Math.round((weightedSum / weightSum) * 100) / 100 : null

        const grade = (val: number | null) => {
          if (val === null) return 'N/A'
          if (val >= 70) return 'A'
          if (val >= 60) return 'B'
          if (val >= 50) return 'C'
          if (val >= 45) return 'D'
          if (val >= 40) return 'E'
          return 'F'
        }

        perSubjectResults[sid] = {
          assignment_avg: assignAvg !== null ? Math.round(assignAvg * 100) / 100 : null,
          test_avg: testAvg !== null ? Math.round(testAvg * 100) / 100 : null,
          exam_avg: examAvg !== null ? Math.round(examAvg * 100) / 100 : null,
          assignment_max: assignMax,
          test_max: testMax,
          exam_max: examMax,
          weighted_total: weightedTotal,
          grade: grade(weightedTotal),
        }

        if (weightedTotal !== null) { total += weightedTotal; countSubjects++ }
      }

      const average = countSubjects ? total / countSubjects : 0
      const overallGrade = percentToGrade(average)

      // Optionally persist final result row
      const payload = {
        teacher_id: null,
        class_id: classId,
        pupil_id: pid,
        average: Math.round(average * 100) / 100,
        grade: overallGrade,
        results: perSubjectResults,
      }

      // insert into final_results table if exists (best-effort)
      try {
        await supabase.from('final_results').insert({
          class_id: classId,
          pupil_id: pid,
          average: payload.average,
          grade: payload.grade,
          results: payload.results,
        })
      } catch (e) {
        // ignore insert error; maybe table doesn't exist yet in dev
        console.debug('Could not persist final_results:', e)
      }

      results.push({ pupil_id: pid, pupil_name: (pupil as { full_name?: string }).full_name, average: payload.average, grade: payload.grade, results: perSubjectResults })
    }

    return NextResponse.json({ data: results })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}
