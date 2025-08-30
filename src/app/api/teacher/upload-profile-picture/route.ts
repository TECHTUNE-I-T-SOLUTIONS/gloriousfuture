import { NextResponse } from "next/server";
import { parse } from "cookie";
import { getSupabaseClient } from "@/lib/supabase";

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
  const supabase = getSupabaseClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase.storage.from("profile-pictures").upload(filePath, file as unknown as Blob, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) return NextResponse.json({ error: String(error.message || error) }, { status: 500 })

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)
  const publicURL = (publicUrlData as { publicUrl?: string })?.publicUrl ?? ""

  // Update teacher profile with new image URL
  await supabase.from("teachers").update({ profile_picture: publicURL }).eq("uin", uin)

  return NextResponse.json({ success: true, url: publicURL })
  } catch (error) {
    console.error("server error:", error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}
