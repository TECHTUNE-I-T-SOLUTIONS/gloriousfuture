import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // Get `uin` from query parameters
    const { searchParams } = new URL(req.url);
    const uin = searchParams.get("uin");

    if (!uin) {
      return NextResponse.json({ success: false, error: "Missing UIN" }, { status: 400 });
    }

    // Query database for user ID based on UIN
    const { data, error } = await supabase
      .from("users") // Change "users" to your actual table name
      .select("id") // Adjust if your user ID column has a different name
      .eq("uin", uin)
      .single(); // Expecting one user per UIN

    if (error || !data) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user_id: data.id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
