/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import supabase from '../../../../../../lib/supabase';

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

// Use flexible ctx typing to avoid App Router type-generation mismatches
export async function GET(req: Request, ctx: any) {
  const blogId = ctx?.params?.id;
  const { data, error } = await supabase.from('blog_comments').select('*').eq('blog_id', blogId).order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || [], { status: 200 });
}

export async function POST(req: Request, ctx: any) {
  const user = await resolveUser(req);
  const blogId = ctx?.params?.id;
  const body = await req.json();
  const { content, parent_id } = body;

  const row: { blog_id: string; content: string; parent_id: string | null; user_id?: string | null; author_name?: string } = { blog_id: blogId, content, parent_id: parent_id || null };
  if (user) {
    row.user_id = user.id;
    row.author_name = user.user_metadata?.full_name || user.email || 'User';
  } else {
    row.user_id = null;
    row.author_name = body.author_name || 'Anonymous';
  }

  const { data, error } = await supabase.from('blog_comments').insert([row]).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
