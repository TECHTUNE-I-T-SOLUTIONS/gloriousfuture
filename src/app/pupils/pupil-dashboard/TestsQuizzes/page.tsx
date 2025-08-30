"use client"

import { useEffect, useState, useRef } from "react"
import Loader from "@/components/CustomLoader"
import { FaClipboardList } from "react-icons/fa"

type TestItem = {
  id?: string
  title: string
  subject?: string | null
  description?: string | null
  due_date?: string | null
  class_id?: string | null
  questions?: string[] | unknown[]
}

export default function TestsQuizzes() {
  const [tests, setTests] = useState<TestItem[]>([])
  const [classesMap, setClassesMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, classesRes] = await Promise.all([
          fetch("/api/tests-quizzes", { credentials: 'include' }),
          fetch("/api/teacher/classes", { credentials: 'include' }),
        ])

        if (testsRes.ok) {
          const tdata = await testsRes.json()
          // server might return { success, data } or raw array
          const testsArr = Array.isArray(tdata) ? tdata : (tdata?.data ?? [])
          setTests(testsArr)
        }

        if (classesRes.ok) {
          const cdata = await classesRes.json()
          const classesArr = Array.isArray(cdata) ? cdata : (cdata?.data ?? [])
          const map: Record<string, string> = {}
          for (const c of classesArr) {
            if (c && c.id && c.name) map[c.id] = c.name
          }
          setClassesMap(map)
        }
      } catch (_err) {
        console.error("Error fetching tests/quizzes:", _err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaClipboardList className="mr-2 text-orange-500" /> Tests & Quizzes
      </h1>

      {loading ? (
        <Loader />
      ) : tests.length > 0 ? (
        <ul className="space-y-4">
          {tests.map((test) => {
            const id = test.id ?? test.title
            return (
              <li key={id} className="p-4 bg-white rounded-md shadow-md border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-lg">{test.title}</h2>
                    <p className="text-gray-600">{test.subject ?? ''}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {test.due_date ? new Date(test.due_date).toLocaleDateString() : 'No due date'}
                  </div>
                </div>

                {/* preview */}
                <div className="mt-2 text-sm text-gray-700">
                  <div className="line-clamp-3">{test.description ? String(test.description).slice(0, 200) : ''}</div>
                  <div className="mt-2 text-sm text-gray-600">Class: {test.class_id ? (classesMap[test.class_id] ?? test.class_id) : '—'}</div>
                </div>

                {/* controls: expand/collapse */}
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-3 py-1 bg-gray-100 rounded text-sm" onClick={() => setExpanded((s) => ({ ...s, [id]: !s[id] }))}>
                    {expanded[id] ? 'Hide details' : 'Show details'}
                  </button>
                </div>

                {/* details area (only when expanded and not submitted) */}
                {expanded[id] && (
                  <div className="mt-4">
                    {Array.isArray(test.questions) && test.questions.length > 0 ? (
                      <div className="space-y-3">
                        {test.questions.map((q: unknown, idx: number) => (
                          <div key={idx} className="">
                            <div className="font-medium">{idx + 1}) {typeof q === 'string' ? q : ((q as { question?: string }).question || JSON.stringify(q))}</div>
                          </div>
                        ))}
                        <div className="mt-3">
                          <TestAnswers testId={test.id} questions={test.questions} onSubmitted={() => setSubmittedMap((m) => ({ ...m, [id]: true }))} />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <SubmitForTest testId={test.id} title={test.title} onSubmitted={() => setSubmittedMap((m) => ({ ...m, [id]: true }))} />
                      </div>
                    )}
                  </div>
                )}

                {/* if submitted show banner */}
                {submittedMap[id] && (
                  <div className="mt-3 text-green-700 font-medium">Submitted — only preview is shown</div>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No tests or quizzes available.</p>
      )}
    </div>
  )
}

function SubmitForTest({ testId, title, onSubmitted }: { testId?: string; title: string; onSubmitted?: () => void }) {
  const [open, setOpen] = useState(false)
  const [answersText, setAnswersText] = useState('{ "answers": [] }')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!testId) return setMsg('Missing test id')
    let answers
    try {
      answers = JSON.parse(answersText)
    } catch {
      return setMsg('Invalid JSON in answers')
    }
    setSubmitting(true)
    setMsg(null)
    try {
      const res = await fetch('/api/test-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ test_id: testId, answers }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        setMsg(data?.error || 'Submission failed')
      } else {
        setMsg('Submitted successfully')
        setOpen(false)
        if (onSubmitted) onSubmitted()
      }
    } catch (_err) {
      setMsg(String(_err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setOpen(!open)}>{open ? 'Cancel' : 'Submit Answers'}</button>
      {open && (
        <div className="mt-2">
          <div className="text-sm text-gray-700 mb-1">Enter answers JSON for: <strong>{title}</strong></div>
          <textarea placeholder='{"answers": [{"question_id":"...","answer":"..."}]}' className="w-full border rounded p-2" rows={6} value={answersText} onChange={(e) => setAnswersText(e.target.value)} />
          <div className="mt-2 flex items-center space-x-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setOpen(false)}>Close</button>
            {msg && <div className="text-sm text-red-600">{msg}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

function TestAnswers({ testId, questions, onSubmitted }: { testId?: string; questions: unknown[]; onSubmitted?: () => void }) {
  const [answers, setAnswers] = useState<string[]>(questions?.map(() => '') ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => { setAnswers(questions?.map(() => '') ?? []) }, [questions])

  const onSubmittedRef = useRef<(() => void) | undefined>(onSubmitted)
  useEffect(() => { onSubmittedRef.current = onSubmitted }, [onSubmitted])

  // on mount, check if the current pupil already submitted this test
  // only run once per testId; call the ref to avoid including the callback in deps
  useEffect(() => {
    const check = async () => {
      if (!testId) return
      try {
        const res = await fetch(`/api/test-submissions?testId=${testId}&mine=1`, { credentials: 'include' })
        if (res.ok) {
          const d = await res.json()
          if (d && d.success && d.data) {
            const s = d.data
            if (Array.isArray(s.answers)) {
              setAnswers((s.answers as unknown[]).map((a) => String(a ?? '')))
              setSubmitted(true)
              onSubmittedRef.current?.()
            }
          }
        }
      } catch {
        // ignore
      }
    }
    check()
  }, [testId])

  const setAnswer = (index: number, value: string) => {
    setAnswers((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const [submitted, setSubmitted] = useState(false)

  const handleSubmitAll = async () => {
    if (!testId) return setMsg('Missing test id')
    setSubmitting(true)
    setMsg(null)
    try {
      // prepare answers as an array of strings (ordered)
      const payload = { test_id: testId, answers: answers.map((a) => a ?? '') }
      const res = await fetch('/api/test-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.status === 409) {
        setMsg('You have already submitted this test')
        setSubmitted(true)
        if (onSubmitted) onSubmitted()
      } else if (!res.ok || !data?.success) setMsg(data?.error || 'Submission failed')
      else { setMsg('Submitted successfully'); setSubmitted(true); if (onSubmitted) onSubmitted() }
    } catch (e) { setMsg(String(e)) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-2">
      {questions.map((q, idx) => (
        <div key={idx} className="">
          <textarea placeholder={`Answer for question ${idx + 1}`} rows={4} value={answers[idx] ?? ''} onChange={(e) => setAnswer(idx, e.target.value)} className="w-full border p-2 rounded" disabled={submitted} />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleSubmitAll} disabled={submitting || submitted}>{submitting ? 'Submitting...' : (submitted ? 'Submitted' : 'Submit Answers')}</button>
        {msg && <div className="text-sm text-gray-700">{msg}</div>}
      </div>
    </div>
  )
}
