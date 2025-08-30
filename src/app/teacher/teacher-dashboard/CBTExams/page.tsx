"use client"

import React, { useEffect, useState } from "react";
import { FileText, Plus, Trash2, Save, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CustomAlert from "@/components/CustomAlert";

type ClassInfo = { id: string; name: string };
type Question = { question: string; options: { a: string; b: string; c: string; d: string }; correctAnswer: string };
type Exam = { id: string; exam_title: string; subject: string; class_id: string; teacher_id: string | null; questions: Question[]; created_at?: string; status?: "draft" | "published" | "completed"; duration?: number | null };

export default function TeacherCBTExams(): React.ReactElement {
  const [examTitle, setExamTitle] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [teacherId, setTeacherId] = useState<string>("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([{ question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "" }]);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [classesRes, examsRes, sessionRes] = await Promise.all([
          fetch("/api/teacher/classes", { credentials: "include" }),
          fetch("/api/teacher/cbt-exams", { credentials: "include" }),
          fetch("/api/auth/session", { credentials: "include" }),
        ]);

        const classesData = await classesRes.json();
        const examsData = await examsRes.json();
        const sessionData = await sessionRes.json();

        if (Array.isArray(classesData)) setClasses(classesData);
        if (Array.isArray(examsData)) setExams(examsData);

        // session API returns { session: { uin, role, user } }
        const sessionUin = sessionData?.session?.uin ?? sessionData?.session?.user?.uin;
        if (sessionUin) {
          const teacherRes = await fetch(`/api/teacher/get-teacher-id?uin=${sessionUin}`);
          const t = await teacherRes.json();
          if (t?.teacher_id) setTeacherId(t.teacher_id);
        }
      } catch (err) {
        console.error(err);
        setAlert({ message: "Error fetching data.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const addQuestion = () => setQuestions((s) => [...s, { question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "" }]);
  const removeQuestion = (i: number) => setQuestions((s) => s.filter((_, idx) => idx !== i));
  const handleQuestionChange = (index: number, field: string, value: string) => {
    setQuestions((prev) => {
      const copy = prev.map((q) => ({ ...q, options: { ...q.options } }));
      if (field === "question") copy[index].question = value;
      else if (field.startsWith("option")) {
        const key = field.replace("option", "") as keyof Question["options"];
        copy[index].options[key] = value;
      } else if (field === "correctAnswer") copy[index].correctAnswer = value;
      return copy;
    });
  };

  const createExam = async () => {
    if (!teacherId) return setAlert({ message: "Teacher not found", type: "error" });
    if (!examTitle || !subject || !classId || questions.some((q) => !q.question || Object.values(q.options).some((o) => !o) || !q.correctAnswer))
      return setAlert({ message: "Please fill all fields", type: "warning" });

    try {
      // payload keys match DB column names
      const payload = {
        exam_title: examTitle,
        subject,
        class_id: classId,
        teacher_id: teacherId,
  questions,
  // include duration if set (minutes)
  ...(duration ? { duration: parseInt(duration, 10) } : {}),
      }
      const res = await fetch("/api/teacher/cbt-exams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (j?.success) {
  // normalize server response: supabase usually returns an array of inserted rows
  const added = Array.isArray(j.data) ? j.data[0] : j.data;
  if (added) setExams((e) => [...e, added]);
        setAlert({ message: "Exam created", type: "success" });
        setShowCreateForm(false);
        setExamTitle("");
        setSubject("");
        setClassId("");
  setDuration("");
        setQuestions([{ question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "" }]);
      } else setAlert({ message: j?.message ?? "Create failed", type: "error" });
    } catch (err) {
      console.error(err);
      setAlert({ message: "Create failed", type: "error" });
    }
  };

  const openEditModal = (exam: Exam) => {
    // normalize questions if they are stored with array options
    const normalizedQuestions = exam.questions.map((q) => {
      const maybeOpts = (q as unknown as { options: unknown }).options
      if (Array.isArray(maybeOpts)) {
        const arr = maybeOpts as string[]
        return { question: q.question, options: { a: arr[0] ?? "", b: arr[1] ?? "", c: arr[2] ?? "", d: arr[3] ?? "" }, correctAnswer: q.correctAnswer }
      }
      return q
    })
  setEditingExam({ ...exam, questions: normalizedQuestions })
    setEditModalOpen(true)
  }

  const saveEdit = async () => {
    if (!editingExam) return
    if (!editingExam.exam_title || !editingExam.subject || !editingExam.class_id || editingExam.questions.some((q) => !q.question || Object.values(q.options).some((o) => !o) || !q.correctAnswer)) {
      return setAlert({ message: "Please fill all fields", type: "warning" })
    }

    try {
      const payload = {
        exam_title: editingExam.exam_title,
        subject: editingExam.subject,
        class_id: editingExam.class_id,
        teacher_id: editingExam.teacher_id,
  questions: editingExam.questions,
  duration: editingExam.duration ?? undefined,
      }
      const res = await fetch(`/api/teacher/cbt-exams?id=${editingExam.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const j = await res.json()
      if (j?.success) {
  // backend may not return the updated row; update local state with the editingExam values
  setExams((e) => e.map((ex) => (ex.id === editingExam.id ? { ...editingExam } : ex)))
        setAlert({ message: "Exam updated", type: "success" })
        setEditModalOpen(false)
        setEditingExam(null)
      } else setAlert({ message: j?.message ?? "Update failed", type: "error" })
    } catch (err) {
      console.error(err)
      setAlert({ message: "Update failed", type: "error" })
    }
  }

  const handleDelete = (id: string) => {
    // open modal
    setDeleteModalId(id);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteModalId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/teacher/cbt-exams?id=${deleteModalId}`, { method: "DELETE" });
      const j = await res.json();
      if (j?.success) setExams((e) => e.filter((x) => x.id !== deleteModalId));
      else setAlert({ message: j?.message ?? "Delete failed", type: "error" });
    } catch (err) {
      console.error(err);
      setAlert({ message: "Delete failed", type: "error" });
    } finally {
      setDeleteLoading(false);
      setDeleteModalId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  const getStatusColor = (status?: string) => {
    switch (status) { case "published": return "bg-green-100 text-green-800"; case "completed": return "bg-blue-100 text-blue-800"; case "draft": return "bg-yellow-100 text-yellow-800"; default: return "bg-gray-100 text-gray-800" }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><FileText className="h-8 w-8 text-primary" /> CBT Exams Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage computer-based tests</p>
        </div>
        <Button onClick={() => setShowCreateForm((v) => !v)} className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create Exam</Button>
      </div>

      {showCreateForm && (
        <Card className="border-border bg-card animate-fade-in-up p-4">
          <CardHeader>
            <CardTitle>Create New CBT Exam</CardTitle>
            <CardDescription>Design a comprehensive computer-based test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="examTitle">Exam Title</Label>
                <Input id="examTitle" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={classId} onValueChange={(v: string) => setClassId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 30" />
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Questions</h3>
                <Button size="sm" variant="outline" onClick={addQuestion}><Plus className="h-4 w-4" /> Add</Button>
              </div>

              {questions.map((q, idx) => (
                <Card key={idx} className="mb-3">
                  <CardContent>
                    <Label>Question {idx + 1}</Label>
                    <Input value={q.question} onChange={(e) => handleQuestionChange(idx, "question", e.target.value)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <Input value={q.options.a} onChange={(e) => handleQuestionChange(idx, `optiona`, e.target.value)} placeholder="a) Option A" />
                      <Input value={q.options.b} onChange={(e) => handleQuestionChange(idx, `optionb`, e.target.value)} placeholder="b) Option B" />
                      <Input value={q.options.c} onChange={(e) => handleQuestionChange(idx, `optionc`, e.target.value)} placeholder="c) Option C" />
                      <Input value={q.options.d} onChange={(e) => handleQuestionChange(idx, `optiond`, e.target.value)} placeholder="d) Option D" />
                    </div>
                    <Label className="mt-2">Correct Answer</Label>
                    <Select value={q.correctAnswer} onValueChange={(v: string) => handleQuestionChange(idx, "correctAnswer", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={q.options.a}>{`a) ${q.options.a}`}</SelectItem>
                        <SelectItem value={q.options.b}>{`b) ${q.options.b}`}</SelectItem>
                        <SelectItem value={q.options.c}>{`c) ${q.options.c}`}</SelectItem>
                        <SelectItem value={q.options.d}>{`d) ${q.options.d}`}</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={() => removeQuestion(idx)}><Trash2 className="h-4 w-4" /> Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={createExam} size="md" variant="default"><Save className="h-4 w-4" /> Create Exam</Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-500 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete this exam? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteModalId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirmed} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {exams.length === 0 ? (
          <Card className="border-border bg-card p-2">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No exams created yet</h3>
              <p className="text-muted-foreground mb-4">Create your first CBT exam to get started</p>
              <Button onClick={() => setShowCreateForm(true)}><Plus className="h-4 w-4 mr-2" /> Create Exam</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="border-border bg-card hover-lift p-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-card-foreground line-clamp-2">{exam.exam_title}</CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {exam.subject}</div>
                        <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Class: {classes.find((c) => c.id === exam.class_id)?.name ?? "Unknown"}</div>
                        {exam.duration ? <div className="flex items-center gap-2">⏱ {exam.duration} mins</div> : null}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(exam.status)}>{exam.status ?? "draft"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Created: {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : "-"}</span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(exam)}>Modify</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(exam.id)}>Delete</Button>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {editModalOpen && editingExam && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="max-w-2xl w-full mx-4">
            <CardHeader>
              <CardTitle>Edit Exam</CardTitle>
              <CardDescription>Modify exam details and questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Exam Title</Label>
                  <Input value={editingExam.exam_title} onChange={(e) => setEditingExam({ ...editingExam, exam_title: e.target.value })} />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={editingExam.subject} onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })} />
                </div>
                <div>
                  <Label>Class</Label>
                  <Select value={editingExam.class_id} onValueChange={(v: string) => setEditingExam({ ...editingExam, class_id: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input type="number" value={editingExam.duration ?? ""} onChange={(e) => setEditingExam({ ...editingExam, duration: e.target.value ? parseInt(e.target.value, 10) : null })} placeholder="e.g. 30" />
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                {editingExam.questions.map((q, idx) => (
                  <Card key={idx} className="mb-3">
                    <CardContent>
                      <Label>Question {idx + 1}</Label>
                      <Input value={q.question} onChange={(e) => {
                        const copy = editingExam.questions.map((x) => ({ ...x, options: { ...x.options } }))
                        copy[idx].question = e.target.value
                        setEditingExam({ ...editingExam, questions: copy })
                      }} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <Input value={q.options.a} onChange={(e) => {
                          const copy = editingExam.questions.map((x) => ({ ...x, options: { ...x.options } }))
                          copy[idx].options.a = e.target.value
                          setEditingExam({ ...editingExam, questions: copy })
                        }} placeholder="a) Option A" />
                        <Input value={q.options.b} onChange={(e) => {
                          const copy = editingExam.questions.map((x) => ({ ...x, options: { ...x.options } }))
                          copy[idx].options.b = e.target.value
                          setEditingExam({ ...editingExam, questions: copy })
                        }} placeholder="b) Option B" />
                        <Input value={q.options.c} onChange={(e) => {
                          const copy = editingExam.questions.map((x) => ({ ...x, options: { ...x.options } }))
                          copy[idx].options.c = e.target.value
                          setEditingExam({ ...editingExam, questions: copy })
                        }} placeholder="c) Option C" />
                        <Input value={q.options.d} onChange={(e) => {
                          const copy = editingExam.questions.map((x) => ({ ...x, options: { ...x.options } }))
                          copy[idx].options.d = e.target.value
                          setEditingExam({ ...editingExam, questions: copy })
                        }} placeholder="d) Option D" />
                      </div>
                      <Label className="mt-2">Correct Answer</Label>
                      <Select value={q.correctAnswer} onValueChange={(v: string) => {
                        const copy = editingExam.questions.map((x) => ({ ...x, options: { ...x.options } }))
                        copy[idx].correctAnswer = v
                        setEditingExam({ ...editingExam, questions: copy })
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={q.options.a}>{`a) ${q.options.a}`}</SelectItem>
                          <SelectItem value={q.options.b}>{`b) ${q.options.b}`}</SelectItem>
                          <SelectItem value={q.options.c}>{`c) ${q.options.c}`}</SelectItem>
                          <SelectItem value={q.options.d}>{`d) ${q.options.d}`}</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setEditModalOpen(false); setEditingExam(null) }}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
