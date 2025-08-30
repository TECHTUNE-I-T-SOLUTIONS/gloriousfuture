"use client"

import { useEffect, useState } from "react"
import { FaLaptopCode, FaClock, FaCalendarAlt, FaPlay, FaExclamationTriangle } from "react-icons/fa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function CBTExams() {
  type ExamListItem = { id: string; title: string; subject: string; duration: number | null; date: string | null; taken?: boolean; attempt?: { score?: number } }
  const [exams, setExams] = useState<ExamListItem[]>([])
  const [loading, setLoading] = useState(true)
  type QuestionShape = { question: string; options: string[] | { a?: string; b?: string; c?: string; d?: string }; correctAnswer?: string }
  type SelectedExam = { id: string; title?: string; subject?: string; duration?: number | null; date?: string | null; questions?: QuestionShape[]; taken?: boolean; attempt?: { score?: number } }
  const [selectedExam, setSelectedExam] = useState<SelectedExam | null>(null)

  useEffect(() => {
  const fetchExams = async () => {
      try {
    const res = await fetch("/api/pupils/cbt-exams", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          // normalize server rows (cbt_exams) to UI shape: title, subject, duration (optional), date
          const mapped = (data || []).map((e: unknown) => {
            const row = e as Record<string, unknown>
            return {
              id: (row.id as string) ?? "",
              title: (row.exam_title as string) ?? (row.title as string) ?? "Untitled",
              subject: (row.subject as string) ?? "",
              duration: (typeof row.duration === 'number') ? (row.duration as number) : null,
              date: (row.created_at as string) ?? (row.date as string) ?? null,
              questions: row.questions,
              taken: !!row.taken,
              attempt: row.attempt as { score?: number } | undefined,
            }
          })
          setExams(mapped)
        }
      } catch (error) {
        console.error("Error fetching CBT exams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  const confirmExamStart = (exam: SelectedExam) => {
    setSelectedExam(exam)
  }

  const startExam = () => {
    if (selectedExam) {
      // normalize questions: convert options object to array if needed
      const sel = selectedExam as SelectedExam
      const normalized = {
        ...sel,
        questions: (sel.questions || []).map((q: QuestionShape) => {
          if (Array.isArray(q.options)) return q
          const opts = (q.options || {}) as { a?: string; b?: string; c?: string; d?: string }
          return { ...q, options: [opts.a || "", opts.b || "", opts.c || "", opts.d || ""] }
        }),
      }
      sessionStorage.setItem("activeExam", JSON.stringify(normalized))
      // ensure correct route under pupils
  // dispatch an event so the parent dashboard will switch pages (works whether rendered inline or as routes)
  window.dispatchEvent(new CustomEvent("pupil-set-active-page", { detail: { page: "maincbtexams" } }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <FaLaptopCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">CBT Exams</h1>
            <p className="text-gray-600">Computer-Based Testing - Take your exams online</p>
          </div>
        </div>

        {/* Exams Grid */}
        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group p-4">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {exam.title}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          {exam.subject}
                        </Badge>
                        {exam.taken ? (
                          <Badge className="bg-gray-100 text-gray-800">Taken{exam.attempt?.score ? ` — ${exam.attempt.score}%` : ''}</Badge>
                        ) : null}
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FaLaptopCode className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaClock className="w-4 h-4 text-blue-500" />
                      <span>
                        Duration: <span className="font-medium">{exam.duration} minutes</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 text-green-500" />
                      <span>
                        Scheduled: <span className="font-medium">{exam.date ? formatDate(exam.date) : "-"}</span>
                      </span>
                    </div>
                  </div>

                  {exam.taken ? (
                    <Button onClick={() => { sessionStorage.setItem('viewExamId', exam.id); window.dispatchEvent(new CustomEvent('pupil-set-active-page', { detail: { page: 'exam-results' } })) }} className="w-full bg-gray-500 text-white font-medium py-2.5">View Results</Button>
                  ) : (
                    <Button
                      onClick={() => confirmExamStart(exam)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5"
                    >
                      <FaPlay className="mr-2 w-4 h-4" />
                      Start Exam
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg border-0 p-4">
            <CardContent className="text-center py-12">
              <FaLaptopCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No CBT Exams Available</h3>
              <p className="text-gray-500">There are currently no computer-based tests scheduled.</p>
              <p className="text-gray-400 text-sm mt-1">Check back later or contact your instructor.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exam Confirmation Dialog */}
      <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
        <DialogContent className="sm:max-w-md p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-amber-500" />
              <span>Start Exam Confirmation</span>
            </DialogTitle>
            <DialogDescription>Please review the exam details before starting.</DialogDescription>
          </DialogHeader>

          {selectedExam && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedExam.title}</h4>
                  <p className="text-sm text-gray-600">Subject: {selectedExam.subject}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <FaClock className="w-4 h-4 text-blue-500" />
                    <span>{selectedExam.duration ?? "-"} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt className="w-4 h-4 text-green-500" />
                    <span>{formatDate(selectedExam.date ?? "")}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <FaExclamationTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium mb-1">Important Instructions:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Once started, the timer cannot be paused</li>
                      <li>• Ensure stable internet connection</li>
                      <li>• Do not refresh or close the browser</li>
                      <li>• Submit before time runs out</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={() => setSelectedExam(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={startExam} className="flex-1 bg-green-500 hover:bg-green-600">
                  <FaPlay className="mr-2 w-4 h-4" />
                  Start Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
