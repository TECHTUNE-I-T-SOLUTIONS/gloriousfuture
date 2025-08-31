import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Typed shapes for DB rows used in this route
type PupilRow = { id?: string; uin?: string; class?: string; email?: string }
type SessionRow = { session?: string; active?: boolean }
type SchoolFee = { id?: string; class?: string; amount?: number; session?: string }
type PaymentRow = { id?: string; pupil_id?: string | null; user_id?: string | null; email?: string | null; class?: string | null; uin?: string | null; profile_picture?: string | null; amount?: number | null; payment_reference?: string | null; status?: string | null; payment_method?: string | null; term?: string | null; session?: string | null; paid_at?: string | null; created_at?: string | null }

// Returns payments for the pupil for the current session and the school fee for their class when no payment exists
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uin = searchParams.get("uin");
    const pupilId = searchParams.get("pupilId") || searchParams.get("pupil_id");

    if (!uin && !pupilId) return NextResponse.json({ error: 'uin or pupilId required' }, { status: 400 });

    // resolve pupil if needed
    let pupilRow: PupilRow | null = null
    if (pupilId && !uin) {
      const { data: p } = await supabase.from('pupils').select('id, uin, class, email').eq('id', pupilId).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    } else {
      const { data: p } = await supabase.from('pupils').select('id, uin, class, email').eq('uin', uin as string).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    }

    const pupilUin = pupilRow?.uin || uin
    const pupilClass = pupilRow?.class || null

    // determine current session from a small school_session table, fall back to most recent school_fees session
    let currentSession: string | null = null
    const { data: cs } = await supabase.from('school_session').select('session, active').eq('active', true).limit(1).maybeSingle()
    if ((cs as SessionRow)?.session) currentSession = (cs as SessionRow).session || null
    if (!currentSession) {
      const { data: sf } = await supabase.from('school_fees').select('session').order('created_at', { ascending: false }).limit(1).maybeSingle()
      if ((sf as SchoolFee)?.session) currentSession = (sf as SchoolFee).session || null
    }

    // fetch payments for this pupil for the current session
    let payments: PaymentRow[] = []
    if (pupilUin) {
      let q = supabase.from('payments').select('*').eq('uin', pupilUin)
      if (currentSession) q = q.eq('session', currentSession)
      const { data: ps } = await q
      payments = (ps as PaymentRow[]) || []
    }

    // if no payments for current session, fetch school fee for pupil's class
    let schoolFee: SchoolFee | null = null
    if ((!payments || payments.length === 0) && pupilClass && currentSession) {
      const { data: sf } = await supabase.from('school_fees').select('*').eq('class', pupilClass).eq('session', currentSession).limit(1).maybeSingle()
      schoolFee = (sf as SchoolFee) || null
    }

    return NextResponse.json({ payments, schoolFee, currentSession })
  } catch (err: unknown) {
    console.error('payments GET error', err)
    return NextResponse.json({ error: (err as Error)?.message || String(err) }, { status: 500 })
  }
}

// Create a payment record (used when no existing payment for the session)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pupilId, uin, amount, class: className, session } = body || {}
    if (!amount || (!uin && !pupilId) || !session) return NextResponse.json({ error: 'uin or pupilId, amount and session required' }, { status: 400 })

    // resolve pupil if only uin provided
    let pupilRow: PupilRow | null = null
    if (pupilId) {
      const { data: p } = await supabase.from('pupils').select('id, email, uin, class').eq('id', pupilId).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    } else {
      const { data: p } = await supabase.from('pupils').select('id, email, uin, class').eq('uin', uin as string).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    }

    const insert = {
      pupil_id: pupilRow?.id || null,
      user_id: null,
      email: pupilRow?.email || null,
      class: className || pupilRow?.class || null,
      uin: pupilRow?.uin || uin,
      profile_picture: null,
      amount: Number(amount),
      status: 'pending',
      payment_method: null,
      term: null,
      session,
      paid_at: null,
    }

  const { data, error } = await supabase.from('payments').insert(insert).select('*').maybeSingle()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error('payments POST error', err)
    return NextResponse.json({ error: (err as Error)?.message || String(err) }, { status: 500 })
  }
}