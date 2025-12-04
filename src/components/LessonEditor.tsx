"use client"

import { useState } from "react"
import { X, Plus, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface TutorialStep {
  title: string
  description: string
  code_snippet?: string
  explanation?: string
}

interface LessonEditorProps {
  lessonId?: string
  initialData?: {
    title?: string
    content?: string
    video_url?: string
    tutorial_steps?: TutorialStep[]
    starter_code?: string
    expected_output?: string
    language?: string
  } | null
  onSave: (data: Record<string, unknown>) => Promise<void>
  onCancel: () => void
}

export default function LessonEditor({ lessonId, initialData, onSave, onCancel }: LessonEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || "")
  const [language, setLanguage] = useState(initialData?.language || "javascript")
  const [starterCode, setStarterCode] = useState(initialData?.starter_code || "")
  const [expectedOutput, setExpectedOutput] = useState(initialData?.expected_output || "")
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>(initialData?.tutorial_steps || [])
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addStep = () => {
    const newStep: TutorialStep = {
      title: `Step ${tutorialSteps.length + 1}`,
      description: "",
      code_snippet: "",
      explanation: "",
    }
    setTutorialSteps([...tutorialSteps, newStep])
    setExpandedSteps([...expandedSteps, tutorialSteps.length])
  }

  const duplicateStep = (index: number) => {
    const step = tutorialSteps[index]
    const newStep = { ...step }
    const newSteps = [...tutorialSteps.slice(0, index + 1), newStep, ...tutorialSteps.slice(index + 1)]
    setTutorialSteps(newSteps)
  }

  const removeStep = (index: number) => {
    setTutorialSteps(tutorialSteps.filter((_, i) => i !== index))
    setExpandedSteps(expandedSteps.filter((i) => i !== index))
  }

  const updateStep = (index: number, field: keyof TutorialStep, value: string) => {
    const newSteps = [...tutorialSteps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setTutorialSteps(newSteps)
  }

  const toggleStepExpand = (index: number) => {
    setExpandedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Lesson title is required")
      return
    }
    if (!content.trim()) {
      setError("Lesson content is required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave({
        lessonId,
        title,
        content,
        video_url: videoUrl || null,
        tutorial_steps: tutorialSteps.length > 0 ? tutorialSteps : null,
        starter_code: starterCode || null,
        expected_output: expectedOutput || null,
        language,
      })
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {lessonId ? "Edit Lesson" : "Create New Lesson"}
          </h2>
          <p className="text-gray-600 mt-1">
            {lessonId ? "Update lesson content, video, and tutorials" : "Create a comprehensive programming lesson"}
          </p>
        </div>
        <Button onClick={onCancel} variant="outline" className="gap-2">
          <X size={18} />
          Close
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Lesson title and content description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to JavaScript Functions"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Content (HTML/Text) *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed lesson explanation and notes..."
              className="w-full min-h-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle>Video Content</CardTitle>
          <CardDescription>
            Upload a video or link to YouTube/Vimeo. Max 50MB for uploads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video URL or Link</label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://storage.../video.mp4 OR https://youtube.com/watch?v=... OR https://vimeo.com/..."
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supports: Direct MP4 links, YouTube links, Vimeo links, WebM, OGG
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Code Practice Section */}
      <Card>
        <CardHeader>
          <CardTitle>Code Practice Setup</CardTitle>
          <CardDescription>
            Provide starter code and expected output for practice exercises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-2">Programming Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Starter Code</label>
            <Textarea
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              placeholder="Pre-filled code for students to modify..."
              className="w-full min-h-24 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Expected Output</label>
            <Textarea
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Expected output when code is executed correctly"
              className="w-full min-h-20 font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Steps */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Step-by-Step Tutorial</CardTitle>
            <CardDescription>
              Break down the lesson into manageable steps with code examples
            </CardDescription>
          </div>
          <Button onClick={addStep} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus size={18} />
            Add Step
          </Button>
        </CardHeader>
        <CardContent>
          {tutorialSteps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No steps yet. Click &quot;Add Step&quot; to create the first one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  {/* Step Header */}
                  <button
                    onClick={() => toggleStepExpand(index)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {expandedSteps.includes(index) ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronUp size={18} />
                      )}
                      <span className="font-semibold text-gray-900">
                        Step {index + 1}: {step.title || "Untitled"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateStep(index)
                        }}
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                      >
                        <Copy size={16} />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeStep(index)
                        }}
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </button>

                  {/* Step Content */}
                  {expandedSteps.includes(index) && (
                    <div className="px-4 py-4 space-y-4 bg-white border-t">
                      <div>
                        <label className="block text-sm font-medium mb-2">Step Title</label>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(index, "title", e.target.value)}
                          placeholder={`Step ${index + 1} title`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(index, "description", e.target.value)}
                          placeholder="What will students learn in this step?"
                          className="min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Code Snippet (Optional)</label>
                        <Textarea
                          value={step.code_snippet || ""}
                          onChange={(e) => updateStep(index, "code_snippet", e.target.value)}
                          placeholder="Example code for this step..."
                          className="font-mono text-sm min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Pro Tip / Explanation (Optional)</label>
                        <Textarea
                          value={step.explanation || ""}
                          onChange={(e) => updateStep(index, "explanation", e.target.value)}
                          placeholder="Additional insights or common pitfalls..."
                          className="min-h-16"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Lesson"}
        </Button>
      </div>
    </div>
  )
}
