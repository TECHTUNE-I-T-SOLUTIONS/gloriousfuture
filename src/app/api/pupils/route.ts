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


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// **POST: Pupil Signup**
export async function POST(req: NextRequest) {
  const { full_name, phone_number, email, father_name, mother_name, classLevel, profile_picture, uin } = await req.json();

  let generatedUIN = uin;
  if (!uin) {
    generatedUIN = generateUIN(classLevel); // Generate UIN if not provided
  }

  const { data, error } = await supabase.from("pupils").insert([
    { full_name, phone_number, email, father_name, mother_name, class: classLevel, profile_picture, uin: generatedUIN }
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Signup successful", uin: generatedUIN }, { status: 201 });
}


// **POST: Pupil Login**
export async function POST(req: NextRequest) {
  const { uin, password } = await req.json();

  const { data, error } = await supabase
    .from("pupils")
    .select("*")
    .eq("uin", uin)
    .single();

  if (error || !data) return NextResponse.json({ error: "Invalid UIN or password" }, { status: 401 });

  return NextResponse.json({ message: "Login successful", pupil: data }, { status: 200 });
}
