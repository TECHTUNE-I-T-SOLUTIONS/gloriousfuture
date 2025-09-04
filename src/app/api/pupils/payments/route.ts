import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Typed shapes for DB rows used in this route
type PupilRow = { id?: string; uin?: string; class?: string; email?: string; user_id?: string | null; profile_picture?: string | null }
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
      const { data: p } = await supabase.from('pupils').select('id, uin, class, email, user_id, profile_picture').eq('id', pupilId).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    } else {
      const { data: p } = await supabase.from('pupils').select('id, uin, class, email, user_id, profile_picture').eq('uin', uin as string).limit(1).maybeSingle()
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

    // fetch school fee for pupil's class & current session (useful for per-term amounts)
    let schoolFee: SchoolFee | null = null
    if (pupilClass && currentSession) {
      const { data: sf } = await supabase.from('school_fees').select('*').eq('class', pupilClass).eq('session', currentSession).limit(1).maybeSingle()
      schoolFee = (sf as SchoolFee) || null
    }

  // If there are no payments for the current session but we have a school fee and a pupil row,
  // optionally return three term placeholders so the client can render per-term options.
  // NOTE: placeholders are now opt-in via ?placeholders=1 to avoid surprising the UI when the DB is empty.
  const wantPlaceholders = searchParams.get('placeholders') === '1'
  if ((!payments || payments.length === 0) && schoolFee && pupilRow && wantPlaceholders) {
      // if schoolFee contains per-term amounts, use them per placeholder
      type SchoolFeeWithTerms = SchoolFee & { term1_amount?: number | null; term2_amount?: number | null; term3_amount?: number | null }
      const sfTyped = schoolFee as SchoolFeeWithTerms
      const terms = [
        { name: 'Term 1', amount: Number(sfTyped?.term1_amount ?? sfTyped?.amount ?? 0) },
        { name: 'Term 2', amount: Number(sfTyped?.term2_amount ?? sfTyped?.amount ?? 0) },
        { name: 'Term 3', amount: Number(sfTyped?.term3_amount ?? sfTyped?.amount ?? 0) },
      ]
      const placeholders: PaymentRow[] = terms.map((t) => ({
        id: `placeholder-${pupilRow.id}-${t.name.replace(/\s+/g, '-').toLowerCase()}`,
        pupil_id: pupilRow.id || null,
        user_id: pupilRow.user_id ?? null,
        email: pupilRow.email || null,
        class: pupilRow.class || null,
        uin: pupilRow.uin || pupilUin || null,
        profile_picture: pupilRow.profile_picture ?? null,
  amount: Number(t.amount) || null,
        payment_reference: null,
        status: 'pending',
        payment_method: null,
  term: t.name,
        // mark these rows as placeholders so the client can render a different UI if desired
        placeholder: true as unknown as string | null,
        session: currentSession || null,
        paid_at: null,
        created_at: null,
      }))

      const debug = searchParams.get('debug')
    return NextResponse.json({ payments: placeholders, schoolFee, currentSession, termsFormatted: ['Term 1','Term 2','Term 3'], debug: debug ? { source: 'placeholders', dbCount: (payments || []).length } : undefined })
    }
  // always return schoolFee if available so client can show per-term amounts
  const debug = searchParams.get('debug')
  return NextResponse.json({ payments, schoolFee, currentSession, termsFormatted: ['Term 1','Term 2','Term 3'], debug: debug ? { source: 'db', dbCount: (payments || []).length } : undefined })
  } catch (err: unknown) {
    console.error('payments GET error', err)
    return NextResponse.json({ error: (err as Error)?.message || String(err) }, { status: 500 })
  }
}

// Create a payment record (used when no existing payment for the session)
export async function POST(req: NextRequest) {
  try {
  const body = await req.json()
  // debug log incoming payload to aid diagnosing server-side 500s
  console.debug('payments POST received body:', body)
  const { pupilId, uin, amount, class: className, session, terms } = body || {}
  if (!amount || (!uin && !pupilId) || !session) return NextResponse.json({ error: 'uin or pupilId, amount and session required' }, { status: 400 })

    // resolve pupil if only uin provided (also fetch user_id/profile_picture)
    let pupilRow: PupilRow | null = null
    if (pupilId) {
      const { data: p } = await supabase.from('pupils').select('id, email, uin, class, user_id, profile_picture').eq('id', pupilId).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    } else {
      const { data: p } = await supabase.from('pupils').select('id, email, uin, class, user_id, profile_picture').eq('uin', uin as string).limit(1).maybeSingle()
      pupilRow = (p as PupilRow) || null
    }

    // normalize terms: ensure null or array of strings
    const normalizedTerms = Array.isArray(terms) ? terms.map((t) => String(t)) : terms ? [String(terms)] : null

    const insert = {
      pupil_id: pupilRow?.id || null,
      user_id: pupilRow?.user_id ?? null,
      email: pupilRow?.email || null,
      class: className || pupilRow?.class || null,
      uin: pupilRow?.uin || uin,
      profile_picture: pupilRow?.profile_picture ?? null,
      amount: Number(amount),
      status: 'pending',
      payment_method: null,
  // legacy single-term column removed from schema; store term(s) in JSONB `terms` only
  terms: normalizedTerms,
      session,
      paid_at: null,
    }
    const { data, error } = await supabase.from('payments').insert(insert).select('*').maybeSingle()
    if (error) {
      console.error('payments POST supabase insert error', error, { insert })
      return NextResponse.json({ error: (error as Error)?.message || error }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error('payments POST error', err)
    return NextResponse.json({ error: (err as Error)?.message || String(err) }, { status: 500 })
  }
}