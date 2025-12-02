"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, BookOpen, Clock, CheckCircle, AlertCircle, Send, BarChart3, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ErrorBoundary from "@/components/ErrorBoundary"
import VideoPlayer from "@/components/VideoPlayer"
import StepByStepTutorial from "@/components/StepByStepTutorial"
import CodeIDE from "@/components/CodeIDE"

interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
}

interface Lesson {
  id: string
  title: string
  content: string
  order_index: number
  has_assessment: boolean
  estimated_duration_minutes: number | null
  module_id: string
  video_url?: string | null
  video_size_mb?: number | null
  video_duration_seconds?: number | null
  tutorial_steps?: Array<{ title: string; description: string; code_snippet?: string; explanation?: string }> | null
  starter_code?: string | null
  expected_output?: string | null
  language?: string | null
}

interface Assessment {
  id: string
  lesson_id: string
  title: string
  description: string
  passing_score: number
  questions: Record<string, unknown>[]
}

interface AssessmentSubmission {
  id: string
  assessment_id: string
  pupil_id: string
  answers: Record<string, string>
  score: number
  is_passed: boolean
  feedback: Record<string, unknown>
  submitted_at: string
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
}

interface ProgrammingLessonsProps {
  courseId: string
  onBack: () => void
}

export default function ProgrammingLessons({ courseId, onBack }: ProgrammingLessonsProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [showAssessment, setShowAssessment] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null)
  const [activeSection, setActiveSection] = useState<"video" | "tutorial" | "practice" | "assessment">("video")

  const addToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`/api/pupil/programming-courses/${courseId}/modules`)
        if (res.ok) {
          const data = await res.json()
          setModules(data)
          if (data.length > 0) {
            setSelectedModule(data[0])
          }
        } else {
          addToast("Failed to load modules", "error")
        }
      } catch (error) {
        console.error("Error fetching modules:", error)
        addToast("Error loading modules", "error")
      }
    }

    if (courseId) {
      fetchModules()
    }
  }, [courseId])

  // Fetch lessons for selected module
  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedModule) return

      try {
        const res = await fetch(`/api/pupil/programming-modules/${selectedModule.id}/lessons`)
        if (res.ok) {
          const data = await res.json()
          setLessons(data)
          if (data.length > 0) {
            setSelectedLesson(data[0])
            setShowAssessment(false)
            setSubmission(null)
          }
        } else {
          addToast("Failed to load lessons", "error")
        }
      } catch (error) {
        console.error("Error fetching lessons:", error)
        addToast("Error loading lessons", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [selectedModule])

  // Fetch assessment if lesson has one
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!selectedLesson?.has_assessment) return

      try {
        const res = await fetch(`/api/pupil/programming-lessons/${selectedLesson.id}/assessment`)
        if (res.ok) {
          const data = await res.json()
          setAssessment(data)
        }
      } catch (error) {
        console.error("Error fetching assessment:", error)
      }
    }

    fetchAssessment()
  }, [selectedLesson])

  const handleSubmitAssessment = async () => {
    if (!selectedLesson || !assessment) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/pupil/programming-lessons/${selectedLesson.id}/submit-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: assessment.id,
          answers,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSubmission(data)
        addToast(
          data.is_passed
            ? `Assessment passed! Score: ${data.score.toFixed(1)}%`
            : `Assessment submitted. Score: ${data.score.toFixed(1)}%`,
          data.is_passed ? "success" : "warning"
        )
      } else {
        addToast("Failed to submit assessment", "error")
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
      addToast("Error submitting assessment", "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
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

        {/* Back Button */}
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ArrowLeft size={18} />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Modules Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.length === 0 ? (
                  <p className="text-sm text-gray-600">No modules available</p>
                ) : (
                  modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        setSelectedModule(module)
                        setSelectedLesson(null)
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedModule?.id === module.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <div className="font-medium text-sm line-clamp-2">{module.title}</div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lessons List */}
            {selectedModule && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={24} className="text-blue-600" />
                    {selectedModule.title}
                  </CardTitle>
                  <CardDescription>{selectedModule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons.length === 0 ? (
                      <p className="text-gray-600">No lessons in this module yet</p>
                    ) : (
                      lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setShowAssessment(false)
                            setSubmission(null)
                          }}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            selectedLesson?.id === lesson.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                {lesson.estimated_duration_minutes && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {lesson.estimated_duration_minutes} mins
                                  </span>
                                )}
                                {lesson.has_assessment && (
                                  <span className="flex items-center gap-1 text-blue-600">
                                    <CheckCircle size={16} />
                                    Has Assessment
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            {selectedLesson && !showAssessment && (
              <div className="space-y-6">
                {/* Section Navigation Tabs */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedLesson.video_url && (
                        <Button
                          onClick={() => setActiveSection("video")}
                          variant={activeSection === "video" ? "default" : "outline"}
                          className="gap-2"
                        >
                          <BookOpen size={18} />
                          Video
                        </Button>
                      )}
                      {selectedLesson.tutorial_steps && selectedLesson.tutorial_steps.length > 0 && (
                        <Button
                          onClick={() => setActiveSection("tutorial")}
                          variant={activeSection === "tutorial" ? "default" : "outline"}
                          className="gap-2"
                        >
                          <CheckCircle size={18} />
                          Tutorial
                        </Button>
                      )}
                      {selectedLesson.starter_code && (
                        <Button
                          onClick={() => setActiveSection("practice")}
                          variant={activeSection === "practice" ? "default" : "outline"}
                          className="gap-2"
                        >
                          <Code size={18} />
                          Practice
                        </Button>
                      )}
                      {selectedLesson.has_assessment && (
                        <Button
                          onClick={() => setActiveSection("assessment")}
                          variant={activeSection === "assessment" ? "default" : "outline"}
                          className="gap-2"
                        >
                          <BarChart3 size={18} />
                          Assessment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Video Section */}
                {activeSection === "video" && selectedLesson.video_url && (
                  <VideoPlayer
                    videoUrl={selectedLesson.video_url}
                    title={selectedLesson.title}
                    duration={selectedLesson.video_duration_seconds || undefined}
                    fileSize={selectedLesson.video_size_mb ? selectedLesson.video_size_mb * 1024 * 1024 : undefined}
                    description={selectedLesson.content}
                  />
                )}

                {/* Tutorial Section */}
                {activeSection === "tutorial" && selectedLesson.tutorial_steps && selectedLesson.tutorial_steps.length > 0 && (
                  <StepByStepTutorial
                    title={`${selectedLesson.title} - Step by Step`}
                    steps={selectedLesson.tutorial_steps}
                    onComplete={() => {
                      addToast("Tutorial completed! Ready to practice?", "success")
                    }}
                  />
                )}

                {/* Practice Section */}
                {activeSection === "practice" && selectedLesson.starter_code && (
                  <CodeIDE
                    lessonId={selectedLesson.id}
                    initialCode={selectedLesson.starter_code}
                    language={selectedLesson.language || "javascript"}
                    expectedOutput={selectedLesson.expected_output || undefined}
                    title={`${selectedLesson.title} - Practice`}
                  />
                )}

                {/* Assessment Section */}
                {activeSection === "assessment" && !submission && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 size={24} className="text-blue-600" />
                        {selectedLesson.title} - Assessment
                      </CardTitle>
                      <CardDescription>Test your understanding of the material</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setShowAssessment(true)}
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Send size={18} />
                        Start Assessment
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Lesson Description */}
                {activeSection === "video" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose max-w-none text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Assessment Section */}
            {selectedLesson && showAssessment && assessment && !submission && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={24} className="text-blue-600" />
                    {assessment.title}
                  </CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {assessment.questions.length === 0 ? (
                    <p className="text-gray-600">No questions in this assessment</p>
                  ) : (
                    <>
                      {assessment.questions.map((question: Record<string, unknown>, index: number) => (
                        <div key={index} className="space-y-3 pb-6 border-b">
                          <div className="font-semibold text-gray-900">
                            Question {index + 1}: {question.question as string}
                          </div>
                          {question.type === "multiple-choice" && question.options ? (
                            <div className="space-y-2">
                              {(question.options as Array<{ id: string; text: string }>).map((option) => (
                                <label key={option.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option.id}
                                    checked={answers[`question-${index}`] === option.id}
                                    onChange={(e) => setAnswers({ ...answers, [`question-${index}`]: e.target.value })}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-gray-700">{option.text}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <Textarea
                              placeholder="Enter your answer..."
                              value={answers[`question-${index}`] || ""}
                              onChange={(e) => setAnswers({ ...answers, [`question-${index}`]: e.target.value })}
                              className="min-h-20"
                            />
                          )}
                        </div>
                      ))}

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => setShowAssessment(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitAssessment}
                          disabled={submitting}
                          className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <Send size={18} />
                          {submitting ? "Submitting..." : "Submit Assessment"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submission Result */}
            {selectedLesson && submission && (
              <Card className={submission.is_passed ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {submission.is_passed ? (
                      <>
                        <CheckCircle className="text-green-600" size={24} />
                        <span className="text-green-900">Assessment Passed!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-yellow-600" size={24} />
                        <span className="text-yellow-900">Assessment Submitted</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Your Score:</span>
                      <span className="text-2xl font-bold">{submission.score.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Passing Score:</span>
                      <span>{assessment?.passing_score || 70}%</span>
                    </div>
                  </div>

                  {submission.feedback && Object.keys(submission.feedback).length > 0 && (
                    <div className="pt-4">
                      <h4 className="font-semibold mb-2">Feedback:</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(submission.feedback).map(([key, value]) => (
                          <div key={key} className="p-2 bg-white rounded">
                            {typeof value === "string" ? value : JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        setShowAssessment(false)
                        setSubmission(null)
                      }}
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <BookOpen size={18} />
                      Back to Lesson
                    </Button>
                    {submission.is_passed && lessons.length > (selectedLesson ? lessons.indexOf(selectedLesson) + 1 : 0) && (
                      <Button
                        onClick={() => {
                          const nextIndex = lessons.indexOf(selectedLesson) + 1
                          if (nextIndex < lessons.length) {
                            setSelectedLesson(lessons[nextIndex])
                            setShowAssessment(false)
                            setSubmission(null)
                          }
                        }}
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      >
                        Next Lesson
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
