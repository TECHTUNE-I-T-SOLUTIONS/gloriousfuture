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

    // ensure amount is present; if missing try to resolve from school_fees for the pupil class/session
    let amountValue = typeof (payment.amount) === 'number' ? Number(payment.amount) : (payment.amount ? Number(payment.amount) : null)
    type FeeRow = { amount?: number }
    // If payment.row doesn't have class, try to lookup the pupil's class using uin
    let pupilClass = payment.class
    if (!pupilClass && uin) {
      const { data: pRow } = await supabase.from('pupils').select('class').eq('uin', uin).limit(1).maybeSingle()
      const p = (pRow as { class?: string }) || null
      if (p && p.class) pupilClass = p.class
    }
    if ((!amountValue || amountValue <= 0) && pupilClass) {
      const { data: sf } = await supabase.from('school_fees').select('amount, session').eq('class', pupilClass).limit(1).maybeSingle()
      const fee = (sf as FeeRow) || null
      if (fee && fee.amount) amountValue = Number(fee.amount)
    }
    if (!amountValue || Number.isNaN(amountValue) || amountValue <= 0) {
      return NextResponse.json({ error: 'payment amount missing or invalid' }, { status: 400 })
    }

    const amountKobo = Math.round(amountValue * 100)

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

  // attempt to persist the returned reference on the payment row so verify can find it later
  const reference = (data?.data?.reference) || (data?.reference) || null
  if (reference) {
    try {
      await supabase.from('payments').update({ payment_reference: reference }).eq('id', paymentId)
    } catch (e) {
      console.error('failed to update payment reference', e)
    }
  }

  // return the paystack response and the resolved amount so the client can rely on it
  return NextResponse.json({ paystack: data, amount: amountValue, amountKobo, reference })
  } catch (err) {
    console.error('Paystack init error', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
