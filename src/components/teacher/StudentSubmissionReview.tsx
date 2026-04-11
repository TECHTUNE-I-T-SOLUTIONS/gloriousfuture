"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, User, Mail, Calendar, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Submission {
  id: string
  lesson_id: string
  pupil: {
    id: string
    name: string
    email: string
  }
  assessment: {
    id: string
    title: string
  }
  answers: any
  code_submission?: string
  score?: number
  is_passed?: boolean
  feedback?: string
  submitted_at: string
  auto_marked_at?: string
  status: "submitted" | "marked" | "pending_review"
}

interface StudentSubmissionReviewProps {
  course: any
  selectedModule?: any
  selectedLesson?: any
}

export default function StudentSubmissionReview({
  course,
  selectedModule,
  selectedLesson,
}: StudentSubmissionReviewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch submissions for the lesson
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/teacher/submissions?lessonId=${selectedLesson?.id}`)
        if (res.ok) {
          const data = await res.json()
          setSubmissions(data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching submissions:", error)
        setLoading(false)
      }
    }

    if (selectedLesson?.has_assessment && selectedLesson?.id) {
      fetchSubmissions()
    }
  }, [selectedLesson])

  const handleSaveReview = async () => {
    if (!selectedSubmission) return

    try {
      const res = await fetch(`/api/teacher/submissions/${selectedSubmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_feedback: feedback,
          teacher_score: score,
          status: "marked",
          marked_at: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        alert("Review saved successfully")
        setFeedback("")
        setScore(0)
        setSelectedSubmission(null)
        // Refresh submissions
        const updatedRes = await fetch(`/api/teacher/submissions?lessonId=${selectedSubmission.lesson_id}`)
        if (updatedRes.ok) {
          const data = await updatedRes.json()
          setSubmissions(data)
        }
      } else {
        alert("Failed to save review")
      }
    } catch (error) {
      console.error("Error saving review:", error)
      alert("Error saving review")
    }
  }

  if (!selectedLesson?.has_assessment) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">Select a lesson with an assessment to review submissions</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-600">Loading submissions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>{selectedLesson?.title}</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No submissions yet</p>
          ) : (
            <div className="space-y-2">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{submission.pupil.name}</p>
                      <p className="text-xs text-gray-600">{submission.pupil.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {submission.status === "marked" ? (
                        <>
                          {submission.is_passed ? (
                            <CheckCircle size={18} className="text-green-600" />
                          ) : (
                            <XCircle size={18} className="text-red-600" />
                          )}
                          {submission.score !== undefined && (
                            <span className="text-sm font-bold">{submission.score}%</span>
                          )}
                        </>
                      ) : (
                        <Clock size={18} className="text-yellow-600" />
                      )}
                      <Badge
                        variant={
                          submission.status === "marked"
                            ? "default"
                            : submission.status === "pending_review"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Details */}
      {selectedSubmission && (
        <Card>
          <CardHeader>
            <CardTitle>Review Submission</CardTitle>
            <CardDescription>{selectedSubmission.pupil.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="answers" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="answers">Answers</TabsTrigger>
                {selectedSubmission.code_submission && <TabsTrigger value="code">Code</TabsTrigger>}
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="answers" className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Student Answers:</p>
                  <div className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-2 rounded border">
                    {JSON.stringify(selectedSubmission.answers, null, 2)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Submitted</p>
                    <p className="text-sm font-semibold">
                      {new Date(selectedSubmission.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedSubmission.auto_marked_at && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Auto Marked</p>
                      <p className="text-sm font-semibold">
                        {new Date(selectedSubmission.auto_marked_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {selectedSubmission.code_submission && (
                <TabsContent value="code" className="space-y-3">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs font-mono">{selectedSubmission.code_submission}</pre>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="feedback" className="space-y-3">
                <div>
                  <label className="text-sm font-semibold">Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score || selectedSubmission.score || 0}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Feedback</label>
                  <Textarea
                    placeholder="Provide detailed feedback for the student..."
                    value={feedback || selectedSubmission.feedback || ""}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="text-xs"
                  />
                </div>

                <Button onClick={handleSaveReview} className="w-full bg-blue-600">
                  Save Review
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
