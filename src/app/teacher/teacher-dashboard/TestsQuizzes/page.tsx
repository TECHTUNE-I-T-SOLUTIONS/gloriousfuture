"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FileText, Plus, Edit, Trash2, Save, X, Calendar, Clock, Users, CheckCircle } from "lucide-react"
import ConfirmModal from "@/components/ConfirmModal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TestQuiz {
  id?: string
  title: string
  description: string
  due_date: string
  class_id: string
}

export default function TeacherTestsQuizzes() {
  const [tests, setTests] = useState<TestQuiz[]>([])
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [newTest, setNewTest] = useState<TestQuiz>({
    title: "",
    description: "",
    due_date: "",
    class_id: "",
  })
  const [newQuestions, setNewQuestions] = useState<string[]>([""])
  const [editingTest, setEditingTest] = useState<TestQuiz | null>(null)
  const [editQuestions, setEditQuestions] = useState<string[]>([""])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submissionsOpenFor, setSubmissionsOpenFor] = useState<string | null>(null)
  const [subPage, setSubPage] = useState(0)
  const subPageSize = 10

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // tests-quizzes GET returns an array
        const res = await fetch("/api/teacher/tests-quizzes", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          // support both direct array or { success, data }
          if (Array.isArray(data)) setTests(data)
          else if (data && data.success && Array.isArray(data.data)) setTests(data.data)
          else setTests([])
        } else {
          setTests([])
        }

        // fetch classes for the dropdown
        try {
          const cls = await fetch("/api/teacher/classes", { credentials: "include" })
          if (cls.ok) {
            const cd = await cls.json()
            if (Array.isArray(cd)) setClasses(cd)
            else if (cd && cd.success && Array.isArray(cd.data)) setClasses(cd.data)
          }
        } catch (err) {
          console.warn("Failed to fetch classes for Tests & Quizzes dropdown", err)
        }
      } catch (error) {
        console.error("Error fetching tests:", error)
        setTests([])
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    const { name, value } = target
    if (editingTest) {
      setEditingTest((prev) => (prev ? { ...prev, [name]: value } : null))
    } else {
      setNewTest((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleQuestionChange = (index: number, value: string, mode: 'new' | 'edit') => {
    if (mode === 'new') {
      const updated = [...newQuestions]
      updated[index] = value
      setNewQuestions(updated)
    } else {
      const updated = [...editQuestions]
      updated[index] = value
      setEditQuestions(updated)
    }
  }

  const addQuestion = (mode: 'new' | 'edit') => {
    if (mode === 'new') setNewQuestions((q) => [...q, ''])
    else setEditQuestions((q) => [...q, ''])
  }

  const removeQuestion = (index: number, mode: 'new' | 'edit') => {
    if (mode === 'new') setNewQuestions((q) => (q.length > 1 ? q.filter((_, i) => i !== index) : q))
    else setEditQuestions((q) => (q.length > 1 ? q.filter((_, i) => i !== index) : q))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/teacher/tests-quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...newTest, questions: newQuestions }),
        credentials: "include",
      })

      if (res.ok) {
        const payload = await res.json()
        if (payload && payload.success && payload.data) setTests((prev) => [...prev, payload.data])
  setNewTest({ title: "", description: "", due_date: "", class_id: "" })
  setNewQuestions([""])
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error("Error creating test:", error)
    }
  }

  const handleUpdate = async () => {
    if (!editingTest || !editingTest.id) return

    try {
      // PUT handled at /api/teacher/tests-quizzes with JSON body { id, ... }
      const res = await fetch(`/api/teacher/tests-quizzes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...editingTest, questions: editQuestions }),
        credentials: "include",
      })

      if (res.ok) {
        setTests((prev) => prev.map((t) => (t.id === editingTest.id ? editingTest : t)))
  setEditingTest(null)
  setEditQuestions([""])
      }
    } catch (error) {
      console.error("Error updating test:", error)
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    // show per-item inline confirm
  setConfirmTargetId(id)
  setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!confirmTargetId) return
    setDeletingId(confirmTargetId)
    try {
      const res = await fetch(`/api/teacher/tests-quizzes`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: confirmTargetId }), credentials: "include" })
      if (res.ok) {
        const payload = await res.json()
        if (payload && payload.success) setTests((prev) => prev.filter((test) => test.id !== confirmTargetId))
      }
    } catch (error) {
      console.error("Error deleting test:", error)
    } finally {
      setDeletingId(null)
      setConfirmTargetId(null)
      setConfirmOpen(false)
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Tests & Quizzes
          </h1>
          <p className="text-gray-500 mt-2">Create, manage, and evaluate quizzes</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Test/Quiz
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingTest) && (
        <Card className="border-border bg-card animate-fade-in-up p-4">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              {editingTest ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingTest ? "Edit Test/Quiz" : "Create New Test/Quiz"}
            </CardTitle>
            <CardDescription>
              {editingTest ? "Update the test details" : "Design a new test or quiz for your students"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter test title"
                  value={editingTest ? editingTest.title : newTest.title}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={editingTest ? editingTest.due_date : newTest.due_date}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the test content and instructions"
                value={editingTest ? editingTest.description : newTest.description}
                onChange={handleChange}
                className="bg-input border-border"
                rows={4}
              />
            </div>

            <div>
              <Label className="text-base font-medium">Questions</Label>
              {editingTest ? (
                <div className="space-y-2 mt-2">
                  {editQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="text-sm pt-2">{idx + 1})</div>
                      <input placeholder={`Question ${idx + 1}`} value={q} onChange={(e) => handleQuestionChange(idx, e.target.value, 'edit')} className="flex-1 border p-2 rounded" />
                      {editQuestions.length > 1 && <Button variant="outline" size="sm" onClick={() => removeQuestion(idx, 'edit')}>Remove</Button>}
                    </div>
                  ))}
                  <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={() => addQuestion('edit')}>Add Question</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {newQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="text-sm pt-2">{idx + 1})</div>
                      <input placeholder={`Question ${idx + 1}`} value={q} onChange={(e) => handleQuestionChange(idx, e.target.value, 'new')} className="flex-1 border p-2 rounded" />
                      {newQuestions.length > 1 && <Button variant="outline" size="sm" onClick={() => removeQuestion(idx, 'new')}>Remove</Button>}
                    </div>
                  ))}
                  <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={() => addQuestion('new')}>Add Question</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_id">Class</Label>
              <select
                aria-label="Select class"
                id="class_id"
                name="class_id"
                value={editingTest ? editingTest.class_id : newTest.class_id}
                onChange={handleChange}
                className="w-full bg-input border-border p-2 rounded"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              {editingTest ? (
                <>
                  <Button onClick={handleUpdate} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Update Test
                  </Button>
                  <Button onClick={() => setEditingTest(null)} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSubmit} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Test
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)} variant="outline">
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tests List */}
      <div className="space-y-6">
        {tests.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tests created yet</h3>
              <p className="text-gray-500 mb-4">Create your first test or quiz to get started</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Test/Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => {
              const dueDateStr = test.due_date || ""
              const daysUntilDue = dueDateStr ? getDaysUntilDue(dueDateStr) : Infinity
              const overdue = dueDateStr ? isOverdue(dueDateStr) : false

              return (
                <Card key={test.id} className="border-border bg-card hover-lift">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-card-foreground line-clamp-2">{test.title}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Class: {
                            (classes.find((c) => c.id === test.class_id)?.name) || (test.class_id ? test.class_id : '\u2014')
                          }
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Button
                          onClick={() => { setEditingTest(test); try { setEditQuestions(((test as unknown) as { questions?: unknown[] }).questions as string[] ?? [""]) } catch { setEditQuestions([""]) } }}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(test.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-2">
                    <p className={`text-sm text-gray-500 ${expanded[test.id || ''] ? '' : 'line-clamp-3'}`}>{test.description}</p>
                    {(() => {
                      const t = test as unknown as { questions?: unknown[] }
                      if (Array.isArray(t.questions) && t.questions.length > 0) {
                        const qs = t.questions as unknown[]
                        const renderQ = (q: unknown) => {
                          if (typeof q === 'string') return q
                          const asObj = q as { question?: string }
                          return asObj.question ?? JSON.stringify(q)
                        }
                        return (
                          <div className="mt-2 text-sm text-gray-700">
                            <strong>Questions:</strong>
                            <ol className="list-decimal list-inside mt-1 text-sm">
                              {qs.slice(0, 4).map((q, i) => (
                                <li key={i} className="truncate">{renderQ(q)}</li>
                              ))}
                              {qs.length > 4 && <li className="text-xs text-gray-500">+{qs.length - 4} more</li>}
                            </ol>
                          </div>
                        )
                      }
                      return null
                    })()}

                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setExpanded((s) => ({ ...s, [test.id || '']: !s[test.id || ''] }))}>
                        {expanded[test.id || ''] ? 'Collapse' : 'Expand'}
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Due: {dueDateStr ? new Date(dueDateStr).toLocaleDateString() : 'No due date'}
                      </div>
                      {overdue ? (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      ) : daysUntilDue <= 3 ? (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          Due in {daysUntilDue} days
                        </Badge>
                      ) : dueDateStr ? (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntilDue} days left
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">No due date</Badge>
                      )}
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={() => { setSubmissionsOpenFor(test.id || null); setSubPage(0); }}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      View Submissions
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      {/* Render submissions modal when requested */}
      {submissionsOpenFor && (
        <SubmissionsModal
          testId={submissionsOpenFor}
          // find the test by id, then its class_id, then resolve the class name
          className={(() => {
            const t = tests.find((tt) => tt.id === submissionsOpenFor)
            const classId = t ? (t as unknown as { class_id?: string }).class_id : undefined
            return classId ? (classes.find((c) => c.id === classId)?.name || '') : ''
          })()}
          onClose={() => setSubmissionsOpenFor(null)}
          page={subPage}
          pageSize={subPageSize}
          onPageChange={(p) => setSubPage(p)}
        />
      )}
    </div>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Test"
        description="Are you sure you want to delete this test? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        busy={Boolean(deletingId)}
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTargetId(null) }}
      />
    </>
  )
}


function SubmissionsModal({ testId, className, onClose, page, pageSize, onPageChange }: { testId: string | null; className?: string; onClose: () => void; page: number; pageSize: number; onPageChange: (p: number) => void }) {
  type SubmissionItem = { id: string; pupil_id?: string; pupils?: { full_name?: string; first_name?: string; last_name?: string }; answers?: unknown; score?: number | null; submitted_at?: string }
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<SubmissionItem[]>([])
  const [total, setTotal] = useState(0)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const fetchPage = async (p: number) => {
      if (!testId) return
      setLoading(true)
      try {
        const offset = p * pageSize
        const res = await fetch(`/api/test-submissions?testId=${testId}&limit=${pageSize}&offset=${offset}`, { credentials: 'include' })
        const data = await res.json()
        if (res.ok && data.success) {
          setItems(data.data || [])
          setTotal(data.total || 0)
        } else {
          setItems([])
        }
      } catch (err) {
        console.error('Failed to load submissions', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPage(page)
  }, [testId, page, pageSize])

  const handleSaveScore = async (id: string, score: number) => {
    try {
      const res = await fetch('/api/test-submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id, score }) })
      const data = await res.json()
      if (res.ok && data.success) {
        // update local item
        setItems((prev) => prev.map((it) => (it.id === id ? data.data : it)))
        setToast({ type: 'success', message: 'Score saved' })
        setTimeout(() => setToast(null), 2500)
      } else {
        setToast({ type: 'error', message: data?.error || 'Failed to save score' })
        setTimeout(() => setToast(null), 3000)
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: String(err) })
      setTimeout(() => setToast(null), 3000)
    }
  }

  const displayPupilName = (pupils?: { full_name?: string; first_name?: string; last_name?: string } | null, pupil_id?: string) => {
    if (pupils) {
      if (pupils.full_name) return pupils.full_name
      const name = `${pupils.first_name || ''} ${pupils.last_name || ''}`.trim()
      if (name) return name
    }
    if (pupil_id) return `${String(pupil_id).slice(0, 8)}...`
    return 'Unknown Student'
  }

  if (!testId) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 space-y-8 animate-fade-in-up">
      <div className="bg-white rounded w-auto w-11/12 md:w-1/2 max-h-[80vh] overflow-auto p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Submissions</h3>
            {className ? <div className="text-sm text-gray-500">Class: {className}</div> : null}
          </div>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Close</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="space-y-3">
            {items.length === 0 ? <div className="text-gray-500">No submissions yet</div> : items.map((s) => (
              <div key={s.id} className="p-3 border rounded flex items-start justify-between">
                  <div>
                  <div className="font-medium">{displayPupilName(s.pupils, s.pupil_id)}</div>
                  <div className="text-sm text-gray-500">Submitted: {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : ''}</div>
                  <div className="mt-2 text-sm">
                    {Array.isArray(s.answers) ? (
                      <div className="space-y-1 text-sm">
                        {Array.isArray(s.answers) && (s.answers as unknown[]).map((a: unknown, i: number) => (
                          <div key={i} className=""><strong>{i + 1})</strong> <span className="whitespace-pre-wrap">{typeof a === 'string' ? a : JSON.stringify(a)}</span></div>
                        ))}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(s.answers, null, 2)}</pre>
                    )}
                  </div>
                </div>
                <div className="w-40">
                  <div className="mb-2 text-sm text-gray-600">Score</div>
                  <input placeholder="e.g. 75" type="number" defaultValue={s.score ?? ''} className="w-full border p-1 rounded" onBlur={(e) => handleSaveScore(s.id, Number(e.currentTarget.value))} />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total: {total}</div>
              <div className="space-x-2">
                <button onClick={() => onPageChange(Math.max(0, page - 1))} className="px-3 py-1 bg-gray-100 rounded">Prev</button>
                <button onClick={() => onPageChange(page + 1)} className="px-3 py-1 bg-gray-100 rounded">Next</button>
              </div>
            </div>
            {toast && (
              <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{toast.message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
