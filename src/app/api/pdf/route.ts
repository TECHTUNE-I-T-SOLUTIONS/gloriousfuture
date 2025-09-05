import { NextResponse } from 'next/server'
import { chromium } from 'playwright'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const url = body?.url
    if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 })

    // launch headless chromium
    const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] })
    try {
      const context = await browser.newContext()

      // if the incoming request has cookies (session), pass them to the browser context
      const cookieHeader = req.headers.get('cookie')
      if (cookieHeader) {
        try {
          const cookies = cookieHeader.split(';').map((c) => {
              const [rawName, ...rest] = c.split('=')
              const name = rawName.trim()
              const value = rest.join('=').trim()
              return { name, value, domain: new URL(url).hostname, path: '/' }
            })
            // Playwright expects Cookie[]; cast safely here
            await context.addCookies(cookies as unknown as Parameters<typeof context.addCookies>[0])
  } catch {
          // ignore cookie parsing errors
        }
      }

      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })

      const pdf = await page.pdf({ format: 'A4', printBackground: true })

      // Return PDF bytes
      return new Response(pdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="page.pdf"',
        },
      })
    } finally {
      await browser.close()
    }
  } catch (err) {
    console.error('pdf generation error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
