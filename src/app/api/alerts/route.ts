import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (anon key). For server-side user resolution we
// will pass the access token to auth.getUser when available.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper: try to extract an access token from Authorization header or cookies
async function resolveUserFromReq(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    let token: string | null = null;
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }

    if (!token) {
      const cookie = req.headers.get('cookie') || '';
      // check common cookie names set by supabase client
      const match = cookie.match(/(?:sb-access-token|sb:token|sb:session|token)=([^;\s]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }

    if (!token) return { user: null, token: null };

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return { user: null, token };
    return { user: data.user, token };
  } catch (err) {
    console.error(err);
    return { user: null, token: null };
  }
}

// Type definitions for stricter typing (avoid explicit `any`)
interface Alert {
  id: string;
  teacher_id?: string | null;
  end_time?: string | null;
  all_classes?: boolean;
  [key: string]: unknown;
}

interface InsertAlertPayload {
  teacher_id: string | null;
  message?: string;
  start_time?: string | null;
  end_time?: string | null;
  all_classes?: boolean;
}

export async function GET(req: Request) {
  // read optional query param to filter active alerts
  const url = new URL(req.url);
  const showActive = url.searchParams.get("active") || "false";

  // fetch alerts from Supabase
  const { data, error } = await supabase.from("alerts").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let alerts: Alert[] = (data || []) as Alert[];

  // optionally filter active on server-side
  if (showActive === "true") {
    alerts = alerts.filter((a: Alert) => (a.end_time ? new Date(a.end_time) >= new Date() : false));
  }

  return NextResponse.json(alerts, { status: 200 });
}

// 🟢 POST: Create a new alert
export async function POST(req: Request) {
  // Enforce identity: resolve user from token and map to teacher record.
  const { user } = await resolveUserFromReq(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { message, start_time, end_time, class_ids, all_classes } = body;

  // Map authenticated user -> teacher record. Assumption: teachers table has a
  // user_id column referencing auth.users.id, otherwise teacher.id may equal user.id.
  let teacherId: string | null = null;
  // Try to resolve teacher by user_id first, then fallback to teacher id equal to user id
  const { data: tByUser } = await supabase.from('teachers').select('id, user_id').eq('user_id', user.id).maybeSingle();
  if (tByUser && tByUser.id) {
    teacherId = tByUser.id;
  } else {
    const { data: tById } = await supabase.from('teachers').select('id').eq('id', user.id).maybeSingle();
    if (tById && tById.id) teacherId = tById.id;
  }

  if (!teacherId) return NextResponse.json({ error: 'Forbidden: not a teacher' }, { status: 403 });

  const insertPayload: InsertAlertPayload = { teacher_id: teacherId, message, start_time, end_time, ...(all_classes ? { all_classes: true } : {}) };

  const { data, error } = await supabase.from('alerts').insert([insertPayload]).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const alertId = data?.id;

  // insert join rows
  if (!all_classes && Array.isArray(class_ids) && class_ids.length > 0) {
    const rows = class_ids.map((cid: string) => ({ alert_id: alertId, class_id: cid }));
    await supabase.from('alert_classes').insert(rows);
  }

  return NextResponse.json({ id: alertId }, { status: 201 });
}

// 🟢 PUT: Update an existing alert
export async function PUT(req: Request) {
  const { user } = await resolveUserFromReq(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, message, start_time, end_time, class_ids, all_classes } = await req.json();

  // fetch the existing alert to verify ownership
  const { data: existing, error: fetchErr } = await supabase.from('alerts').select('id, teacher_id').eq('id', id).maybeSingle();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // resolve teacher id for caller
  let teacherId: string | null = null;
  const { data: tByUser } = await supabase.from('teachers').select('id, user_id').eq('user_id', user.id).maybeSingle();
  if (tByUser && tByUser.id) teacherId = tByUser.id;
  else {
    const { data: tById } = await supabase.from('teachers').select('id').eq('id', user.id).maybeSingle();
    if (tById && tById.id) teacherId = tById.id;
  }
  if (!teacherId) return NextResponse.json({ error: 'Forbidden: not a teacher' }, { status: 403 });

  if (existing.teacher_id !== teacherId) return NextResponse.json({ error: 'Forbidden: not owner' }, { status: 403 });

  const updatePayload: Partial<InsertAlertPayload> = { message, start_time, end_time };
  if (typeof all_classes === 'boolean') updatePayload.all_classes = all_classes;

  const { data, error } = await supabase.from('alerts').update(updatePayload).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // update join rows when provided
  if (Array.isArray(class_ids)) {
    // remove existing
    await supabase.from('alert_classes').delete().eq('alert_id', id);
    if (!all_classes && class_ids.length > 0) {
      const rows = class_ids.map((cid: string) => ({ alert_id: id, class_id: cid }));
      await supabase.from('alert_classes').insert(rows);
    }
  }

  return NextResponse.json(data, { status: 200 });
}

// 🟢 DELETE: Delete an alert
export async function DELETE(req: Request) {
  const { user } = await resolveUserFromReq(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();

  const { data: existing, error: fetchErr } = await supabase.from('alerts').select('id, teacher_id').eq('id', id).maybeSingle();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // resolve teacher id for caller
  let teacherId: string | null = null;
  const { data: tByUser } = await supabase.from('teachers').select('id, user_id').eq('user_id', user.id).maybeSingle();
  if (tByUser && tByUser.id) teacherId = tByUser.id;
  else {
    const { data: tById } = await supabase.from('teachers').select('id').eq('id', user.id).maybeSingle();
    if (tById && tById.id) teacherId = tById.id;
  }
  if (!teacherId) return NextResponse.json({ error: 'Forbidden: not a teacher' }, { status: 403 });

  if (existing.teacher_id !== teacherId) return NextResponse.json({ error: 'Forbidden: not owner' }, { status: 403 });

  // delete will cascade for join table if foreign key set to cascade; otherwise remove join rows first
  await supabase.from('alert_classes').delete().eq('alert_id', id);
  const { error } = await supabase.from('alerts').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
