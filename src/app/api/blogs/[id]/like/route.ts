/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import supabase from '../../../../../../lib/supabase';

// POST -> add like; DELETE -> remove like. Caller must be authenticated.
async function resolveUser(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  let token: string | null = null;
  if (authHeader.toLowerCase().startsWith('bearer ')) token = authHeader.slice(7).trim();
  if (!token) {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/(?:sb-access-token|sb:token|sb:session|token)=([^;\s]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }
  if (!token) return null;
  const { data } = await supabase.auth.getUser(token);
  return data.user;
}

export async function POST(req: Request, ctx: any) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const blogId = ctx?.params?.id;
  // insert, ignore conflict (unique constraint) to make likes idempotent
  const { error } = await supabase.from('blog_likes').insert([{ blog_id: blogId, user_id: user.id }]);
  if (error) {
    // if constraint violation, return current count instead of error
    if (error.code === '23505') {
      const { data } = await supabase.from('blogs').select('likes_count').eq('id', blogId).maybeSingle();
      return NextResponse.json({ likes_count: data?.likes_count ?? 0 }, { status: 200 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = await supabase.from('blogs').select('likes_count').eq('id', blogId).maybeSingle();
  return NextResponse.json({ likes_count: data?.likes_count ?? 0 }, { status: 200 });
}

export async function DELETE(req: Request, ctx: any) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const blogId = ctx?.params?.id;
  const { error } = await supabase.from('blog_likes').delete().match({ blog_id: blogId, user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = await supabase.from('blogs').select('likes_count').eq('id', blogId).maybeSingle();
  return NextResponse.json({ likes_count: data?.likes_count ?? 0 }, { status: 200 });
}
