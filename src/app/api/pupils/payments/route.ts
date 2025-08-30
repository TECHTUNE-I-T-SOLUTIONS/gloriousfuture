import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uin = searchParams.get("uin");
  let query = supabase.from("payments").select("*");
  if (uin) query = query.eq("uin", uin);
  const { data, error } = await query;
  return error ? NextResponse.json({ error }) : NextResponse.json(data);
} 