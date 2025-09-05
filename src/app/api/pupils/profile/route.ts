import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    if (!cookies.session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = JSON.parse(cookies.session);
    const uin = session.uin;
    if (!uin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { full_name, profile_picture, class_id, class: classText } = body;

    // Update pupils table; allow class_id to be null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePayload: any = {};
    if (full_name) updatePayload.full_name = full_name;
    if (profile_picture) updatePayload.profile_picture = profile_picture;
    if (typeof class_id !== 'undefined') updatePayload.class_id = class_id;
    if (typeof classText !== 'undefined') updatePayload.class = classText;

    const { error } = await supabase.from('pupils').update(updatePayload).eq('uin', uin);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // also update users table full_name if present
    if (full_name) {
      await supabase.from('users').update({ full_name }).eq('uin', uin);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
