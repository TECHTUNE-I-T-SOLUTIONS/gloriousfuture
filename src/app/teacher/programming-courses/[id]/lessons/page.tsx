"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CustomLoader from "@/components/CustomLoader"
import LessonEditor from "@/components/LessonEditor"

interface TutorialStep {
  title: string
  description: string
  code_snippet?: string
  explanation?: string
}

interface Lesson {
  id: string
  title: string
  content: string
  module_id: string
  created_at: string
  updated_at: string
  video_url?: string
  tutorial_steps?: TutorialStep[]
  starter_code?: string
  expected_output?: string
  language?: string
}

interface Module {
  id: string
  title: string
  description: string
  course_id: string
  lessons: Lesson[]
}

export default function TeacherLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = (params?.id as string) || ""

  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  const fetchModulesAndLessons = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/teacher/programming-courses/${courseId}/modules`)
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    if (courseId) {
      fetchModulesAndLessons()
    }
  }, [courseId, fetchModulesAndLessons])

  const handleCreateLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId)
    setEditingLesson(null)
    setShowEditor(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedModuleId(lesson.module_id)
    setEditingLesson(lesson)
    setShowEditor(true)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    try {
      const response = await fetch(`/api/teacher/programming-lessons/${lessonId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete lesson")
      await fetchModulesAndLessons()
    } catch (err) {
      setError(String(err))
    }
  }

  const handleSaveLesson = async (data: Record<string, unknown>) => {
    if (!selectedModuleId) return

    try {
      const method = editingLesson ? "PATCH" : "POST"
      const url = editingLesson
        ? `/api/teacher/programming-lessons/${editingLesson.id}`
        : `/api/teacher/programming-modules/${selectedModuleId}/lessons`

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          module_id: selectedModuleId,
        }),
      })

      if (!response.ok) throw new Error("Failed to save lesson")
      await fetchModulesAndLessons()
      setShowEditor(false)
      setEditingLesson(null)
    } catch (err) {
      throw err
    }
  }

  if (loading) return <CustomLoader />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Programming Lessons</h1>
        <p className="text-gray-600 mt-2">Create and manage programming lessons for your course</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <LessonEditor
              lessonId={editingLesson?.id}
              initialData={editingLesson}
              onSave={handleSaveLesson}
              onCancel={() => {
                setShowEditor(false)
                setEditingLesson(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Modules and Lessons List */}
      {!showEditor && (
        <div className="space-y-6">
          {modules.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">No modules found. Create modules first.</p>
                <Button
                  onClick={() => router.push(`/teacher/programming-courses/${courseId}`)}
                  variant="outline"
                >
                  Go to Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module) => (
              <Card key={module.id}>
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <Button
                      onClick={() => handleCreateLesson(module.id)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus size={18} />
                      Add Lesson
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {(!module.lessons || module.lessons.length === 0) ? (
                    <p className="text-gray-500 text-center py-6">No lessons yet</p>
                  ) : (
                    <div className="space-y-3">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {lesson.content}
                            </p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                              {lesson.language && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  {lesson.language}
                                </span>
                              )}
                              {lesson.video_url && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Video
                                </span>
                              )}
                              {lesson.tutorial_steps && lesson.tutorial_steps.length > 0 && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {lesson.tutorial_steps.length} steps
                                </span>
                              )}
                              <span>
                                Updated:{" "}
                                {new Date(lesson.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => handleEditLesson(lesson)}
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <Edit2 size={16} />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              size="sm"
                              variant="outline"
                              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
