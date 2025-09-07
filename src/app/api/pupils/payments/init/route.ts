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
  // return both amount (NGN) and amount_kobo for compatibility
  return NextResponse.json({ amount, amount_kobo, reference, payment: data })
  } catch (err: unknown) {
    console.error('payment init GET error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}
