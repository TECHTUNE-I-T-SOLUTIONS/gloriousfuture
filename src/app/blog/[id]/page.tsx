"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import { FaWhatsapp, FaFacebook, FaLink, FaHeart, FaRegHeart } from "react-icons/fa"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

// Dynamically import ParticlesBg to prevent hydration issues
const ParticlesBg = dynamic(() => import("@/components/ParticlesBg"), { ssr: false })

interface BlogPost {
  id: string
  title: string
  content: string
  author_name: string
  author_role: "teacher" | "pupil"
  image_url?: string | null
  likes_count?: number
  comments_count?: number
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [likes, setLikes] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)
  type CommentType = { id: string; author_name: string; content: string }
  const [comments, setComments] = useState<CommentType[]>([])
  const [commentText, setCommentText] = useState("")
  const [loading, setLoading] = useState(true)
  const [postLink, setPostLink] = useState<string>("")

  useEffect(() => {
    const id = params?.id
    if (!id) return

    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/blog")
        } else {
          setBlog(data)
          setLikes(data.likes_count ?? 0)
          setComments([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })

    setPostLink(`${window.location.origin}/blog/${params.id}`)
    fetch(`/api/blogs/${params.id}/comments`)
      .then((r) => r.json())
      .then((cdata) => setComments(cdata || []))
      .catch((err) => {
        console.error("fetch comments err", err)
      })
  }, [params?.id, router])

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-300 to-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-900 mb-4 mx-auto"></div>
          <p className="text-indigo-900 text-lg font-medium">Loading blog post...</p>
        </div>
      </div>
    )

  if (!blog)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-300 to-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-indigo-900 text-2xl font-bold">Blog post not found.</p>
          <button
            onClick={() => router.push("/blog")}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    )

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-indigo-300 to-indigo-600">
      <ParticlesBg />
      <CustomHeader />

      <main className="flex-grow container items-center mx-auto px-6 py-28 z-10">
        <article className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto border border-indigo-200">
          {/* Header Section */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4 leading-tight">{blog.title}</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full mx-auto mb-6"></div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{blog.author_name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-indigo-900">{blog.author_name}</p>
                <p className="text-sm text-indigo-600 capitalize">{blog.author_role}</p>
              </div>
            </div>
          </header>

          {/* Content Section */}
          <div className="prose prose-lg max-w-none mb-8">
            <div
              className="text-indigo-800 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Image Section */}
          {blog.image_url && (
            <div className="mb-8 text-center">
              <Image
                src={blog.image_url || "/placeholder.svg"}
                alt="Blog Image"
                width={600}
                height={400}
                className="rounded-xl shadow-lg border border-indigo-200 mx-auto"
              />
            </div>
          )}

          {/* Interaction Section */}
          <div className="flex items-center justify-center mb-8">
            <button
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                liked
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 hover:from-indigo-200 hover:to-indigo-300"
              }`}
              onClick={async () => {
                setLiked((s) => !s)
                setLikes((l) => (liked ? Math.max(0, l - 1) : l + 1))
                try {
                  const method = liked ? "DELETE" : "POST"
                  const res = await fetch(`/api/blogs/${blog.id}/like`, { method })
                  const js = await res.json()
                  if (!res.ok) throw new Error(js?.error || "like failed")
                  setLikes(js.likes_count ?? likes)
                } catch (err) {
                  console.error("like error", err)
                  setLiked((s) => !s)
                  setLikes((l) => (liked ? l + 1 : Math.max(0, l - 1)))
                }
              }}
            >
              {liked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
              <span>
                {liked ? "Liked" : "Like"} ({likes})
              </span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="bg-indigo-50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">Comments ({comments.length})</h3>

            <div className="space-y-4 mb-6">
              {comments.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{c.author_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <p className="font-semibold text-indigo-900">{c.author_name}</p>
                  </div>
                  <p className="text-indigo-800 ml-10">{c.content}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <label className="sr-only" htmlFor="comment-input">
                Add a comment
              </label>
              <textarea
                id="comment-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={3}
                placeholder="Share your thoughts..."
              />
              <div className="flex justify-end">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg disabled:opacity-50"
                  disabled={!commentText.trim()}
                  onClick={async () => {
                    if (!commentText.trim()) return
                    const temp = { id: "temp-" + Date.now(), author_name: "You", content: commentText }
                    setComments((s) => [temp, ...s])
                    const body = { content: commentText }
                    setCommentText("")
                    try {
                      const res = await fetch(`/api/blogs/${blog.id}/comments`, {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: { "Content-Type": "application/json" },
                      })
                      const js = await res.json()
                      if (!res.ok) throw new Error(js?.error || "comment failed")
                      setComments((s) => [js, ...s.filter((x) => x.id && !x.id.toString().startsWith("temp-"))])
                    } catch (err) {
                      console.error("comment post error", err)
                      setComments((s) => s.filter((x) => !x.id.toString().startsWith("temp-")))
                    }
                  }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-indigo-900 mb-4">Share this post</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="relative group">
                <button
                  onClick={() => navigator.clipboard.writeText(postLink)}
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
        </article>
      </main>

      <CustomFooter />
    </div>
  )
}
