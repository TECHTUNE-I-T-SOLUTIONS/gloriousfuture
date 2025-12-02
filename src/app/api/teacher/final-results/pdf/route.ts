import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Teacher PDF endpoint: GET /api/teacher/final-results/pdf?pupilId=...&classId=...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const pupilId = url.searchParams.get('pupilId')
    const classId = url.searchParams.get('classId')
    if (!pupilId || !classId) return NextResponse.json({ error: 'Missing pupilId or classId' }, { status: 400 })

    // fetch canonical subjects
    const { data: subjectsData } = await supabase.from('subjects').select('id,name')
    const subjectsMap = new Map<string, string>()
    if (subjectsData) subjectsData.forEach((s: Record<string, unknown>) => subjectsMap.set(s.id as string, s.name as string))

    // --- Class-level maxima ---
    // assignments in class
    const { data: assignments } = await supabase.from('assignments').select('id,subject_id,subject').eq('class_id', classId)
    const assignmentIds = (assignments || []).map((a: Record<string, unknown>) => a.id)

    let assignmentSubmissions: Array<Record<string, unknown>> = []
    if (assignmentIds.length) {
      const res = await supabase.from('submissions').select('id,assignment_id,pupil_id,grade').in('assignment_id', assignmentIds)
      assignmentSubmissions = res.data || []
    }

    const assignMaxBySubject = new Map<string, number>()
    for (const sub of assignmentSubmissions) {
      const assignment = (assignments || []).find((a: Record<string, unknown>) => a.id === sub.assignment_id)
      const subj = (assignment?.subject_id || assignment?.subject || 'unknown') as string
      const prev = assignMaxBySubject.get(subj) ?? 0
      if ((sub.grade as number) > prev) assignMaxBySubject.set(subj, sub.grade as number)
    }

    // cbt exams in class
    const { data: exams } = await supabase.from('cbt_exams').select('id,subject_id,subject').eq('class_id', classId)
    const examIds = (exams || []).map((e: Record<string, unknown>) => e.id)
    let examAttempts: Array<Record<string, unknown>> = []
    if (examIds.length) {
      const res = await supabase.from('cbt_exam_attempts').select('id,exam_id,pupil_id,score').in('exam_id', examIds)
      examAttempts = res.data || []
    }
    const examMaxBySubject = new Map<string, number>()
    for (const a of examAttempts) {
      const exam = (exams || []).find((e: Record<string, unknown>) => e.id === a.exam_id)
      const subj = (exam?.subject_id || exam?.subject || 'unknown') as string
      const prev = examMaxBySubject.get(subj) ?? 0
      if ((a.score as number) > prev) examMaxBySubject.set(subj, a.score as number)
    }

    // tests/quizzes in class
    const { data: tests } = await supabase.from('tests_quizzes').select('id,subject_id,subject').eq('class_id', classId)
    const testIds = (tests || []).map((t: Record<string, unknown>) => t.id)
    let testSubmissions: Array<Record<string, unknown>> = []
    if (testIds.length) {
      const res = await supabase.from('test_submissions').select('id,test_id,pupil_id,score').in('test_id', testIds)
      testSubmissions = res.data || []
    }
    const testMaxBySubject = new Map<string, number>()
    for (const t of testSubmissions) {
      const test = (tests || []).find((x: Record<string, unknown>) => x.id === t.test_id)
      const subj = (test?.subject_id || test?.subject || 'unknown') as string
      const prev = testMaxBySubject.get(subj) ?? 0
      if ((t.score as number) > prev) testMaxBySubject.set(subj, t.score as number)
    }

    // --- Pupil-level averages per component ---
    const pupilIdStr = pupilId

    // pupil assignment averages per subject
    const pupilAssigns = assignmentSubmissions.filter(s => s.pupil_id === pupilIdStr)
    const assignBySubject = new Map<string, { total: number; count: number }>()
    for (const s of pupilAssigns) {
      const assignment = (assignments || []).find((a: Record<string, unknown>) => a.id === s.assignment_id)
      const subj = (assignment?.subject_id || assignment?.subject || 'unknown') as string
      const cur = assignBySubject.get(subj) || { total: 0, count: 0 }
      cur.total += s.grade as number
      cur.count += 1
      assignBySubject.set(subj, cur)
    }

    // pupil exam averages per subject
    const pupilExams = examAttempts.filter(a => a.pupil_id === pupilIdStr)
    const examBySubject = new Map<string, { total: number; count: number }>()
    for (const a of pupilExams) {
      const exam = (exams || []).find((e: Record<string, unknown>) => e.id === a.exam_id)
      const subj = (exam?.subject_id || exam?.subject || 'unknown') as string
      const cur = examBySubject.get(subj) || { total: 0, count: 0 }
      cur.total += a.score as number
      cur.count += 1
      examBySubject.set(subj, cur)
    }

    // pupil test averages per subject
    const pupilTests = testSubmissions.filter(t => t.pupil_id === pupilIdStr)
    const testBySubject = new Map<string, { total: number; count: number }>()
    for (const t of pupilTests) {
      const test = (tests || []).find((x: Record<string, unknown>) => x.id === t.test_id)
      const subj = (test?.subject_id || test?.subject || 'unknown') as string
      const cur = testBySubject.get(subj) || { total: 0, count: 0 }
      cur.total += t.score as number
      cur.count += 1
      testBySubject.set(subj, cur)
    }

    // Collect all subjects that appear
    const subjKeys = new Set<string>()
    ;[...assignBySubject.keys(), ...examBySubject.keys(), ...testBySubject.keys(), ...assignMaxBySubject.keys(), ...examMaxBySubject.keys(), ...testMaxBySubject.keys()].forEach(k => subjKeys.add(k))

    // Compute per-subject breakdown, weighted score and letter grade
    const rows: Array<Record<string, unknown>> = []
    for (const subj of subjKeys) {
      const assignAvg = (() => { const v = assignBySubject.get(subj); return v ? v.total / v.count : null })()
      const examAvg = (() => { const v = examBySubject.get(subj); return v ? v.total / v.count : null })()
      const testAvg = (() => { const v = testBySubject.get(subj); return v ? v.total / v.count : null })()

      const assignMax = assignMaxBySubject.get(subj) ?? null
      const examMax = examMaxBySubject.get(subj) ?? null
      const testMax = testMaxBySubject.get(subj) ?? null

      // weights: exam 60%, tests 30%, assignments 10%
      const weights = { exam: 0.6, test: 0.3, assignment: 0.1 }
      const comps: { score: number | null; weight: number }[] = [ { score: examAvg, weight: weights.exam }, { score: testAvg, weight: weights.test }, { score: assignAvg, weight: weights.assignment } ]
      let weightedTotal = 0
      let weightSum = 0
      for (const c of comps) {
        if (c.score !== null && !Number.isNaN(c.score)) { weightedTotal += (c.score as number) * c.weight; weightSum += c.weight }
      }
      const normalized = weightSum ? Math.round((weightedTotal / weightSum) * 100) / 100 : null

      const grade = (val: number | null) => {
        if (val === null) return 'N/A'
        if (val >= 70) return 'A'
        if (val >= 60) return 'B'
        if (val >= 50) return 'C'
        if (val >= 45) return 'D'
        if (val >= 40) return 'E'
        return 'F'
      }

      rows.push({
        subject: subjectsMap.get(subj) || subj,
        assignment_avg: assignAvg !== null ? Math.round(assignAvg * 100) / 100 : null,
        test_avg: testAvg !== null ? Math.round(testAvg * 100) / 100 : null,
        exam_avg: examAvg !== null ? Math.round(examAvg * 100) / 100 : null,
        assignment_max: assignMax,
        test_max: testMax,
        exam_max: examMax,
        weighted_total: normalized,
        grade: grade(normalized)
      })
    }

    // Build HTML report
    const htmlRows = rows.map(r => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${r.subject}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.assignment_avg ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.test_avg ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.exam_avg ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.weighted_total ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.grade}</td>
      </tr>
    `).join('\n')

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Final Results</title></head><body><h2>Final Results Report</h2><p>Pupil: ${pupilId}</p><p>Class: ${classId}</p><table style="border-collapse:collapse;width:100%"><thead><tr><th style="padding:8px;border:1px solid #ddd">Subject</th><th style="padding:8px;border:1px solid #ddd">Assignment Avg</th><th style="padding:8px;border:1px solid #ddd">Test Avg</th><th style="padding:8px;border:1px solid #ddd">Exam Avg</th><th style="padding:8px;border:1px solid #ddd">Weighted Total</th><th style="padding:8px;border:1px solid #ddd">Grade</th></tr></thead><tbody>${htmlRows}</tbody></table></body></html>`

    // Try to generate PDF via puppeteer if available
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const puppeteer = require('puppeteer')
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
      await browser.close()
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="final-results-${pupilId}.pdf"`
        }
      })
    } catch {
      // Puppeteer not available — fall back to returning HTML
      return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    }

  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Record<string, unknown>).message || String(err) }, { status: 500 })
  }
}
