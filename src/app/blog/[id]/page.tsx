"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaWhatsapp, FaFacebook, FaLink } from "react-icons/fa";
import CustomHeader from "@/components/CustomHeader";

// Dynamically import ParticlesBg to prevent hydration issues
const ParticlesBg = dynamic(() => import("@/components/ParticlesBg"), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: "teacher" | "pupil";
  image_url?: string | null;
}

export default function BlogPostPage() {
  const params = useParams(); // ✅ Correctly get params in App Router
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [postLink, setPostLink] = useState<string>("");

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/blogs/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/blog"); // Redirect if post not found
        } else {
          setBlog(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // ✅ Set post link dynamically to avoid accessing `window` in SSR
    setPostLink(`${window.location.origin}/blog/${params.id}`);
  }, [params.id, router]);

  if (loading) return <p className="text-center text-white text-lg">Loading blog post...</p>;
  if (!blog) return <p className="text-center text-red-500 text-lg">Blog post not found.</p>;

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-700 to-blue-900">
      <ParticlesBg />
      <CustomHeader />

      <main className="flex-grow container items-center mx-auto px-6 py-28 z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
          <h1 className="text-4xl text-center font-bold text-gray-900 bg-gray-400 rounded-lg">{blog.title}</h1>
          <p className="text-sm text-center text-gray-600 mt-2">By {blog.author_name} ({blog.author_role})</p>


          <p className="text-gray-800 text-center mt-6">{blog.content}</p>

          {blog.image_url && (
            <div className="mt-4 flex justify-center">
              <Image
                src={blog.image_url}
                alt="Blog Image"
                width={300}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>
          )}

			{/* Share Buttons */}
			<div className="flex space-x-4 justify-center mt-6">

			  {/* Copy Link Button */}
			  <div className="relative group">
			    <button
			      onClick={() => navigator.clipboard.writeText(postLink)}
			      className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg"
			    >
			      <FaLink className="mr-2" /> Copy Link
			    </button>
			    <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
			      Copy post link
			    </span>
			  </div>

			  {/* WhatsApp Share Button */}
			  <div className="relative group">
			    <a
			      href={`https://wa.me/?text=${encodeURIComponent(postLink)}`}
			      target="_blank"
			      rel="noopener noreferrer"
			      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg"
			    >
			      <FaWhatsapp className="mr-2" /> WhatsApp
			    </a>
			    <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
			      Share on WhatsApp
			    </span>
			  </div>

			  {/* Facebook Share Button */}
			  <div className="relative group">
			    <a
			      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`}
			      target="_blank"
			      rel="noopener noreferrer"
			      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
			    >
			      <FaFacebook className="mr-2" /> Facebook
			    </a>
			    <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
			      Share on Facebook
			    </span>
			  </div>

			</div>
		</div>
      </main>

      <footer className="w-full bg-gray-900 text-white py-6 text-center z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
