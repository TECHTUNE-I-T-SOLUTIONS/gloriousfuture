import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🟢 GET: Fetch all blog posts
export async function GET() {
  const { data, error } = await supabase.from("blogs").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
 
// 🟢 POST: Create a new blog post with an optional image
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Get form fields
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author_name = formData.get("author_name") as string;
    const author_role = formData.get("author_role") as string;
    const user_id = formData.get("author_id") as string; // Now using user_id directly
    const file = formData.get("image") as File | null;

    console.log("📌 Received Data:", { title, content, author_name, author_role, user_id });

    // Validate required fields
    if (!title || !content || !author_name || !author_role || !user_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let imageUrl = null;

    // 🟢 Handle Image Upload Properly
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `blog/${Date.now()}.${fileExt}`;

      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("blog")
        .upload(filePath, fileBuffer, {
          contentType: file.type, // Ensure correct MIME type
          upsert: true, // Overwrite if the file exists
        });

      if (uploadError) {
        console.error("🛑 Image Upload Error:", uploadError.message);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      // Get the public URL
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/${filePath}`;
    }

    // 🟢 Insert blog post into the database
    const { error } = await supabase.from("blogs").insert([
      { title, content, author_id: user_id, author_name, author_role, image_url: imageUrl },
    ]);

    if (error) {
      console.error("🛑 Database Insert Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Blog created successfully" }, { status: 201 });
  } catch (err) {
    console.error("🛑 Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🟢 PUT: Update a blog post (including the image)
export async function PUT(req: Request) {
  const formData = await req.formData();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const file = formData.get("image") as File | null;

  let imageUrl = formData.get("existingImage") as string | null;

  if (file) {
    const filePath = `blog/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog")
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/${filePath}`;
  }

  const { data, error } = await supabase
    .from("blogs")
    .update({ title, content, image_url: imageUrl })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

// 🟢 DELETE: Delete a blog post
export async function DELETE(req: Request) {
  const { id, imageUrl } = await req.json();

  if (imageUrl) {
    const imagePath = imageUrl.split("/blog/")[1];
    await supabase.storage.from("blog").remove([`blog/${imagePath}`]);
  }

  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
