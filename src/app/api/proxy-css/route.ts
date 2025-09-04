import { NextRequest } from 'next/server'

// Very small, allowlisted proxy endpoint to fetch a known external CSS file server-side
// This avoids client-side CORS issues when trying to inline vendor styles during capture.
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('u')
    if (!url) return new Response('missing url', { status: 400 })

    // allowlist: only permit fetching exact known vendor CSS to avoid open proxy
    const allowed = [
      'https://paystack.com/public/css/button.min.css',
    ]
    if (!allowed.includes(url)) return new Response('not allowed', { status: 403 })

    const res = await fetch(url)
    if (!res.ok) return new Response('upstream fetch failed', { status: 502 })
    const text = await res.text()
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new Response('error', { status: 500 })
  }
}
