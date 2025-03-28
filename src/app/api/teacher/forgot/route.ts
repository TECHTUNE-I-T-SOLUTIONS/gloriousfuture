import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required!" }, { status: 400 });
        }

        // Check if the email exists in the teachers table
        const { data, error } = await supabase
            .from("teachers")
            .select("id")
            .eq("email", email)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Email not found!" }, { status: 404 });
        }

        // Send password reset link via Supabase auth
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        });

        if (resetError) {
            return NextResponse.json({ error: "Failed to send reset link!" }, { status: 500 });
        }

        return NextResponse.json({ message: "Password reset link sent successfully!" });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
    }
}
