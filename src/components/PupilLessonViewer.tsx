"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft, Code2, Play, Maximize2, Minimize2, CheckCircle, Clock } from "lucide-react"
import CodeIDE from "@/components/CodeIDE"

interface Lesson {
  id: string
  title: string
  content: string
  video_url?: string
  code_example?: string
  code_language?: string
  estimated_duration_minutes?: number
  has_assessment: boolean
  learning_objectives?: string[]
}

interface PupilLessonViewerProps {
  lesson: Lesson
  moduleTitle: string
  courseTitle: string
  onLessonComplete?: (lessonId: string) => void
  onSubmitAssessment?: (answers: any) => Promise<void>
}

export default function PupilLessonViewer({
  lesson,
  moduleTitle,
  courseTitle,
  onLessonComplete,
  onSubmitAssessment,
}: PupilLessonViewerProps) {
  const [showIDE, setShowIDE] = useState(false)
  const [isIDEFullscreen, setIsIDEFullscreen] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  // Track time spent on lesson
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLessonComplete = async () => {
    try {
      const res = await fetch(`/api/pupil/programming-lessons/${lesson.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time_spent_minutes: Math.floor(timeSpent / 60),
          completed_at: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setLessonCompleted(true)
        if (onLessonComplete) {
          onLessonComplete(lesson.id)
        }
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error)
    }
  }

  const isYoutubeUrl = lesson.video_url?.includes("youtube.com") || lesson.video_url?.includes("youtu.be")

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return ""
    let videoId = ""

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0]
    } else if (url.includes("youtube.com/watch")) {
      const params = new URLSearchParams(new URL(url).search)
      videoId = params.get("v") || ""
    }

    return `https://www.youtube.com/embed/${videoId}`
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {courseTitle} / {moduleTitle}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              {lesson.estimated_duration_minutes && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={18} />
                  <span className="text-sm">{lesson.estimated_duration_minutes} min</span>
                </div>
              )}
              {lessonCompleted && (
                <Badge className="bg-green-600">
                  <CheckCircle size={14} className="mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isIDEFullscreen ? (
          // Fullscreen IDE
          <div className="fixed inset-0 bg-gray-900 z-50 p-4">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-t-lg">
                <h3 className="font-semibold">Code Editor - {lesson.code_language}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsIDEFullscreen(false)}
                  className="text-white hover:bg-gray-700"
                >
                  <Minimize2 size={18} />
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <CodeIDE lessonId={lesson.id} language={lesson.code_language || "javascript"} initialCode={lesson.code_example || ""} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Section */}
              {lesson.video_url && (
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gray-900 text-white">
                    <CardTitle className="text-white">📹 Video Lesson</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isYoutubeUrl ? (
                      <div className="aspect-video bg-black">
                        <iframe
                          width="100%"
                          height="100%"
                          src={getYoutubeEmbedUrl(lesson.video_url)}
                          title={lesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <video
                        width="100%"
                        height="auto"
                        controls
                        className="w-full bg-black"
                        controlsList="nodownload"
                      >
                        <source src={lesson.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Learning Content */}
              <Card>
                <CardHeader>
                  <CardTitle>📚 Lesson Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Learning Objectives</h4>
                      <ul className="space-y-2">
                        {lesson.learning_objectives.map((objective, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
                    </div>
                  </div>

                  {/* Code Example */}
                  {lesson.code_example && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-3">💻 Code Example</h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs font-mono">{lesson.code_example}</pre>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Language: {lesson.code_language}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lesson Complete */}
              {!lessonCompleted && (
                <Button
                  onClick={handleLessonComplete}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Mark as Complete
                </Button>
              )}
            </div>

            {/* Sidebar - IDE */}
            <div className="space-y-4">
              {/* IDE Toggle */}
              {lesson.code_example && (
                <Card className={showIDE ? "border-blue-500 bg-blue-50" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">💻 Practice IDE</CardTitle>
                    <CardDescription>Write and test code while learning</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!showIDE ? (
                      <Button
                        onClick={() => setShowIDE(true)}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Code2 size={16} className="mr-2" />
                        Open IDE
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowIDE(false)}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Close IDE
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* IDE Embedded */}
              <AnimatePresence>
                {showIDE && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between bg-gray-900 text-white px-3 py-2 rounded-t-lg">
                      <span className="font-mono text-xs">{lesson.code_language}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsIDEFullscreen(true)}
                        className="text-white hover:bg-gray-800 h-6 w-6 p-0"
                      >
                        <Maximize2 size={14} />
                      </Button>
                    </div>
                    <div className="bg-gray-900 rounded-b-lg overflow-hidden max-h-96">
                      <CodeIDE
                        lessonId={lesson.id}
                        language={lesson.code_language || "javascript"}
                        initialCode={lesson.code_example || ""}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lesson Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">📊 Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time Spent</span>
                      <span className="font-semibold">{formatTime(timeSpent)}</span>
                    </div>
                    {lesson.estimated_duration_minutes && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-600 h-2 rounded-full"
                          animate={{
                            width: `${Math.min(
                              (timeSpent / (lesson.estimated_duration_minutes * 60)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {lesson.has_assessment && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">📝 Assessment</p>
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Play size={14} className="mr-2" />
                        Take Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
