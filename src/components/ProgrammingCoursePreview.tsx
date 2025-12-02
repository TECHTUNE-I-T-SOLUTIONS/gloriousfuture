"use client"

import { useEffect, useState } from "react"
import { X, BookOpen, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: string
  title: string
  description: string | null
  difficulty_level: "beginner" | "intermediate" | "advanced"
  age_group: string
  is_published: boolean
  created_at: string
}

interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
  _count?: {
    lessons?: number
  }
}

interface Lesson {
  id: string
  title: string
  content: string
  order_index: number
  has_assessment: boolean
  estimated_duration_minutes: number | null
}

interface CoursePreviewProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
}

export default function ProgrammingCoursePreview({ course, isOpen, onClose }: CoursePreviewProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!course || !isOpen) return

    const fetchModules = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/teacher/programming-courses/${course.id}/modules`)
        if (res.ok) {
          const data = await res.json()
          setModules(data)
          if (data.length > 0) {
            setSelectedModule(data[0])
          }
        }
      } catch (error) {
        console.error("Error fetching modules:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [course, isOpen])

  useEffect(() => {
    if (!selectedModule) {
      setLessons([])
      return
    }

    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/teacher/programming-modules/${selectedModule.id}/lessons`)
        if (res.ok) {
          const data = await res.json()
          setLessons(data)
        }
      } catch (error) {
        console.error("Error fetching lessons:", error)
      }
    }

    fetchLessons()
  }, [selectedModule])

  if (!isOpen || !course) return null

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  }

  const totalLessons = modules.reduce((sum, m) => sum + (m._count?.lessons || 0), 0)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <div className="flex gap-2 mt-3">
              <Badge className={difficultyColors[course.difficulty_level]}>
                {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
              </Badge>
              <Badge variant="outline">{course.age_group}</Badge>
              {course.is_published ? (
                <Badge className="bg-blue-100 text-blue-800">Published</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
              )}
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="text-gray-500">
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalLessons}</div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {lessons.filter((l) => l.has_assessment).length} / {lessons.length}
                  </div>
                  <div className="text-sm text-gray-600">Assessments</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Preview as Pupils See It */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">How Pupils Will See This Course</h3>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600 text-sm">Loading course content...</p>
                </div>
              </div>
            ) : modules.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertCircle size={32} className="mx-auto text-yellow-600 mb-2" />
                  <p className="text-gray-600">This course has no modules yet. Pupils will see an empty course.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Modules List - Left Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 border">
                    {modules.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                          selectedModule?.id === module.id
                            ? "bg-blue-100 border border-blue-300 font-medium text-blue-900"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium truncate">{module.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{module._count?.lessons || 0} lessons</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lessons List - Right Side */}
                <div className="lg:col-span-2">
                  {selectedModule ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{selectedModule.title}</CardTitle>
                        {selectedModule.description && (
                          <CardDescription>{selectedModule.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {lessons.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">No lessons in this module</p>
                        ) : (
                          lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{lesson.content}</p>
                                  <div className="flex gap-2 mt-2">
                                    {lesson.estimated_duration_minutes && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock size={12} />
                                        <span>{lesson.estimated_duration_minutes} min</span>
                                      </div>
                                    )}
                                    {lesson.has_assessment && (
                                      <Badge variant="secondary" className="text-xs">
                                        Assessment
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  {lesson.has_assessment ? (
                                    <CheckCircle size={20} className="text-green-500" />
                                  ) : (
                                    <BookOpen size={20} className="text-blue-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Tip:</strong> This is how your course will appear to pupils. Make sure all modules and lessons are complete before publishing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
