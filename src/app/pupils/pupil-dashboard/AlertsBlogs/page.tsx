/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState, ReactNode } from "react"
import { FaBell, FaBlog, FaExclamationTriangle, FaClock } from "react-icons/fa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const Badge = (props: { children?: ReactNode; variant?: string; className?: string }) => {
  const { children, variant, className } = props
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
  const variantClass =
    variant === "destructive" ? "bg-red-100 text-red-700" :
    variant === "secondary" ? "bg-green-100 text-green-700" :
    "bg-gray-100 text-gray-800"
  return <span className={`${base} ${variantClass} ${className ?? ""}`}>{children}</span>
}

interface Alert {
  id: string
  message: string
  start_time?: string
  end_time?: string
  teacher_name?: string
  class_names?: string[]
}

interface Blog {
  id: string
  title: string
  content: string
  image_url?: string
  author_name?: string
  author_role?: string
}

export default function AlertsBlogs() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  // Reactions will be implemented later via API (placeholder)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
  const alertsRes = await fetch("/api/alerts?active=true")
        const blogsRes = await fetch("/api/blogs")
        const alertsData = alertsRes.ok ? await alertsRes.json() : []
        const blogsData = blogsRes.ok ? await blogsRes.json() : []
        setAlerts(alertsData)
        setBlogs(blogsData)
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <FaBell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alerts & News</h1>
            <p className="text-gray-600">Stay updated with school announcements and latest news</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <span>School Alerts</span>
                {alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {alerts.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Important announcements and urgent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert: Alert) => (
                    <div
                      key={alert.id}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-1 bg-red-500 rounded-full mt-1">
                          <FaBell className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium leading-relaxed">{alert.message}</p>
                          {alert.teacher_name && <p className="text-xs text-gray-500">By {alert.teacher_name}</p>}
                          {alert.class_names && alert.class_names.length > 0 && <p className="text-xs text-gray-500">For: {alert.class_names.join(', ')}</p>}
                          {(alert.start_time || alert.end_time) && (
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              <FaClock className="w-3 h-3" />
                              <span>
                                {formatDate(alert.start_time)}
                                {alert.end_time && ` - ${formatDate(alert.end_time)}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No alerts at this time</p>
                  <p className="text-gray-400 text-sm">You&apos;re all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blog Posts Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <FaBlog className="text-green-500" />
                <span>Latest News</span>
                {blogs.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                    {blogs.length} posts
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Recent blog posts and school updates</CardDescription>
            </CardHeader>
            <CardContent>
              {blogs.length > 0 ? (
                <div className="space-y-6">
                  {blogs.map((blog: Blog) => (
                    <article
                      key={blog.id}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{blog.title}</h3>

                        <div
                          className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {blog.image_url && (
                          <div className="mt-3">
                            <img
                              src={blog.image_url || "/placeholder.svg"}
                              alt={blog.title}
                              className="w-full max-w-sm rounded-lg shadow-sm object-cover"
                            />
                          </div>
                        )}

                        {(blog.author_name || blog.author_role) && (
                          <>
                            <Separator className="my-3" />
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={blog.image_url || blog.author_role === 'teacher' ? '/default-profile.png' : '/default-profile.png'} />
                                <AvatarFallback className="bg-green-500 text-white text-xs">
                                  {blog.author_name?.charAt(0) || "A"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-xs text-gray-600">
                                <p className="font-medium">{blog.author_name}</p>
                                <p className="text-gray-500">{blog.author_role}</p>
                              </div>
                            </div>
                          </>
                        )}
                        {/* Reactions (coming soon) */}
                        <div className="mt-3 text-sm text-gray-500">Reactions and comments coming soon.</div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBlog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No blog posts yet</p>
                  <p className="text-gray-400 text-sm">Check back later for updates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
