import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')
    if (!reference) return NextResponse.json({ error: 'reference required' }, { status: 400 })

    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const body = await res.json()
    if (!body || !body.status) return NextResponse.json({ error: 'verify failed', details: body }, { status: 502 })

    const status = body.data.status
    const metadata = body.data.metadata || {}
    const paymentId = metadata.payment_id

    if (paymentId) {
      // update payments table
      const updateData: Record<string, unknown> = { status: status, payment_reference: reference }
      if (status === 'success' || status === 'paid' || status === 'completed') {
        ;(updateData as Record<string, string | null | undefined>).paid_at = new Date().toISOString()
        ;(updateData as Record<string, string | null | undefined>).payment_method = 'paystack'
      }
      await supabase.from('payments').update(updateData).eq('id', paymentId)
    }

    // redirect to pupil dashboard payments page
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/pupils/pupil-dashboard` : '/pupils/pupil-dashboard'
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error('Paystack verify error', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
