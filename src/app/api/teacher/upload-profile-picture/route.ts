import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    if (!cookies.session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = JSON.parse(cookies.session);
    const uin = session.uin;

    if (!uin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const fileExt = file.type.split("/")[1];
    const fileName = `${uin}-profile.${fileExt}`;
    const filePath = `profile_pictures/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage.from("profile-pictures").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) return NextResponse.json({ error });

    // Get public URL
    const { publicURL } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

    // Update teacher profile with new image URL
    await supabase.from("teachers").update({ profile_picture: publicURL }).eq("uin", uin);

    return NextResponse.json({ success: true, url: publicURL });
  } catch (error) {
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}
