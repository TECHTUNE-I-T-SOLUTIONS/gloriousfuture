"use client"

import { useEffect, useState } from "react"
import Loader from "@/components/CustomLoader"
import { FaFileAlt } from "react-icons/fa"

export default function ExamResults() {
  type CbtExams = {
    questions?: unknown[]
    exam_title?: string
    subject?: string
    class_id?: string | number
  }

  type Attempt = {
    subject: string | undefined
    questions?: unknown[]
    cbt_exams?: CbtExams
    answers?: Record<string, unknown>
    responses?: Record<string, unknown>
    score?: number
    percent?: number
    title?: string
    class_name?: string
    class?: string | number
    id?: string | number
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [list, setList] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const viewExamId = sessionStorage.getItem("viewExamId")
        if (!viewExamId) {
          // fetch list of results (preview)
          const res = await fetch("/api/exam-results", { credentials: "include" })
          if (res.ok) {
            const data = await res.json()
            setList(Array.isArray(data) ? data : [])
          }
          return
        }

        // if a viewExamId was provided, fetch the single attempt detail
        const res = await fetch(`/api/pupils/attempt?examId=${encodeURIComponent(viewExamId)}`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          if (data.success) setAttempt(data.attempt)
        }
      } catch (err) {
        console.error("Error fetching attempt:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttempt()
  }, [])

  if (loading) return <Loader />

  // If no detailed attempt loaded but we have a list, show previews with expand buttons
  if (!attempt && list.length > 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4 flex items-center">
          <FaFileAlt className="mr-2 text-purple-500" /> Exam Results
        </h1>
        <ul className="space-y-4">
          {list.map((r: Record<string, unknown>, i: number) => {
            const id = String(r.id ?? i)
            return (
              <li key={id} className="p-4 bg-white rounded-md shadow-md border">
                <h2 className="font-bold">{String(r.subject ?? r.title ?? 'Exam')}</h2>
                <p>Score: {String(r.score ?? r.percent ?? '-')}</p>
                <div className="mt-2">
                  <button className="px-3 py-1 bg-gray-100 rounded" onClick={async () => {
                    setLoading(true)
                    try {
                      const res = await fetch(`/api/pupils/attempt?examId=${encodeURIComponent(id)}`, { credentials: 'include' })
                      if (res.ok) {
                        const data = await res.json()
                        if (data.success) setAttempt(data.attempt)
                      }
                    } catch (err) {
                      console.error('Error fetching attempt detail', err)
                    } finally {
                      setLoading(false)
                    }
                  }}>View details</button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  // If we reached here and there's no attempt and no list, show a placeholder
  if (!attempt && list.length === 0) return <p className="p-6 text-gray-500">No results available.</p>

  // Detailed attempt view: show questions, pupil answers, and correct answers
  const questions = attempt!.questions ?? attempt!.cbt_exams?.questions ?? []
  const answers = attempt!.answers ?? attempt!.responses ?? {}
  const examTitle = attempt!.cbt_exams?.exam_title ?? attempt!.title ?? ''
  const examSubject = attempt!.cbt_exams?.subject ?? attempt!.subject ?? ''
  const examClass = (typeof attempt!.class_name === 'string' ? String(attempt!.class_name) : (attempt!.cbt_exams && typeof attempt!.cbt_exams.class_id === 'string' ? String(attempt!.cbt_exams.class_id) : (typeof attempt!.class === 'string' ? String(attempt!.class) : '')))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaFileAlt className="mr-2 text-purple-500" /> Exam Results
      </h1>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-md shadow border">
          <h2 className="font-bold text-lg">{examTitle || 'Exam'}</h2>
          <div className="text-sm text-gray-600">
            <div>Subject: {examSubject || '—'}</div>
            <div>Class: {examClass || '—'}</div>
            <div className="mt-1">Score: {String(attempt?.score ?? (attempt?.percent ?? '-'))}</div>
          </div>
        </div>

        {questions.map((q: unknown, idx: number) => {
          const qq = q as Record<string, unknown>
          const questionText = String(qq?.['question'] ?? qq?.['title'] ?? '')
          const opts = qq?.['options']
          return (
            <div key={idx} className="p-4 bg-white rounded-md shadow border">
              <div className="font-medium mb-2">{idx + 1}. {questionText}</div>
              <ul className="space-y-2">
                {(() => {
                  // Normalize options: ensure it's an array; if not, try to coerce sensible fallback
                  const normalizedOpts: string[] = Array.isArray(opts)
                    ? (opts as string[])
                    : opts && typeof opts === 'object'
                    ? Object.values(opts as Record<string, string>)
                    : opts && typeof opts === 'string'
                    ? String(opts).split(/\s*,\s*/)
                    : []

                  if (normalizedOpts.length === 0) {
                    // no options available: show student's answer and correct answer if available
                      const answersObj = answers as Record<string, unknown>
                      const attemptAnswers = attempt?.answers as Record<string, unknown> | undefined
                      const studentAnswer = answersObj?.[String(idx)] ?? answersObj?.[idx] ?? attemptAnswers?.[String(idx)] ?? attemptAnswers?.[idx]
                      const rawCorrect = (qq as Record<string, unknown>)['correctAnswer']
                      const correctAnswerStr = rawCorrect === undefined || rawCorrect === null ? '' : String(rawCorrect)
                    return (
                      <li className="p-2 text-sm text-gray-700">
                        <div><strong>Your answer:</strong> {String(studentAnswer ?? '-')}</div>
                        {correctAnswerStr !== '' && <div className="text-xs text-green-700">Correct answer: {correctAnswerStr}</div>}
                      </li>
                    )
                  }

                  return normalizedOpts.map((opt: string, oi: number) => {
                    const aobj = answers as Record<string, unknown>
                    const isSelected = aobj?.[String(idx)] === opt || aobj?.[String(idx)] === oi || aobj?.[String(idx)] === String(oi) || aobj?.[String(oi)] === opt
                    const correctAns = (qq as Record<string, unknown>)['correctAnswer']
                    const isCorrect = correctAns === opt || correctAns === String(oi)
                    return (
                      <li key={oi} className={`p-2 rounded ${isCorrect ? 'bg-green-50 border border-green-200' : isSelected ? 'bg-blue-50 border border-blue-200' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div>{String.fromCharCode(97 + oi)}) {opt}</div>
                          <div className="text-sm">
                            {isCorrect && <span className="text-green-700 font-semibold">Correct</span>}
                            {!isCorrect && isSelected && <span className="text-blue-700">Your answer</span>}
                          </div>
                        </div>
                      </li>
                    )
                  })
                })()}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

