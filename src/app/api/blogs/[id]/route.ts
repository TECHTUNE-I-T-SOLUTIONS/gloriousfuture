import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🟢 GET: Fetch a single blog post by ID
export async function GET(req: Request) {
  // parse id from the request URL to avoid using the second 'context' parameter
  const url = new URL(req.url)
  const parts = url.pathname.split("/").filter(Boolean)
  const id = parts[parts.length - 1]

  if (!id) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  // Fetch the blog post details
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !blog) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  // 🟢 Fetch the public URL of the blog image if it exists
  if (blog.image_url) {
    if (!blog.image_url.startsWith("https://")) {
      const { data } = supabase.storage
        .from("blog") // Ensure this matches your actual storage bucket name
        .getPublicUrl(blog.image_url);

      if (data?.publicUrl) {
        blog.image_url = data.publicUrl;
      }
    }
  }

  return NextResponse.json(blog, { status: 200 });
}
