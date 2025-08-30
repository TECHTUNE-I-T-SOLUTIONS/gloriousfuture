import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

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
  // Support ?self=1 to fetch from session
  const self = searchParams.get("self");

  let query = supabase.from("pupils").select("full_name, profile_picture, email, class, uin");

  if (email) query = query.eq("email", email);
  if (userId) query = query.eq("user_id", userId);

  // If ?self=1 or no email/userId, use session cookie
  if ((!email && !userId) || self === "1") {
    // Get session cookie
    let sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) {
      // Try fallback for older Next.js
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cookies = parse(cookieHeader);
        sessionCookie = cookies.session;
      }
    }
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const sessionData = JSON.parse(sessionCookie);
      if (!sessionData.uin) {
        return NextResponse.json({ error: "Session missing UIN" }, { status: 400 });
      }
      query = supabase.from("pupils").select("full_name, profile_picture, email, class, uin").eq("uin", sessionData.uin);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
  }

  const { data, error } = await query.single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch full profile picture URL from Supabase Storage
  if (data.profile_picture) {
    if (typeof data.profile_picture === "string" && data.profile_picture.startsWith("http")) {
      // Already a full URL
      // Do nothing
    } else {
      // Assume it's a path in pupil-profiles bucket
      const { data: publicURL } = supabase.storage.from("pupil-profiles").getPublicUrl(data.profile_picture);
      data.profile_picture = (publicURL && publicURL.publicUrl) || "/default-profile.png";
    }
  } else {
    data.profile_picture = "/default-profile.png";
  }

  return NextResponse.json(data, { status: 200 });
}
