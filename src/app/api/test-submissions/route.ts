import { NextResponse } from "next/server";
import { parseCookie } from "cookie";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });

    const body = await req.json();
    const { test_id, pupil_id: pupilIdFromBody, answers } = body;
    if (!test_id) return NextResponse.json({ success: false, error: 'test_id required' }, { status: 400 });

    // Resolve pupil id from session cookie if not provided
    let pupil_id = pupilIdFromBody;
    // If no pupil_id in body, try to resolve from session cookie. Be permissive: session.uin may be a uin or uuid or email.
    if (!pupil_id) {
      const cookieHeader = req.headers.get('cookie') || '';
      const cookies = parseCookie(cookieHeader);
      if (!cookies.session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      let session = null;
      try { session = JSON.parse(cookies.session); } catch { return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 400 }); }
      if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

      // Try several fallbacks to find the pupil record
      const lookups: Array<[string, string]> = [];
      if (session.uin) lookups.push(['uin', String(session.uin)]);
      if (session.id) lookups.push(['id', String(session.id)]);
      if (session.email) lookups.push(['email', String(session.email)]);

  let found: unknown = null;
      for (const [col, val] of lookups) {
        const { data: pupilData, error: pupilErr } = await supabase.from('pupils').select('id').eq(col, val).maybeSingle();
        if (!pupilErr && pupilData?.id) { found = pupilData; break; }
      }
  if (!found) return NextResponse.json({ success: false, error: 'Pupil not found' }, { status: 404 });
  const f = found as { id?: string };
  if (!f.id) return NextResponse.json({ success: false, error: 'Pupil not found' }, { status: 404 });
  pupil_id = f.id as string;
    }

    // Prevent duplicate submissions: one submission per pupil per test
    const { data: existing, error: existingErr } = await supabase.from('test_submissions').select('id, submitted_at').eq('test_id', test_id).eq('pupil_id', pupil_id).maybeSingle();
    if (existingErr) {
      // continue but log
      console.warn('Error checking existing submission:', existingErr);
    }
    if (existing && existing.id) {
      return NextResponse.json({ success: false, error: 'Already submitted', data: existing }, { status: 409 });
    }

  const { data, error } = await supabase.from('test_submissions').insert([{ test_id, pupil_id, answers }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get('testId');
    const limit = Number(searchParams.get('limit') || '20');
    const offset = Number(searchParams.get('offset') || '0');
    const mine = searchParams.get('mine')
    if (!testId) return NextResponse.json({ success: false, error: 'testId is required' }, { status: 400 });

    // If caller wants only the current pupil's submission, resolve pupil and return a single record
    if (mine === '1' || mine === 'true') {
      const cookieHeader = req.headers.get('cookie') || '';
      const cookies = parseCookie(cookieHeader);
      if (!cookies.session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      let session = null;
      try { session = JSON.parse(cookies.session); } catch { return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 400 }); }
      if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

      // attempt to find pupil id same way as POST
      const lookups: Array<[string, string]> = [];
      if (session.uin) lookups.push(['uin', String(session.uin)]);
      if (session.id) lookups.push(['id', String(session.id)]);
      if (session.email) lookups.push(['email', String(session.email)]);
  let found: unknown = null;
      for (const [col, val] of lookups) {
        const { data: pupilData, error: pupilErr } = await supabase.from('pupils').select('id').eq(col, val).maybeSingle();
        if (!pupilErr && pupilData?.id) { found = pupilData; break; }
      }
  if (!found) return NextResponse.json({ success: true, data: null, total: 0 });
  const f2 = found as { id?: string };
  if (!f2.id) return NextResponse.json({ success: true, data: null, total: 0 });

  const { data, error } = await supabase.from('test_submissions').select('*').eq('test_id', testId).eq('pupil_id', f2.id).maybeSingle();
      if (error) throw error;
      return NextResponse.json({ success: true, data, total: data ? 1 : 0 });
    }

    // Regular public/paginated listing: fetch submissions then fetch pupil details separately to avoid complex relational selects that may fail
    const { data, error } = await supabase.from('test_submissions').select('id, pupil_id, answers, score, submitted_at').eq('test_id', testId).order('submitted_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) throw error;

    // get total count
    const { count: totalCount } = await supabase.from('test_submissions').select('id', { count: 'exact', head: true }).eq('test_id', testId);

  const pupilIds = Array.from(new Set((data || []).map((d: unknown) => ((d as Record<string, unknown>)?.pupil_id as string | undefined)).filter(Boolean)));
  const pupilsMap: Record<string, unknown> = {};
    if (pupilIds.length > 0) {
  // request full_name where available
  const { data: pupils } = await supabase.from('pupils').select('id, full_name').in('id', pupilIds);
      if (pupils && Array.isArray(pupils)) {
        for (const p of pupils) {
          const pp = p as Record<string, unknown>
          const pid = String(pp.id)
          pupilsMap[pid] = pp
        }
      }
    }

    const out = (data || []).map((d: unknown) => {
      const dd = d as { id?: string; pupil_id?: string; answers?: unknown; score?: number | null; submitted_at?: string }
      return { id: dd.id, pupil_id: dd.pupil_id, answers: dd.answers, score: dd.score, submitted_at: dd.submitted_at, pupils: pupilsMap[dd.pupil_id ?? ''] ?? null }
    });
    return NextResponse.json({ success: true, data: out, total: Number(totalCount || 0) });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });

    const body = await req.json();
    const { id, score } = body;
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });

    const { data, error } = await supabase.from('test_submissions').update({ score }).eq('id', id).select().single();
    if (error) {
      console.error('failed to update submission score', error)
      return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 })
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
