import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const full_name = formData.get("full_name")?.toString().trim();
    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const class_taught = formData.get("class_taught")?.toString().trim();
    const years_of_experience = parseInt(formData.get("years_of_experience") as string);
    const profile_picture = formData.get("profile_picture") as File | null;

    if (!full_name || !username || !email || !password || !class_taught || isNaN(years_of_experience)) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uin = `GFA-T-${Math.floor(1000 + Math.random() * 9000)}`;

    let profile_picture_url = "";

    if (profile_picture) {
      const fileExt = profile_picture.name.split(".").pop();
      const filePath = `profiles/${uin}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("teachers-profile")
        .upload(filePath, profile_picture, {
          cacheControl: "3600",
          upsert: true,
          contentType: profile_picture.type,
        });

      if (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Profile picture upload failed" }, { status: 500 });
      }

      // ✅ Correctly retrieve the public URL
      const { data: urlData } = supabase.storage.from("teachers-profile").getPublicUrl(filePath);
      profile_picture_url = urlData.publicUrl;
    }

    const { data: user, error: userInsertError } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword, role: "teacher", uin, username, full_name }])
      .select()
      .single();

    if (userInsertError) throw userInsertError;

    await supabase
      .from("teachers")
      .insert([{ 
        user_id: user.id, 
        class_taught, 
        years_of_experience, 
        email, 
        password: hashedPassword, 
        username, 
        full_name, 
        uin,
        profile_picture: profile_picture_url 
      }]);

    return NextResponse.json({ message: "Signup successful", user, uin }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
