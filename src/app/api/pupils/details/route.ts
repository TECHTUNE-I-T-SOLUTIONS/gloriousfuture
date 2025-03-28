import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with Service Role Key for storage access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Ensure this is set securely in environment variables
);

// **GET Pupil Details API**
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  if (!email && !userId) {
    return NextResponse.json({ error: "Email or userId is required." }, { status: 400 });
  }

  let query = supabase.from("pupils").select("full_name, profile_picture, email, class, uin");

  if (email) query = query.eq("email", email);
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query.single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch full profile picture URL from Supabase Storage
  if (data.profile_picture) {
    const { data: publicURL } = supabase.storage.from("avatars").getPublicUrl(data.profile_picture);
    data.profile_picture = publicURL.publicUrl || "/default-profile.png"; // Fallback image
  }

  return NextResponse.json(data, { status: 200 });
}
