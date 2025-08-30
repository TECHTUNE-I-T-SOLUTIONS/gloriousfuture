"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import CustomAlert from "@/components/CustomAlert"
import { FaWhatsapp, FaFacebook, FaLink, FaTimes } from "react-icons/fa"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

// Dynamically import Particles to prevent hydration issues
const ParticlesBg = dynamic(() => import("../../components/ParticlesBg"), { ssr: false })

interface BlogPost {
  id: string
  title: string
  content: string
  author_name: string
  author_role: "teacher" | "pupil"
  image_url?: string | null
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data)
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-indigo-300 to-indigo-600">
      <ParticlesBg />
      <CustomHeader />

      <main className="flex-grow container mx-auto px-6 py-24 z-10">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-indigo-900 drop-shadow-lg mb-4"
          >
            School Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-indigo-700 max-w-2xl mx-auto"
          >
            Discover stories, insights, and updates from our vibrant school community
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-900 mb-4"></div>
            <p className="text-center text-indigo-900 text-lg font-medium">Loading amazing stories...</p>
          </div>
        ) : blogs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-200"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-3 line-clamp-2">{blog.title}</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full mb-4"></div>
                </div>

                <div className="text-indigo-700 mb-6 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) }} />
                  <span className="text-indigo-500">...</span>
                  {blog.image_url && (
                    <div className="inline-flex items-center ml-2 px-2 py-1 bg-indigo-100 rounded-full">
                      <span className="text-indigo-600 font-medium text-sm">📸 Images</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{blog.author_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-900">{blog.author_name}</p>
                      <p className="text-xs text-indigo-600 capitalize">{blog.author_role}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={`/blog/${blog.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Read Full Story
                </a>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-2xl text-indigo-900 font-medium">No blog posts available yet.</p>
            <p className="text-indigo-700 mt-2">Check back soon for amazing stories!</p>
          </div>
        )}
      </main>

      {/* Blog Modal */}
      {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}

      <CustomFooter />
    </div>
  )
}

// 🟢 Blog Modal Component
function BlogModal({ blog, onClose }: { blog: BlogPost; onClose: () => void }) {
  const postLink = `${window.location.origin}/blog/${blog.id}`
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null)

  // Function to copy link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(postLink)
    setToast({ message: "Link copied to clipboard!", type: "info" })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative border border-indigo-200">
        <button
          onClick={onClose}
          title="Close"
          aria-label="Close"
          className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 p-2 rounded-full transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-3xl font-bold text-indigo-900 mb-4 pr-12">{blog.title}</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full mb-6"></div>

        <div className="text-indigo-800 leading-relaxed mb-6">
          {blog.content ? <div dangerouslySetInnerHTML={{ __html: blog.content }} /> : <p>No content available.</p>}
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{blog.author_name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium text-indigo-900">{blog.author_name}</p>
            <p className="text-sm text-indigo-600 capitalize">{blog.author_role}</p>
          </div>
        </div>

        {blog.image_url && (
          <div className="mb-6 flex justify-center">
            <Image
              src={blog.image_url || "/placeholder.svg"}
              alt="Blog Image"
              width={500}
              height={300}
              className="rounded-xl shadow-lg border border-indigo-200"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <div className="relative group">
            <button
              onClick={copyToClipboard}
              className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-md"
            >
              <FaLink className="mr-2" /> Copy Link
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-indigo-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              Copy post link
            </span>
          </div>

          <div className="relative group">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(postLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <FaWhatsapp className="mr-2" /> WhatsApp
            </a>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-indigo-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              Share on WhatsApp
            </span>
          </div>

          <div className="relative group">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <FaFacebook className="mr-2" /> Facebook
            </a>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-indigo-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              Share on Facebook
            </span>
          </div>
        </div>
      </div>
      {toast && <BlogModalToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function BlogModalToast({
  message,
  type,
  onClose,
}: { message: string; type: "success" | "error" | "info" | "warning"; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-50">
      <CustomAlert message={message} type={type} onClose={onClose} />
    </div>
  )
}
