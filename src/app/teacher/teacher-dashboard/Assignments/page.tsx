"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import ConfirmModal from "@/components/ConfirmModal"
import { BookOpen, Plus, Calendar, Users, FileText, Star, Download, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// CustomAlert removed in favor of inline toasts
import ErrorBoundary from "../../../../components/ErrorBoundary"

interface Assignment {
  id: string
  title: string
  due_date?: string
  questions?: string[]
  description?: string | null
  class_id?: string | null
}

interface Submission {
  id: string
  assignment_id: string
  pupil_id: string
  submitted_at: string
  file_url?: string
  text_submission?: string
  grade?: number
  feedback?: string
}

interface SubmissionWithPupil extends Submission {
  pupil?: { id?: string; full_name?: string; uin?: string; profile_picture?: string } | null
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<SubmissionWithPupil[]>([])
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState<{ [key: string]: { grade: string; feedback: string } }>({})
  const [showCreateForm, setShowCreateForm] = useState(false)

  // State for new assignment form
  const [newTitle, setNewTitle] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [newQuestions, setNewQuestions] = useState<string[]>([""])
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [manualSubject, setManualSubject] = useState<string>("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // toast system
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: "success" | "error" | "warning" | "info" }[]
  >([])

  // edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDueDate, setEditDueDate] = useState("")
  const [editQuestions, setEditQuestions] = useState<string[]>([""])
  const [editClassId, setEditClassId] = useState<string | null>(null)
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null)
  const [editManualSubject, setEditManualSubject] = useState<string>("")

  const addToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }

  // assessment modal state (grading submissions)
  const [assessModalOpen, setAssessModalOpen] = useState(false)
  const [assessSubs, setAssessSubs] = useState<SubmissionWithPupil[]>([])
  const [assessIndex, setAssessIndex] = useState(0)

  // delete confirmation modal (shared component)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null)

  // modal keyboard and focus handling
  useEffect(() => {
    const anyOpen = editModalOpen || assessModalOpen || confirmOpen
    if (!anyOpen) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // close the top-most modal
        if (assessModalOpen) setAssessModalOpen(false)
        else if (editModalOpen) {
          setEditModalOpen(false)
          setEditingAssignment(null)
        } else if (confirmOpen) {
          setConfirmOpen(false)
          setConfirmTargetId(null)
        }
      }

      if (e.key === "Tab") {
        const modal = document.querySelector("[data-modal]") as HTMLElement | null
        if (!modal) return
        const focusable = modal.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handler)
    // focus first focusable inside the modal
    setTimeout(() => {
      const modal = document.querySelector("[data-modal]") as HTMLElement | null
      modal?.querySelector<HTMLElement>("input, button, select, textarea")?.focus()
    }, 0)

    return () => document.removeEventListener("keydown", handler)
  }, [editModalOpen, assessModalOpen, confirmOpen])

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/teacher/assignments", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setAssignments(data.assignments || [])
          setSubmissions(data.submissions || [])
        }
      } catch (error) {
        console.error("Error fetching assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch classes for the teacher to choose from
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/teacher/classes", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setClasses(data)
        }
      } catch (err) {
        console.error("Error fetching classes:", err)
      }
    }

    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/teacher/subjects', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setSubjects(data)
        }
      } catch (err) {
        console.warn('Failed to fetch subjects', err)
      }
    }

    fetchClasses()
    fetchSubjects()

    fetchAssignments()
  }, [])

  const handleGradeChange = (submissionId: string, field: "grade" | "feedback", value: string) => {
    setGrading((prev) => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], [field]: value },
    }))
  }

  const submitGrade = async (submissionId: string) => {
    const { grade, feedback } = grading[submissionId] || { grade: "", feedback: "" }

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId, grade, feedback }),
      })

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === submissionId ? { ...sub, grade: Number(grade), feedback } : sub)),
        )
        addToast("Grade submitted successfully!", "success")
        return true
      }
      addToast("Failed to submit grade.", "error")
      return false
    } catch (error) {
      console.error("Error submitting grade:", error)
      addToast("Error submitting grade.", "error")
      return false
    }
  }

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...newQuestions]
    updatedQuestions[index] = value
    setNewQuestions(updatedQuestions)
  }

  const addQuestion = () => {
    setNewQuestions([...newQuestions, ""])
  }

  const removeQuestion = (index: number) => {
    if (newQuestions.length > 1) {
      setNewQuestions(newQuestions.filter((_, i) => i !== index))
    }
  }

  const createAssignment = async () => {
    if (!newTitle || !newDueDate || newQuestions.some((q) => q.trim() === "")) {
      addToast("Please fill all fields before submitting.", "warning")
      return
    }

    if (!selectedClassId) {
      addToast("Please select a class for this assignment.", "warning")
      return
    }

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend expects snake_case due_date; teacher_id is derived server-side; include class_id
        body: JSON.stringify({
          title: newTitle,
          due_date: newDueDate,
          questions: newQuestions,
          class_id: selectedClassId,
          ...(selectedSubjectId ? { subject_id: selectedSubjectId } : {}),
          ...(selectedSubjectId === null && manualSubject ? { subject: manualSubject } : {}),
        }),
        credentials: "include",
      })

      if (res.ok) {
        const payload = await res.json()
        // supabase returns inserted rows in payload.data (array) when using insert().select()
        const inserted = Array.isArray(payload.data) ? payload.data[0] : payload.data
        // fallback when API returned the object directly or as assignments
        const newAssignment = inserted ?? (payload.assignments ? payload.assignments.slice(-1)[0] : null)
        if (newAssignment) setAssignments((prev) => [...prev, newAssignment])

        setNewTitle("")
        setNewDueDate("")
        setNewQuestions([""])
        setSelectedSubjectId(null)
        setManualSubject("")
        setShowCreateForm(false)
        addToast("Assignment created successfully!", "success")
      }
    } catch (error) {
      console.error("Error creating assignment:", error)
      addToast("Error creating assignment.", "error")
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }))
  }

  const duplicateAssignment = async (assignment: Assignment) => {
    try {
      // determine class to assign the duplicate to
      const targetClassId = assignment.class_id ?? selectedClassId ?? classes[0]?.id ?? null
      if (!targetClassId) {
        addToast("Cannot duplicate assignment: no class available. Please assign it to a class first.", "warning")
        return
      }

      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${assignment.title} (copy)`,
          due_date: assignment.due_date ?? null,
          questions: assignment.questions ?? [],
          class_id: targetClassId,
        }),
        credentials: "include",
      })

      if (res.ok) {
        const payload = await res.json()
        const inserted = Array.isArray(payload.data) ? payload.data[0] : payload.data
        const newAssignment = inserted ?? (payload.assignments ? payload.assignments.slice(-1)[0] : null)
        if (newAssignment) setAssignments((prev) => [...prev, newAssignment])
        addToast("Assignment duplicated successfully!", "success")
      } else {
        addToast("Failed to duplicate assignment.", "error")
      }
    } catch (err) {
      console.error("Error duplicating assignment:", err)
      addToast("Error duplicating assignment.", "error")
    }
  }

  // open edit modal
  const openEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setEditTitle(assignment.title)
    // ensure due date is populated in modal
    setEditDueDate(assignment.due_date ? assignment.due_date.split("T")[0] : "")
    setEditQuestions(assignment.questions ?? [""])
    setEditClassId(assignment.class_id ?? null)
    // populate edit subject fields if available
    const subjId = ((assignment as unknown) as Record<string, unknown>).subject_id ?? null
    if (subjId) setEditSubjectId(subjId as string)
    else if (((assignment as unknown) as Record<string, unknown>).subject) setEditSubjectId("__other")
    else setEditSubjectId(null)
    setEditManualSubject(String(((assignment as unknown) as Record<string, unknown>).subject ?? ""))
    setEditModalOpen(true)
  }

  const openAssessModal = (assignmentId: string) => {
    const subs = submissions.filter((s) => s.assignment_id === assignmentId)
    if (subs.length === 0) {
      addToast("No submissions to assess.", "info")
      return
    }
    setAssessSubs(subs)
    setAssessIndex(0)
    setAssessModalOpen(true)
  }

  const closeAssessModal = () => {
    setAssessModalOpen(false)
    setAssessSubs([])
    setAssessIndex(0)
  }

  const assessNext = () => setAssessIndex((i) => Math.min(i + 1, assessSubs.length - 1))
  const assessPrev = () => setAssessIndex((i) => Math.max(i - 1, 0))

  const handleAssessSubmit = async () => {
    const sub = assessSubs[assessIndex]
    if (!sub) return
    // ensure grading state has the current values
    const currentGrade = grading[sub.id]?.grade ?? String(sub.grade ?? "")
    const currentFeedback = grading[sub.id]?.feedback ?? sub.feedback ?? ""
    setGrading((g) => ({ ...g, [sub.id]: { grade: currentGrade, feedback: currentFeedback } }))
    const ok = await submitGrade(sub.id)
    if (ok) {
      // move to next submission automatically if possible
      if (assessIndex < assessSubs.length - 1) {
        assessNext()
      } else {
        addToast("All submissions reviewed.", "info")
      }
    }
  }

  const isOverdueTimestamp = (dueDate?: string | null) => {
    if (!dueDate) return false
    try {
      return new Date(dueDate) < new Date()
    } catch {
      return false
    }
  }

  const daysUntilFromTimestamp = (dueDate?: string | null) => {
    if (!dueDate) return Infinity
    try {
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    } catch {
      return Infinity
    }
  }

  const handleEditQuestionChange = (index: number, value: string) => {
    const updated = [...editQuestions]
    updated[index] = value
    setEditQuestions(updated)
  }

  const addEditQuestion = () => setEditQuestions((q) => [...q, ""])
  const removeEditQuestion = (index: number) => setEditQuestions((q) => q.filter((_, i) => i !== index))

  const saveEdit = async () => {
    if (!editingAssignment) return
    if (!editTitle || !editDueDate || editQuestions.some((q) => q.trim() === "")) {
      addToast("Please fill all fields before saving.", "warning")
      return
    }

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingAssignment.id,
          title: editTitle,
          due_date: editDueDate,
          questions: editQuestions,
          class_id: editClassId,
          ...(editSubjectId && editSubjectId !== "__other" ? { subject_id: editSubjectId } : {}),
          ...(editSubjectId === "__other" && editManualSubject ? { subject: editManualSubject } : {}),
        }),
        credentials: "include",
      })

      if (res.ok) {
        const payload = await res.json()
        const updated = Array.isArray(payload.data) ? payload.data[0] : payload.data
        if (updated) {
          setAssignments((prev) => prev.map((a) => (a.id === editingAssignment.id ? { ...a, ...updated } : a)))
          addToast("Assignment updated.", "success")
        }
        setEditModalOpen(false)
        setEditingAssignment(null)
      } else {
        addToast("Failed to update assignment.", "error")
      }
    } catch (err) {
      console.error("Error updating assignment:", err)
      addToast("Error updating assignment.", "error")
    }
  }

  const deleteAssignment = async (id: string) => {
    try {
      const res = await fetch(`/api/teacher/assignments?id=${id}`, { method: "DELETE", credentials: "include" })
      if (res.ok) {
        setAssignments((prev) => prev.filter((a) => a.id !== id))
        addToast("Assignment deleted.", "success")
      } else {
        addToast("Failed to delete assignment.", "error")
      }
    } catch (err) {
      console.error("Error deleting assignment:", err)
      addToast("Error deleting assignment.", "error")
    }
  }

  const openDeleteModal = (id: string) => {
    setConfirmTargetId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!confirmTargetId) return
    await deleteAssignment(confirmTargetId)
    setConfirmOpen(false)
    setConfirmTargetId(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Toast container */}
      <div className="fixed right-4 top-4 z-[10000] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow-md text-sm max-w-xs break-words ${
              t.type === "success"
                ? "bg-green-600 text-white"
                : t.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Assignments
          </h1>
          <p className="text-black mt-2">Create, manage, and grade pupil assignments</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <Card className="border-border bg-card animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Assignment
            </CardTitle>
            <CardDescription>Design a new assignment for your pupils</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="Enter assignment title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classSelect">Class</Label>
                <select
                  id="classSelect"
                  aria-label="Select class for assignment"
                  value={selectedClassId ?? ""}
                  onChange={(e) => setSelectedClassId(e.target.value || null)}
                  className="w-full bg-input border-border rounded-md p-2"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectSelect">Subject</Label>
                <select id="subjectSelect" aria-label="Select subject" value={selectedSubjectId ?? ""} onChange={(e) => setSelectedSubjectId(e.target.value || null)} className="w-full bg-input border-border rounded-md p-2">
                  <option value="">Select subject</option>
                  {subjects.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                  <option value="__other">Other (manual)</option>
                </select>
                {selectedSubjectId === "__other" && (
                  <Input placeholder="Enter subject name" value={manualSubject} onChange={(e) => setManualSubject(e.target.value)} />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Questions</Label>
              {newQuestions.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Question ${index + 1}`}
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      className="bg-input border-border w-full"
                    />
                  </div>
                  {newQuestions.length > 1 && (
                    <Button onClick={() => removeQuestion(index)} variant="outline" size="sm" className="px-3">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={createAssignment} className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Create Assignment
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <ErrorBoundary>
        <div className="space-y-6">
          {assignments.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No assignments yet</h3>
                <p className="text-black mb-4">Create your first assignment to get started</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id} className="border-border bg-card hover-lift">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {assignment.title}
                      </CardTitle>
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "—"}
                        </span>
                        <span>
                          {isOverdueTimestamp(assignment.due_date) ? (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          ) : (() => {
                            const days = daysUntilFromTimestamp(assignment.due_date)
                            if (days <= 3) return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Due in {days} days</Badge>
                            if (days !== Infinity) return <Badge variant="outline" className="text-xs">{days} days left</Badge>
                            return null
                          })()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {submissions.filter((sub) => sub.assignment_id === assignment.id).length} submissions
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {String(subjects.find((s) => s.id === ((assignment as unknown) as Record<string, unknown>).subject_id)?.name ?? ((assignment as unknown) as Record<string, unknown>).subject ?? "—")}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {(assignment.questions ?? []).length} questions
                      </Badge>
                      <span className="text-xs sm:text-sm text-black hidden sm:inline">
                        {classes.find((c) => c.id === assignment.class_id)?.name ?? "Unassigned"}
                      </span>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExpand(assignment.id)}
                          className="text-xs px-2 py-1"
                        >
                          {expanded[assignment.id] ? "Hide" : "View"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateAssignment(assignment)}
                          className="text-xs px-2 py-1 hidden sm:inline-flex"
                        >
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(assignment)}
                          className="text-xs px-2 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteModal(assignment.id)}
                          className="text-xs px-2 py-1"
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openAssessModal(assignment.id)}
                          className="text-xs px-2 py-1"
                        >
                          Assess
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="submissions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="submissions">Submissions</TabsTrigger>
                      <TabsTrigger value="questions">Questions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="submissions" className="space-y-4">
                      {expanded[assignment.id] && (
                        <div className="mb-4 p-4 bg-gray-200 rounded-md border border-border">
                          <h4 className="font-semibold text-foreground">Description</h4>
                          <div className="text-sm text-black mt-2">
                            {(() => {
                              try {
                                const desc = assignment.description
                                if (!desc) return "—"
                                // If description is JSON containing questions, render them nicely
                                if (typeof desc === "string") {
                                  const parsed = JSON.parse(desc)
                                  if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
                                    return (
                                      <ol className="list-decimal list-inside space-y-1">
                                        {parsed.questions.map((q: string, i: number) => (
                                          <li key={i} className="text-black">
                                            {q}
                                          </li>
                                        ))}
                                      </ol>
                                    )
                                  }
                                }
                                // Fallback: plain text
                                return <pre className="whitespace-pre-wrap">{assignment.description}</pre>
                              } catch {
                                return <pre className="whitespace-pre-wrap">{assignment.description}</pre>
                              }
                            })()}
                          </div>
                        </div>
                      )}
                      {(() => {
                        const subsFor = submissions.filter((sub) => sub.assignment_id === assignment.id)
                        if (subsFor.length === 0) {
                          return (
                            <div className="text-center py-8">
                              <Users className="h-8 w-8 text-black mx-auto mb-2" />
                              <p className="text-black">No submissions yet</p>
                            </div>
                          )
                        }

                        const previews = subsFor.slice(0, 3)
                        return (
                          <div className="space-y-3">
                            <div className="grid gap-3">
                              {previews.map((sub) => (
                                <Card key={sub.id} className="p-4 bg-background border border-border">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-foreground truncate">
                                        {sub.pupil?.full_name ?? sub.pupil_id}
                                      </p>
                                      <p className="text-sm text-black">
                                        {new Date(sub.submitted_at).toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {sub.grade != null && (
                                        <Badge variant="outline" className="text-xs">
                                          {sub.grade}/100
                                        </Badge>
                                      )}
                                      {sub.file_url && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          asChild
                                          className="text-xs px-2 py-1 bg-transparent"
                                        >
                                          <a href={sub.file_url} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-3 w-3 mr-1" />
                                            File
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                              <p className="text-sm text-black">
                                Showing {previews.length} of {subsFor.length} submissions
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setAssessSubs(subsFor)
                                    setAssessIndex(0)
                                    setAssessModalOpen(true)
                                  }}
                                  className="text-xs"
                                >
                                  View all submissions
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </TabsContent>

                    <TabsContent value="questions" className="space-y-3">
                      {(assignment.questions ?? []).map((question, index) => (
                        <div key={index} className="p-3 bg-background rounded-lg border border-border">
                          <p className="font-medium text-foreground">Question {index + 1}:</p>
                          <p className="text-black mt-1">{question}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ErrorBoundary>

      {/* Edit Assignment Modal */}
      {editModalOpen && editingAssignment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Star className="h-5 w-5" />
                Edit Assignment
              </CardTitle>
              <CardDescription>Edit the details of the assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Assignment Title</Label>
                  <Input
                    id="editTitle"
                    placeholder="Enter assignment title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDueDate">Due Date</Label>
                  <Input
                    id="editDueDate"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editClassSelect">Class</Label>
                <select
                  id="editClassSelect"
                  aria-label="Select class for assignment"
                  value={editClassId ?? ""}
                  onChange={(e) => setEditClassId(e.target.value || null)}
                  className="w-full bg-input border-border rounded-md p-2"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSubjectSelect">Subject</Label>
                <select id="editSubjectSelect" aria-label="Select subject" value={editSubjectId ?? ""} onChange={(e) => setEditSubjectId(e.target.value || null)} className="w-full bg-input border-border rounded-md p-2">
                  <option value="">Select subject</option>
                  {subjects.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                  <option value="__other">Other (manual)</option>
                </select>
                {editSubjectId === "__other" && (
                  <Input placeholder="Enter subject name" value={editManualSubject} onChange={(e) => setEditManualSubject(e.target.value)} />
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Questions</Label>
                {editQuestions.map((question, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`Question ${index + 1}`}
                        value={question}
                        onChange={(e) => handleEditQuestionChange(index, e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                    {editQuestions.length > 1 && (
                      <Button
                        onClick={() => removeEditQuestion(index)}
                        variant="outline"
                        size="sm"
                        className="px-3 sm:w-auto w-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sm:hidden ml-2">Remove</span>
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={addEditQuestion}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={saveEdit} className="flex items-center justify-center gap-2">
                  <Star className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={() => setEditModalOpen(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {assessModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Star className="h-5 w-5" />
                Assess Submissions
              </CardTitle>
              <CardDescription>Grade and provide feedback for pupil submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessSubs.length > 0 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 p-2">
                    <div>
                      <p className="font-medium text-foreground">
                        Submission {assessIndex + 1} of {assessSubs.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={assessPrev} disabled={assessIndex === 0}>
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={assessNext}
                        disabled={assessIndex === assessSubs.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <Card className="border-border bg-background">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            Pupil ID: {assessSubs[assessIndex].pupil?.uin ?? assessSubs[assessIndex].pupil_id}
                          </p>
                          <p className="text-sm text-black">Name: {assessSubs[assessIndex].pupil?.full_name ?? "—"}</p>
                          <p className="text-sm text-black">
                            Submitted: {new Date(assessSubs[assessIndex].submitted_at).toLocaleString()}
                          </p>
                        </div>
                        {assessSubs[assessIndex].grade && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {assessSubs[assessIndex].grade}/100
                          </Badge>
                        )}
                      </div>

                      {assessSubs[assessIndex].file_url && (
                        <div className="mb-4">
                          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto bg-transparent">
                            <a href={assessSubs[assessIndex].file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              View Submitted File
                            </a>
                          </Button>
                        </div>
                      )}

                      {assessSubs[assessIndex].text_submission && (
                        <div className="mb-4 p-3 bg-gray-200 rounded-lg border border-border">
                          <Label className="text-sm font-medium mb-2 block">Text Submission:</Label>
                          <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
                            {assessSubs[assessIndex].text_submission}
                          </pre>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`grade-assess-${assessSubs[assessIndex].id}`}>Grade (0-100)</Label>
                          <Input
                            id={`grade-assess-${assessSubs[assessIndex].id}`}
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Grade"
                            value={grading[assessSubs[assessIndex].id]?.grade || assessSubs[assessIndex].grade || ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleGradeChange(assessSubs[assessIndex].id, "grade", e.target.value)
                            }
                            className="bg-input border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feedback-assess-${assessSubs[assessIndex].id}`}>Feedback</Label>
                          <Textarea
                            id={`feedback-assess-${assessSubs[assessIndex].id}`}
                            placeholder="Provide feedback to the pupil"
                            value={
                              grading[assessSubs[assessIndex].id]?.feedback || assessSubs[assessIndex].feedback || ""
                            }
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              handleGradeChange(assessSubs[assessIndex].id, "feedback", e.target.value)
                            }
                            className="bg-input border-border"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Button
                          onClick={handleAssessSubmit}
                          className="flex items-center justify-center gap-2"
                          size="sm"
                        >
                          <Star className="h-4 w-4" />
                          Submit Grade
                        </Button>
                        <Button onClick={closeAssessModal} variant="outline" size="sm">
                          Close
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal (shared) */}
      <ConfirmModal
        open={confirmOpen}
        title="Confirm Delete"
        description="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
