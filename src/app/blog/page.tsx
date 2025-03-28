"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CustomHeader from "@/components/CustomHeader";

// Dynamically import Particles to prevent hydration issues
const ParticlesBg = dynamic(() => import("../../components/ParticlesBg"), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: "teacher" | "pupil";
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Particles Background */}
      <ParticlesBg />

      {/* Header Section */}
      <CustomHeader />

      {/* Main Content */}
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
                <p className="text-gray-700 mt-2">{blog.content.substring(0, 150)}...</p>
                <p className="text-sm text-gray-500 mt-2">By {blog.author_name} ({blog.author_role})</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No blog posts available.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-6 text-center z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
