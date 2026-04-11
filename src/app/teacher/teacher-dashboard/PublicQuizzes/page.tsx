"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import QuizCard from '@/components/quizzes/QuizCard'

export default function TeacherPublicQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // new quiz form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timePerQuestion, setTimePerQuestion] = useState(20)
  const [questions, setQuestions] = useState<any[]>([
    { question_text: '', time_limit_seconds: 20, options: [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }] },
  ])

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch('/api/teacher/public-quizzes')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setQuizzes(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [])

  const addQuestion = () => setQuestions((s) => [...s, { question_text: '', time_limit_seconds: timePerQuestion, options: [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }] }])

  const updateQuestion = (idx: number, payload: any) => setQuestions((s) => s.map((q, i) => (i === idx ? { ...q, ...payload } : q)))

  const setCorrectOption = (qIdx: number, optIdx: number) => {
    setQuestions((s) => s.map((q, i) => (i === qIdx ? { ...q, options: q.options.map((o: any, oi: number) => ({ ...o, is_correct: oi === optIdx })) } : q)))
  }

  const createQuiz = async () => {
    if (!title) return alert('Provide a title')
    const payload = { title, description, is_published: true, is_public: true, time_per_question: timePerQuestion, questions }
    try {
      const res = await fetch('/api/teacher/public-quizzes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setQuizzes((q) => [data, ...q])
      // reset form
      setTitle('')
      setDescription('')
      setQuestions([{ question_text: '', time_limit_seconds: 20, options: [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }] }])
      alert('Quiz created')
    } catch (err) {
      console.error(err)
      alert('Failed to create')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Public Quizzes (Teacher)</h1>
          <p className="text-sm text-gray-600">Create and manage public quizzes visible to pupils.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Title" value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />
                  <Textarea placeholder="Description" value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} />
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Time / question (s)</label>
                    <Input type="number" value={timePerQuestion} onChange={(e) => setTimePerQuestion(Number((e.target as HTMLInputElement).value))} />
                  </div>
                  <div className="space-y-2">
                    {questions.map((q, qi) => (
                      <div key={qi} className="border rounded p-2 bg-white">
                        <Input placeholder={`Question ${qi + 1}`} value={q.question_text} onChange={(e) => updateQuestion(qi, { question_text: (e.target as HTMLInputElement).value })} />
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt: any, oi: number) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input type="radio" name={`q-${qi}`} checked={!!opt.is_correct} onChange={() => setCorrectOption(qi, oi)} />
                              <Input placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt.option_text} onChange={(e) => updateQuestion(qi, { options: q.options.map((o: any, idx: number) => (idx === oi ? { ...o, option_text: (e.target as HTMLInputElement).value } : o)) })} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button onClick={addQuestion}>Add question</Button>
                      <Button onClick={() => setQuestions([{ question_text: '', time_limit_seconds: timePerQuestion, options: [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }] }])}>Reset</Button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button onClick={createQuiz} className="w-full">Create & Publish</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {loading ? <div>Loading…</div> : quizzes.length === 0 ? <div>No quizzes yet</div> : quizzes.map((q) => <QuizCard quiz={q} key={q.id} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
