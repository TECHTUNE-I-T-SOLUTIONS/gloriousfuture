
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import { parse } from "cookie";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const teacherUIN = url.searchParams.get("uin");

    if (!teacherUIN) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No UIN provided" },
        { status: 401 }
      );
    }

    console.log("Fetching details for UIN:", teacherUIN);

    const { data: teacher, error } = await supabase
      .from("teachers")
      .select("uin, full_name, profile_picture")
      .eq("uin", teacherUIN)
      .single();

    if (error || !teacher) {
      console.log("Teacher Not Found:", error);
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Fix the profile picture URL handling
    let profilePictureUrl = "/default-profile.png";
    if (teacher.profile_picture) {
      if (teacher.profile_picture.startsWith("http")) {
        profilePictureUrl = teacher.profile_picture; // Already a full URL
      } else {
        profilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/teachers-profile/${teacher.profile_picture}`;
      }
    }

    return NextResponse.json({
      success: true,
      uin: teacher.uin,
      name: teacher.full_name,
      profile_picture: profilePictureUrl,
    });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
