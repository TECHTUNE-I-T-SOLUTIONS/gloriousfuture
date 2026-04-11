"use client"

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Question {
  id?: string
  text: string
  type: "multiple_choice" | "true_false" | "free_coding" | "code_completion"
  options?: string[]
  correct_answer?: number | string
  explanation?: string
  code_template?: string
  expected_output?: string
}

interface Assessment {
  id?: string
  lesson_id?: string
  title: string
  description: string
  assessment_type: "multiple_choice" | "code_completion" | "free_coding" | "true_false" | "matching"
  passing_score: number
  max_score: number
  questions: Question[]
}

interface AssessmentEditorProps {
  lessons: any[]
  selectedLesson: any | null
  onSave: (assessment: Assessment) => Promise<void>
}

export default function AssessmentEditor({ lessons, selectedLesson, onSave }: AssessmentEditorProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [assessment, setAssessment] = useState<Assessment>({
    title: "",
    description: "",
    assessment_type: "multiple_choice",
    passing_score: 70,
    max_score: 100,
    questions: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answer: 0,
    explanation: "",
  })

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert("Question text is required")
      return
    }

    if (currentQuestion.type === "multiple_choice") {
      if (currentQuestion.options?.some((o) => !o.trim())) {
        alert("All options must be filled")
        return
      }
    }

    const newQuestion: Question = {
      ...currentQuestion,
      id: `q-${Date.now()}`,
    }

    setAssessment({
      ...assessment,
      questions: [...assessment.questions, newQuestion],
    })

    setCurrentQuestion({
      text: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: 0,
      explanation: "",
    })
  }

  const removeQuestion = (index: number) => {
    setAssessment({
      ...assessment,
      questions: assessment.questions.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!assessment.title.trim()) {
      alert("Assessment title is required")
      return
    }

    if (assessment.questions.length === 0) {
      alert("Add at least one question")
      return
    }

    await onSave({
      ...assessment,
      lesson_id: selectedLesson?.id,
    })

    setAssessment({
      title: "",
      description: "",
      assessment_type: "multiple_choice",
      passing_score: 70,
      max_score: 100,
      questions: [],
    })
    setShowCreate(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assessments</CardTitle>
            <CardDescription>{selectedLesson?.title || "Select a lesson with assessment"}</CardDescription>
          </div>
          {selectedLesson?.has_assessment && (
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1 bg-purple-600 hover:bg-purple-700">
              <Plus size={16} />
              Create Assessment
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedLesson?.has_assessment ? (
          <p className="text-gray-500 text-sm text-center py-4">Select a lesson with assessment enabled to create one</p>
        ) : showCreate ? (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold">Create Assessment</h4>

            <div>
              <Label htmlFor="ass-title" className="text-xs">
                Assessment Title *
              </Label>
              <Input
                id="ass-title"
                placeholder="e.g., Variables Quiz"
                value={assessment.title}
                onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ass-desc" className="text-xs">
                Description
              </Label>
              <Textarea
                id="ass-desc"
                placeholder="What is this assessment about?"
                value={assessment.description}
                onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ass-type" className="text-xs">
                  Assessment Type
                </Label>
                <Select value={assessment.assessment_type} onValueChange={(value: any) => setAssessment({ ...assessment, assessment_type: value })}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="code_completion">Code Completion</SelectItem>
                    <SelectItem value="free_coding">Free Coding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="passing-score" className="text-xs">
                  Passing Score (%)
                </Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="0"
                  max="100"
                  value={assessment.passing_score}
                  onChange={(e) => setAssessment({ ...assessment, passing_score: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Question Builder */}
            <div className="border-t pt-4">
              <h5 className="font-semibold text-sm mb-3">Add Questions</h5>

              <div className="space-y-3 p-3 bg-white rounded-lg border border-purple-200">
                <div>
                  <Label htmlFor="q-text" className="text-xs">
                    Question Text *
                  </Label>
                  <Textarea
                    id="q-text"
                    placeholder="What is the question?"
                    value={currentQuestion.text}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="q-type" className="text-xs">
                    Question Type
                  </Label>
                  <Select value={currentQuestion.type} onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, type: value, options: value === "true_false" ? ["True", "False"] : currentQuestion.options })}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="free_coding">Free Coding</SelectItem>
                      <SelectItem value="code_completion">Code Completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(currentQuestion.type === "multiple_choice" || currentQuestion.type === "true_false") && (
                  <div>
                    <Label className="text-xs">Options</Label>
                    <div className="space-y-2">
                      {currentQuestion.options?.map((option, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            placeholder={`Option ${i + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(currentQuestion.options || [])]
                              newOptions[i] = e.target.value
                              setCurrentQuestion({ ...currentQuestion, options: newOptions })
                            }}
                            disabled={currentQuestion.type === "true_false"}
                          />
                          <input
                            type="radio"
                            name="correct"
                            checked={currentQuestion.correct_answer === i}
                            onChange={() => setCurrentQuestion({ ...currentQuestion, correct_answer: i })}
                            className="w-4"
                            title="Mark as correct answer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(currentQuestion.type === "code_completion" || currentQuestion.type === "free_coding") && (
                  <div>
                    <Label htmlFor="code-template" className="text-xs">
                      Code Template
                    </Label>
                    <Textarea
                      id="code-template"
                      placeholder="function() { ... }"
                      value={currentQuestion.code_template || ""}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, code_template: e.target.value })}
                      rows={2}
                      className="font-mono text-xs"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="explanation" className="text-xs">
                    Explanation
                  </Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain the correct answer"
                    value={currentQuestion.explanation || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                    rows={2}
                  />
                </div>

                <Button size="sm" onClick={addQuestion} className="w-full bg-blue-600">
                  <Plus size={16} className="mr-1" />
                  Add Question
                </Button>
              </div>

              {/* Questions List */}
              {assessment.questions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-semibold text-sm">Questions ({assessment.questions.length})</p>
                  {assessment.questions.map((q, i) => (
                    <div key={q.id} className="p-2 bg-gray-50 rounded border flex items-center justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}>
                        <p className="font-medium text-sm">Q{i + 1}: {q.text.substring(0, 50)}...</p>
                        <p className="text-xs text-gray-500">{q.type}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeQuestion(i)}
                        className="text-red-600 h-7 w-7 p-0"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t pt-4">
              <Button size="sm" onClick={handleSave} className="bg-purple-600">
                Save Assessment
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No assessment created yet</p>
        )}
      </CardContent>
    </Card>
  )
}
