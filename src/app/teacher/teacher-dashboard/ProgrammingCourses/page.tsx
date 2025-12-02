"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Eye, EyeOff, Users, BookOpen, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConfirmModal from "@/components/ConfirmModal"
import ErrorBoundary from "@/components/ErrorBoundary"
import ProgrammingCoursePreview from "@/components/ProgrammingCoursePreview"

interface Course {
  id: string
  title: string
  description: string | null
  difficulty_level: "beginner" | "intermediate" | "advanced"
  age_group: string
  subject_id: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  _count?: {
    modules?: number
    pupil_progress?: number
  }
}

interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  _count?: {
    lessons?: number
  }
}

interface Lesson {
  id: string
  module_id: string
  title: string
  content: string
  order_index: number
  has_assessment: boolean
  estimated_duration_minutes: number | null
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
}

export default function ProgrammingCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [showCreateLesson, setShowCreateLesson] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; name?: string } | null>(null)
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Form state for new course
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    difficulty_level: "beginner" as "beginner" | "intermediate" | "advanced",
    age_group: "6-10",
  })

  // Form state for new module
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
  })

  // Form state for new lesson
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    estimated_duration_minutes: 15,
    has_assessment: false,
  })

  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])

  const addToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/teacher/programming-courses")
        if (res.ok) {
          const data = await res.json()
          setCourses(data)
        } else {
          addToast("Failed to load courses", "error")
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        addToast("Error loading courses", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Fetch modules for selected course
  useEffect(() => {
    if (!selectedCourse) {
      setModules([])
      return
    }

    const fetchModules = async () => {
      try {
        const res = await fetch(`/api/teacher/programming-courses/${selectedCourse.id}/modules`)
        if (res.ok) {
          const data = await res.json()
          setModules(data)
        }
      } catch (error) {
        console.error("Error fetching modules:", error)
      }
    }

    fetchModules()
  }, [selectedCourse])

  // Fetch lessons for selected module
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

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) {
      addToast("Course title is required", "warning")
      return
    }

    try {
      const res = await fetch("/api/teacher/programming-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      })

      if (res.ok) {
        const course = await res.json()
        setCourses([...courses, course])
        setNewCourse({ title: "", description: "", difficulty_level: "beginner", age_group: "6-10" })
        setShowCreateCourse(false)
        addToast("Course created successfully!", "success")
      } else {
        addToast("Failed to create course", "error")
      }
    } catch (error) {
      console.error("Error creating course:", error)
      addToast("Error creating course", "error")
    }
  }

  const handleCreateModule = async () => {
    if (!selectedCourse || !newModule.title.trim()) {
      addToast("Module title is required", "warning")
      return
    }

    try {
      const res = await fetch(`/api/teacher/programming-courses/${selectedCourse.id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newModule,
          order_index: modules.length + 1,
        }),
      })

      if (res.ok) {
        const moduleData = await res.json()
        setModules([...modules, moduleData])
        setNewModule({ title: "", description: "" })
        setShowCreateModule(false)
        addToast("Module created successfully!", "success")
      } else {
        addToast("Failed to create module", "error")
      }
    } catch (error) {
      console.error("Error creating module:", error)
      addToast("Error creating module", "error")
    }
  }

  const handleCreateLesson = async () => {
    if (!selectedModule || !newLesson.title.trim() || !newLesson.content.trim()) {
      addToast("Lesson title and content are required", "warning")
      return
    }

    try {
      const res = await fetch(`/api/teacher/programming-modules/${selectedModule.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLesson,
          order_index: lessons.length + 1,
        }),
      })

      if (res.ok) {
        const lesson = await res.json()
        setLessons([...lessons, lesson])
        setNewLesson({ title: "", content: "", estimated_duration_minutes: 15, has_assessment: false })
        setShowCreateLesson(false)
        addToast("Lesson created successfully!", "success")
      } else {
        addToast("Failed to create lesson", "error")
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
      addToast("Error creating lesson", "error")
    }
  }

  const handlePublishCourse = async (course: Course) => {
    try {
      const res = await fetch(`/api/teacher/programming-courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !course.is_published }),
      })

      if (res.ok) {
        setCourses(courses.map((c) => (c.id === course.id ? { ...c, is_published: !c.is_published } : c)))
        addToast(`Course ${!course.is_published ? "published" : "unpublished"}`, "success")
      }
    } catch (error) {
      console.error("Error updating course:", error)
      addToast("Error updating course", "error")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/teacher/programming-courses/${courseId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setCourses(courses.filter((c) => c.id !== courseId))
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(null)
          setModules([])
          setLessons([])
        }
        addToast("Course deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      addToast("Error deleting course", "error")
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!selectedCourse) return

    try {
      const res = await fetch(`/api/teacher/programming-modules/${moduleId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setModules(modules.filter((m) => m.id !== moduleId))
        if (selectedModule?.id === moduleId) {
          setSelectedModule(null)
          setLessons([])
        }
        addToast("Module deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error deleting module:", error)
      addToast("Error deleting module", "error")
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const res = await fetch(`/api/teacher/programming-lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setLessons(lessons.filter((l) => l.id !== lessonId))
        addToast("Lesson deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error deleting lesson:", error)
      addToast("Error deleting lesson", "error")
    }
  }

  const handleConfirm = async () => {
    if (!confirmAction) return

    if (confirmAction.type === "course") {
      await handleDeleteCourse(confirmAction.id)
    } else if (confirmAction.type === "module") {
      await handleDeleteModule(confirmAction.id)
    } else if (confirmAction.type === "lesson") {
      await handleDeleteLesson(confirmAction.id)
    }

    setConfirmOpen(false)
    setConfirmAction(null)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Programming Courses</h1>
            <p className="text-gray-600 mt-1">Create and manage programming tutorials for your students</p>
          </div>
          <Button onClick={() => setShowCreateCourse(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus size={20} />
            Create Course
          </Button>
        </div>

        {/* Create Course Modal */}
        {showCreateCourse && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
              <CardDescription>Add a new programming course for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  placeholder="e.g., Introduction to Block-Based Programming"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="course-description">Description</Label>
                <Textarea
                  id="course-description"
                  placeholder="Describe what students will learn..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={newCourse.difficulty_level} onValueChange={(value: string) => setNewCourse({ ...newCourse, difficulty_level: (value as "beginner" | "intermediate" | "advanced") })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age-group">Age Group</Label>
                  <Select value={newCourse.age_group} onValueChange={(value) => setNewCourse({ ...newCourse, age_group: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-10">Ages 6-10</SelectItem>
                      <SelectItem value="11-15">Ages 11-15</SelectItem>
                      <SelectItem value="16-18">Ages 16-18</SelectItem>
                      <SelectItem value="all">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateCourse} className="bg-green-600 hover:bg-green-700">
                  Create Course
                </Button>
                <Button onClick={() => setShowCreateCourse(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Courses ({courses.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({courses.filter((c) => c.is_published).length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({courses.filter((c) => !c.is_published).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {courses.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No courses yet. Create your first programming course!</p>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle>{course.title}</CardTitle>
                          <Badge variant={course.is_published ? "default" : "secondary"}>{course.is_published ? "Published" : "Draft"}</Badge>
                          <Badge variant="outline">{course.difficulty_level}</Badge>
                          <Badge variant="outline">{course.age_group}</Badge>
                        </div>
                        <CardDescription className="mt-2">{course.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setPreviewCourse(course)
                            setShowPreview(true)
                          }}
                          title="Preview course as pupils see it"
                          className="text-purple-600"
                        >
                          <Monitor size={18} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePublishCourse(course)}
                          title={course.is_published ? "Unpublish" : "Publish"}
                        >
                          {course.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedCourse(course)}
                          className="text-blue-600"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setConfirmAction({ type: "course", id: course.id, name: course.title })
                            setConfirmOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <span>{course._count?.modules || 0} modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{course._count?.pupil_progress || 0} students enrolled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4 mt-4">
            {courses.filter((c) => c.is_published).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">No published courses</CardContent>
              </Card>
            ) : (
              courses
                .filter((c) => c.is_published)
                .map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedCourse(course)} className="text-blue-600">
                          <Edit2 size={18} />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4 mt-4">
            {courses.filter((c) => !c.is_published).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-600">No draft courses</CardContent>
              </Card>
            ) : (
              courses
                .filter((c) => !c.is_published)
                .map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedCourse(course)} className="text-blue-600">
                          <Edit2 size={18} />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>

        {/* Course Details Panel */}
        {selectedCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modules Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Modules in: {selectedCourse.title}</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateModule(true)}
                    className="gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Plus size={16} />
                    Add Module
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {showCreateModule && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 space-y-2">
                    <Input
                      placeholder="Module title"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Module description"
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreateModule} className="bg-green-600">
                        Create
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowCreateModule(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {modules.length === 0 ? (
                  <p className="text-gray-500 text-sm">No modules yet. Create your first module!</p>
                ) : (
                  modules.map((module) => (
                    <div
                      key={module.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedModule?.id === module.id
                          ? "bg-blue-50 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => setSelectedModule(module)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{module.title}</p>
                          <p className="text-sm text-gray-600">{module.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{module._count?.lessons || 0} lessons</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setConfirmAction({ type: "module", id: module.id, name: module.title })
                            setConfirmOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Lessons Section */}
            {selectedModule && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Lessons in: {selectedModule.title}</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setShowCreateLesson(true)}
                      className="gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <Plus size={16} />
                      Add Lesson
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showCreateLesson && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 space-y-2">
                      <Input
                        placeholder="Lesson title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Lesson content"
                        value={newLesson.content}
                        onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Duration (minutes)"
                          value={newLesson.estimated_duration_minutes}
                          onChange={(e) => setNewLesson({ ...newLesson, estimated_duration_minutes: parseInt(e.target.value) || 15 })}
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newLesson.has_assessment}
                            onChange={(e) => setNewLesson({ ...newLesson, has_assessment: e.target.checked })}
                          />
                          <span className="text-sm">Has Assessment</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleCreateLesson} className="bg-green-600">
                          Create
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowCreateLesson(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {lessons.length === 0 ? (
                    <p className="text-gray-500 text-sm">No lessons yet. Create your first lesson!</p>
                  ) : (
                    lessons.map((lesson) => (
                      <div key={lesson.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{lesson.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{lesson.content}</p>
                            <div className="flex gap-2 mt-2">
                              {lesson.estimated_duration_minutes && (
                                <Badge variant="outline" className="text-xs">
                                  {lesson.estimated_duration_minutes} min
                                </Badge>
                              )}
                              {lesson.has_assessment && (
                                <Badge variant="secondary" className="text-xs">
                                  Has Assessment
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setConfirmAction({ type: "lesson", id: lesson.id, name: lesson.title })
                              setConfirmOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          open={confirmOpen}
          title="Delete Confirmation"
          description={`Are you sure you want to delete "${confirmAction?.name || "this item"}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleConfirm}
          onCancel={() => {
            setConfirmOpen(false)
            setConfirmAction(null)
          }}
        />

        {/* Course Preview Modal */}
        <ProgrammingCoursePreview
          course={previewCourse}
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false)
            setPreviewCourse(null)
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
