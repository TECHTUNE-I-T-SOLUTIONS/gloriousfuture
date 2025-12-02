"use client"

import { useEffect, useState } from "react"
import { CodeXml, Play, CheckCircle, Clock, BarChart3, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ErrorBoundary from "@/components/ErrorBoundary"

interface Course {
  id: string
  title: string
  description: string | null
  difficulty_level: "beginner" | "intermediate" | "advanced"
  age_group: string
  is_published: boolean
  created_at: string
  _count?: {
    modules?: number
  }
}

interface CourseProgress {
  id: string
  pupil_id: string
  course_id: string
  total_lessons_completed: number
  total_assessments_passed: number
  course_completion_percentage: number
  started_at: string
  completed_at?: string | null
  course?: Course
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
}

interface ProgrammingCoursesProps {
  onStartLesson?: (courseId: string) => void
}

export default function ProgrammingCourses({ onStartLesson }: ProgrammingCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }

  // Fetch available programming courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/pupil/programming-courses")
        if (res.ok) {
          const data = await res.json()
          setCourses(data)
        } else {
          addToast("Failed to load courses", "error")
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        addToast("Error loading courses", "error")
      }
    }

    fetchCourses()
  }, [])

  // Fetch pupil's progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/pupil/programming-progress")
        if (res.ok) {
          const data = await res.json()
          setProgress(data)
        }
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const res = await fetch("/api/pupil/programming-courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      })

      if (res.ok) {
        const newProgress = await res.json()
        setProgress([...progress, newProgress])
        addToast("Successfully enrolled in course!", "success")
      } else {
        addToast("Failed to enroll in course", "error")
      }
    } catch (error) {
      console.error("Error enrolling:", error)
      addToast("Error enrolling in course", "error")
    }
  }

  const handleStartLesson = (courseId: string) => {
    if (onStartLesson) {
      onStartLesson(courseId)
    }
  }

  const getProgressPercentage = (courseId: string): number => {
    const courseProgress = progress.find((p) => p.course_id === courseId)
    return courseProgress?.course_completion_percentage || 0
  }

  const isEnrolled = (courseId: string): boolean => {
    return progress.some((p) => p.course_id === courseId)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading programming courses...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6">
        {/* Toast notifications */}
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg text-white flex items-center gap-2 ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                    ? "bg-red-500"
                    : toast.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CodeXml size={32} className="text-blue-600" />
            Programming Courses
          </h1>
          <p className="text-gray-600">Learn programming from basics to advanced! Start your coding journey today.</p>
        </div>

        {/* My Courses Section */}
        {progress.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.map((courseProgress) => {
                const course = courses.find((c) => c.id === courseProgress.course_id)
                if (!course) return null

                return (
                  <Card key={courseProgress.id} className="hover:shadow-lg transition-shadow border-2 border-blue-200 p-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">{course.description}</CardDescription>
                        </div>
                        {courseProgress.course_completion_percentage === 100 && (
                          <CheckCircle className="text-green-600" size={24} />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-bold text-gray-900">
                            {Math.round(courseProgress.course_completion_percentage)}%
                          </span>
                        </div>
                        <Progress value={courseProgress.course_completion_percentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CheckCircle size={16} className="text-green-600" />
                          <span>{courseProgress.total_lessons_completed} lessons</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <BarChart3 size={16} className="text-blue-600" />
                          <span>{courseProgress.total_assessments_passed} passed</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleStartLesson(course.id)}
                        className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Play size={18} />
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Available Courses Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
          {courses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No programming courses available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter((c) => c.is_published)
                .map((course) => {
                  const enrolled = isEnrolled(course.id)
                  const progressPercent = getProgressPercentage(course.id)

                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow p-2">
                      <CardHeader>
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={getDifficultyColor(course.difficulty_level)}>
                              {course.difficulty_level}
                            </Badge>
                            <Badge variant="outline">{course.age_group}</Badge>
                          </div>
                        </div>
                        <CardDescription className="mt-3">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {enrolled ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Your Progress</span>
                                <span className="text-sm font-bold text-gray-900">{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-2" />
                            </div>
                            <Button
                              onClick={() => handleStartLesson(course.id)}
                              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                              <Play size={18} />
                              Continue
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleEnrollCourse(course.id)}
                            className="w-full gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Play size={18} />
                            Enroll Now
                          </Button>
                        )}

                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={14} />
                          {course._count?.modules || 0} modules
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          )}
        </div>

        {/* Learning Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <CodeXml size={24} />
              Learning Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✅ Start with beginner courses to build a strong foundation</li>
              <li>✅ Complete all lessons in a module before moving to the next</li>
              <li>✅ Pass all assessments with at least 70% to unlock next lessons</li>
              <li>✅ Practice regularly - even 15 minutes a day helps!</li>
              <li>✅ Revisit lessons if you don&apos;t understand - it&apos;s normal!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
