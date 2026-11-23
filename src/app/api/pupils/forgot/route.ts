import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const { data, error } = await supabase.from("pupils").select("id").eq("email", email).single();

    if (error || !data) {
      return NextResponse.json({ error: "No pupil account was found with that email address." }, { status: 404 });
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (resetError) {
      return NextResponse.json({ error: "We could not send the reset link. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ message: "Password reset link sent successfully." });
  } catch (error) {
    console.error("Pupil forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
