import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

type PaymentDbRow = { id?: string; pupil_id?: string | null; user_id?: string | null; profile_picture?: string | null }
type PupilSimple = { user_id?: string | null; profile_picture?: string | null }
type PaystackVerifyResponse = { status?: boolean; data?: Record<string, unknown> }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reqReference = searchParams.get('reference')
    if (!reqReference) return NextResponse.json({ error: 'reference required' }, { status: 400 })

    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reqReference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
  const body = (await res.json()) as PaystackVerifyResponse
    if (!body || !body.status) return NextResponse.json({ error: 'verify failed', details: body }, { status: 502 })

    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'verify returned no body' }, { status: 502 })
    const bodyTyped = body as { data?: Record<string, unknown> }
    if (!bodyTyped.data || typeof bodyTyped.data !== 'object') {
      return NextResponse.json({ error: 'verify returned no data' }, { status: 502 })
    }
    const data = bodyTyped.data as Record<string, unknown>
    const status = typeof data.status === 'string' ? data.status : String(data.status ?? '')
    const metadata = (data.metadata && typeof data.metadata === 'object') ? (data.metadata as Record<string, unknown>) : {}
  let paymentId = (metadata && typeof metadata.payment_id === 'string') ? (metadata.payment_id as string) : undefined
    const reference = (typeof data.reference === 'string')
      ? data.reference
      : (typeof data.transaction === 'string' ? data.transaction : reqReference)

    // if metadata.payment_id missing, try to find the payment by reference
      if (!paymentId && reference) {
        const { data: byRef } = await supabase.from('payments').select('id').eq('payment_reference', reference).limit(1).maybeSingle()
        const byRefRow = (byRef as PaymentDbRow) || null
        if (byRefRow && byRefRow.id) paymentId = byRefRow.id
      }

    if (paymentId) {
      // fetch existing payment row so we can populate missing fields
      const { data: existing } = await supabase.from('payments').select('*').eq('id', paymentId).limit(1).maybeSingle()
      const existingRow = (existing as PaymentDbRow) || null

      // prepare update payload
      const updateData: Record<string, unknown> = { status: status }
      // always set payment_reference when available
      if (reference) updateData.payment_reference = reference
      if (status === 'success' || status === 'paid' || status === 'completed') {
        ;(updateData as Record<string, string | null | undefined>).paid_at = new Date().toISOString()
        ;(updateData as Record<string, string | null | undefined>).payment_method = 'paystack'
        ;(updateData as Record<string, string | null | undefined>).status = 'paid'
      }

      // if payment row exists and user_id/profile_picture are missing, try to populate from pupils table
      if (existingRow) {
        const pupilId = existingRow.pupil_id || null
        if ((!existingRow.user_id || !existingRow.profile_picture) && pupilId) {
          const { data: p } = await supabase.from('pupils').select('user_id, profile_picture').eq('id', pupilId).limit(1).maybeSingle()
          const pupil = (p as PupilSimple) || null
          if (pupil) {
            if (!existingRow.user_id && pupil.user_id) (updateData as Record<string, unknown>).user_id = pupil.user_id
            if (!existingRow.profile_picture && pupil.profile_picture) (updateData as Record<string, unknown>).profile_picture = pupil.profile_picture
          }
        }
      }

      console.debug('Paystack verify will update payment', { paymentId, reference, updateData })
      const { data: updData, error: updErr } = await supabase.from('payments').update(updateData).eq('id', paymentId).select('*').maybeSingle()
      if (updErr) console.error('Paystack verify update error', updErr, { paymentId, updateData })
      else console.debug('Paystack verify updated payment row', updData)
    } else if (reference) {
      // fallback: try updating by payment_reference when metadata.payment_id is missing
      const updateData: Record<string, unknown> = { status: status }
      if (status === 'success' || status === 'paid' || status === 'completed') {
        ;(updateData as Record<string, string | null | undefined>).paid_at = new Date().toISOString()
        ;(updateData as Record<string, string | null | undefined>).payment_method = 'paystack'
        ;(updateData as Record<string, string | null | undefined>).status = 'paid'
      }
      if (reference) updateData.payment_reference = reference
      console.debug('Paystack verify fallback update by reference', { reference, updateData })
      const { data: updData, error: updErr } = await supabase.from('payments').update(updateData).eq('payment_reference', reference).select('*').maybeSingle()
      if (updErr) console.error('Paystack verify update-by-reference error', updErr, { reference, updateData })
      else console.debug('Paystack verify updated payment row by reference', updData)
    }

    // support JSON response for client-side verify calls (format=json)
    if (searchParams.get('format') === 'json') {
  return NextResponse.json({ success: true, status, reference: reference, data })
    }

    // redirect to pupil dashboard payments page using absolute URL
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || process.env.NEXT_PUBLIC_SITE_URL || ''
    const protocol = host && host.includes('localhost') ? 'http' : 'https'
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`
    const redirectUrl = `${base}/pupils/pupil-dashboard`
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error('Paystack verify error', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
