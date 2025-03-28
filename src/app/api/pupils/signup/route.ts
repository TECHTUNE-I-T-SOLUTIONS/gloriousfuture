import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateUIN(classLevel: string): string {
  const uniqueNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit unique number
  let prefix = "GFA-";

  if (classLevel.includes("Primary")) {
    prefix += "P-";
  } else if (classLevel.includes("Nursery") || classLevel.includes("Pre-Nursery")) {
    prefix += "N-";
  } else {
    prefix += "C-"; // Creche
  }

  return `${prefix}${uniqueNumber}`;
}

// **POST: Pupil Signup**
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse form data (for handling file upload)
    
    const full_name = formData.get("full_name") as string;
    const phone_number = formData.get("phone_number") as string;
    const email = formData.get("email") as string;
    const father_name = formData.get("father_name") as string;
    const mother_name = formData.get("mother_name") as string;
    const guardian_name = formData.get("guardian_name") as string;
    const guardian_contact = formData.get("guardian_contact") as string;
    const classLevel = formData.get("classLevel") as string;
    const password = formData.get("password") as string;
    const profile_picture = formData.get("profile_picture") as File | null;

    // Validate input
    if (!full_name || !email || !password || !classLevel) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser, error: findUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (findUserError) {
      return NextResponse.json({ error: findUserError.message }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Unique UIN before inserting into the users table
    const generatedUIN = generateUIN(classLevel);

    // Create user in the users table with full_name, role, and uin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          full_name, // Save pupil's full name
          email,
          username: full_name.replace(/\s+/g, "").toLowerCase(), // Generate username from full name
          password: hashedPassword,
          role: "pupil", // Set the role as pupil
          uin: generatedUIN, // ✅ Use the generated UIN
        },
      ])
      .select("id")
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const userId = userData.id;

    let profile_picture_url = null;

    // Handle Profile Picture Upload
    if (profile_picture) {
      const fileExt = profile_picture.name.split(".").pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `profile_pictures/${fileName}`;

      // Convert File to Blob
      const profileBlob = new Blob([await profile_picture.arrayBuffer()], { type: profile_picture.type });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pupil-profiles")
        .upload(filePath, profileBlob, {
          cacheControl: "3600",
          upsert: true,
          contentType: profile_picture.type, // Ensure correct content type
        });

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      profile_picture_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pupil-profiles/${filePath}`;
    }

    // Insert pupil record and link to user ID
    const { data: pupilData, error: pupilError } = await supabase.from("pupils").insert([
      {
        user_id: userId, // Link user to pupil
        full_name,
        phone_number,
        email,
        father_name,
        mother_name,
        guardian_name,
        guardian_contact,
        class: classLevel,
        profile_picture: profile_picture_url,
        uin: generatedUIN,
        password: hashedPassword, // Add this
      },
    ]);

    if (pupilError) {
      return NextResponse.json({ error: pupilError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Signup successful", uin: generatedUIN }, { status: 201 });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Something went wrong.", details: err.message }, { status: 500 });
  }
}
