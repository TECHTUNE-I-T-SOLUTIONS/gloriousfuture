import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  console.log("API /api/teacher/profile called"); // Debug log

  try {
    const cookies = parse(req.headers.get("cookie") || "");
    if (!cookies.session) {
      console.log("Unauthorized: No session cookie");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(cookies.session);

    const uin = session.uin;
    if (!uin) {
      console.log("Unauthorized: Missing UIN");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch teacher details
    const { data, error } = await supabase
      .from("teachers")
      .select("id, full_name, email, class_taught, years_of_experience, uin, profile_picture")
      .eq("uin", uin)
      .single();

    if (error || !data) {
      console.log("Teacher not found:", error);
      return NextResponse.json({ error: "Teacher not found!" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    if (!cookies.session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = JSON.parse(cookies.session);
    const uin = session.uin;

    if (!uin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { full_name, email, class_taught, years_of_experience, profile_picture } = await req.json();

    const { error } = await supabase
      .from("teachers")
      .update({ full_name, email, class_taught, years_of_experience, profile_picture })
      .eq("uin", uin);

    if (error) return NextResponse.json({ error });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}
