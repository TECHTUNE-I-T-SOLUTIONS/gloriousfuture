import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paymentId } = body || {}
    if (!paymentId) return NextResponse.json({ error: 'paymentId required' }, { status: 400 })

    // lookup payment
  const { data: payment, error: pErr } = await supabase.from('payments').select('*').eq('id', paymentId).limit(1).maybeSingle()
  if (pErr || !payment) return NextResponse.json({ error: 'payment not found' }, { status: 404 })
    const uin = payment.uin
    if (!uin) return NextResponse.json({ error: 'payment missing uin' }, { status: 400 })

    // lookup pupil email
  const { data: pupil } = await supabase.from('pupils').select('email').eq('uin', uin).limit(1).maybeSingle()
  const email = pupil && typeof (pupil as Record<string, unknown>).email === 'string' ? ((pupil as Record<string, unknown>).email as string) : null
    if (!email) return NextResponse.json({ error: 'pupil email not found' }, { status: 400 })

    // build callback URL
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || process.env.NEXT_PUBLIC_SITE_URL || ''
    const protocol = host && host.includes('localhost') ? 'http' : 'https'
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`

    const amountKobo = Math.round(Number(payment.amount) * 100)

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        callback_url: `${base}/api/pupils/paystack/verify`,
        metadata: { payment_id: paymentId },
      }),
    })

    const data = await initRes.json()
    if (!data || !data.status) return NextResponse.json({ error: 'failed to init payment', details: data }, { status: 502 })

    return NextResponse.json(data.data)
  } catch (err) {
    console.error('Paystack init error', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
