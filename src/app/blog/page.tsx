"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebook, FaLink, FaTimes } from "react-icons/fa";
import CustomHeader from "@/components/CustomHeader";

// Dynamically import Particles to prevent hydration issues
const ParticlesBg = dynamic(() => import("../../components/ParticlesBg"), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: "teacher" | "pupil";
  image_url?: string | null;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-700 to-blue-900">
      <ParticlesBg />
      <CustomHeader />

      <main className="flex-grow container mx-auto px-6 py-24 z-10">
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg mb-8">School Blog</h1>

        {loading ? (
          <p className="text-center text-white text-lg">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg transition-transform transform border-4 border-transparent animated-border"
              >
                <h2 className="text-2xl font-semibold text-gray-900">{blog.title}</h2>
                <p className="text-gray-700 mt-2">
                  <span dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) }} />
                  ... {blog.image_url && <span className="text-blue-600 font-bold ml-2">(contains images)</span>}
                </p>
                <p className="text-sm text-gray-500 mt-2">By {blog.author_name} ({blog.author_role})</p>

                {/* Open Post Button */}
                <a
                  href={`/blog/${blog.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  View Post
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No blog posts available.</p>
        )}
      </main>

      {/* Blog Modal */}
      {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}

      <footer className="w-full bg-gray-900 text-white py-6 text-center z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// 🟢 Blog Modal Component
function BlogModal({ blog, onClose }: { blog: BlogPost; onClose: () => void }) {
  const postLink = `${window.location.origin}/blog/${blog.id}`;

  // Function to copy link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(postLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-red-500">
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl font-bold text-gray-900">{blog.title}</h2>

        {/* Render blog content with proper formatting */}
        <div className="text-gray-700 mt-4">
          {blog.content ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p>No content available.</p>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-2">By {blog.author_name} ({blog.author_role})</p>

        {/* Display Image if available */}
        {blog.image_url && (
          <div className="mt-4 flex justify-center">
            <Image
              src={blog.image_url}
              alt="Blog Image"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex space-x-4 mt-6 justify-center">
          {/* Copy Link */}
          <div className="relative group">
            <button onClick={copyToClipboard} className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg">
              <FaLink className="mr-2" /> Copy Link
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
              Copy post link
            </span>
          </div>

          {/* WhatsApp Share */}
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

          {/* Facebook Share */}
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
    </div>
  );
}
