import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🟢 GET: Fetch all alerts (optionally filter by active status)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const showActive = url.searchParams.get("active");

  let query = supabase.from("alerts").select("*").order("created_at", { ascending: false });

  if (showActive === "true") {
    query = query.gte("end_time", new Date().toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

// 🟢 POST: Create a new alert
export async function POST(req: Request) {
  const { teacher_id, message, start_time, end_time } = await req.json();

  const { data, error } = await supabase.from("alerts").insert([{ teacher_id, message, start_time, end_time }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}

// 🟢 PUT: Update an existing alert
export async function PUT(req: Request) {
  const { id, message, start_time, end_time } = await req.json();

  const { data, error } = await supabase
    .from("alerts")
    .update({ message, start_time, end_time })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

// 🟢 DELETE: Delete an alert
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { error } = await supabase.from("alerts").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
