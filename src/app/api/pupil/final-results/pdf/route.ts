import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing final_results id' }, { status: 400 })

    const { data } = await supabase.from('final_results').select('*').eq('id', id).single()
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const pupilId = data.pupil_id
    const classId = data.class_id

    // reuse teacher generator approach minimally: produce HTML from stored results
    const results = data.results || []
    const htmlRows = (results as Array<Record<string, unknown>>).map((r: Record<string, unknown>) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${r.subject}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.assignment_avg ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.test_avg ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.exam_avg ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.weighted_total ?? '—'}</td>
        <td style="padding:8px;border:1px solid #ddd">${r.grade}</td>
      </tr>
    `).join('\n')

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Final Results</title></head><body><h2>Final Results</h2><p>Pupil: ${pupilId}</p><p>Class: ${classId}</p><table style="border-collapse:collapse;width:100%"><thead><tr><th style="padding:8px;border:1px solid #ddd">Subject</th><th style="padding:8px;border:1px solid #ddd">Assignment Avg</th><th style="padding:8px;border:1px solid #ddd">Test Avg</th><th style="padding:8px;border:1px solid #ddd">Exam Avg</th><th style="padding:8px;border:1px solid #ddd">Weighted Total</th><th style="padding:8px;border:1px solid #ddd">Grade</th></tr></thead><tbody>${htmlRows}</tbody></table></body></html>`

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
          'Content-Disposition': `attachment; filename="final-results-${id}.pdf"`
        }
      })
    } catch {
      return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html' } })
    }

  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Record<string, unknown>).message || String(err) }, { status: 500 })
  }
}
