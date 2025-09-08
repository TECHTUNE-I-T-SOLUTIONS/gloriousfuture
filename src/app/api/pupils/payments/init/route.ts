import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    if (!paymentId) return NextResponse.json({ error: 'payment_id required' }, { status: 400 })
    const { data, error } = await supabase.from('payments').select('*').eq('id', paymentId).limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'payment not found' }, { status: 404 })

    const amount = Number(data.amount || 0)
    const amount_kobo = Math.round(amount * 100)
    const reference = data.payment_reference || data.id

    // If server has Paystack secret, attempt to initialize a transaction server-side for a more robust flow.
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    let authorization_url: string | null = null
    let access_code: string | null = null
    let paystack_response: Record<string, unknown> | null = null

    if (paystackSecret && typeof paystackSecret === 'string' && paystackSecret.length > 0) {
      try {
        const payload = {
          email: data.email || undefined,
          amount: amount_kobo,
          reference,
        }
        const res = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        paystack_response = json
        // Log Paystack response for debugging (use typed status access)
        try {
          const httpStatus = typeof (res as unknown as { status?: number }).status === 'number' ? (res as unknown as { status?: number }).status : null
          await supabase.from('paystack_response_logs').insert({
            source: 'init',
            payment_id: paymentId,
            reference: reference ?? null,
            http_status: httpStatus,
            raw_response: json ?? null,
          })
        } catch (logErr) {
          console.error('failed to insert paystack init log', logErr)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jsonAny: any = json
        if (jsonAny && jsonAny.status && jsonAny.data) {
          authorization_url = jsonAny.data.authorization_url ?? null
          access_code = jsonAny.data.access_code ?? null
        }
      } catch (e) {
        console.error('paystack initialize error', e)
      }
    }

    return NextResponse.json({ amount, amount_kobo, reference, payment: data, authorization_url, access_code, paystack_response })
  } catch (err: unknown) {
    console.error('payment init GET error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}
