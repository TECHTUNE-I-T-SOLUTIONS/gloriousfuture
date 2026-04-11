"use client"

import { useState } from "react"
import { Plus, X, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Lesson {
  id: string
  title: string
  content: string
  video_url?: string
  code_example?: string
  code_language?: string
  estimated_duration_minutes?: number
  has_assessment: boolean
}

interface LessonEditorPanelProps {
  lessons: Lesson[]
  selectedModule: { id: string; title: string } | null
  onCreateLesson: (lesson: any) => Promise<void>
  onUpdateLesson?: (id: string, lesson: any) => Promise<void>
  onDeleteLesson: (id: string) => Promise<void>
}

export default function LessonEditorPanel({
  lessons,
  selectedModule,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson,
}: LessonEditorPanelProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    code_example: "",
    code_language: "javascript",
    estimated_duration_minutes: 15,
    has_assessment: false,
  })

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required")
      return
    }

    await onCreateLesson(formData)
    setFormData({
      title: "",
      content: "",
      video_url: "",
      code_example: "",
      code_language: "javascript",
      estimated_duration_minutes: 15,
      has_assessment: false,
    })
    setShowCreate(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>{selectedModule?.title || "Select a module"}</CardDescription>
          </div>
          {selectedModule && (
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1 bg-green-600 hover:bg-green-700">
              <Plus size={16} />
              Add Lesson
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {showCreate && selectedModule && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
            <h4 className="font-semibold text-sm">Create New Lesson</h4>

            <div>
              <Label htmlFor="lesson-title" className="text-xs">
                Lesson Title *
              </Label>
              <Input
                id="lesson-title"
                placeholder="e.g., Introduction to Variables"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="lesson-content" className="text-xs">
                Lesson Content *
              </Label>
              <Textarea
                id="lesson-content"
                placeholder="Describe what students will learn in this lesson..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="video-url" className="text-xs">
                Video URL (Optional)
              </Label>
              <Input
                id="video-url"
                placeholder="https://youtube.com/watch?v=... or video file URL"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Supports YouTube or direct video file links</p>
            </div>

            <div>
              <Label htmlFor="code-example" className="text-xs">
                Code Example (Optional)
              </Label>
              <Textarea
                id="code-example"
                placeholder="function example() { ... }"
                value={formData.code_example}
                onChange={(e) => setFormData({ ...formData, code_example: e.target.value })}
                rows={2}
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="duration" className="text-xs">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.estimated_duration_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) || 15 })}
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-xs">
                  Code Language
                </Label>
                <Select value={formData.code_language} onValueChange={(value) => setFormData({ ...formData, code_language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_assessment}
                    onChange={(e) => setFormData({ ...formData, has_assessment: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs">Has Assessment</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} className="bg-green-600 text-xs">
                Create Lesson
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCreate(false)} className="text-xs">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!selectedModule ? (
          <p className="text-gray-500 text-sm text-center py-4">Select a module to view and manage lessons</p>
        ) : lessons.length === 0 ? (
          <p className="text-gray-500 text-sm">No lessons yet. Create your first lesson!</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="font-medium text-gray-900">{lesson.title}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">{lesson.content}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {lesson.video_url && <Badge variant="secondary" className="text-xs">🎥 Video</Badge>}
                      {lesson.code_example && <Badge variant="outline" className="text-xs">💻 Code</Badge>}
                      {lesson.has_assessment && <Badge variant="secondary" className="text-xs">📝 Assessment</Badge>}
                      {lesson.estimated_duration_minutes && (
                        <Badge variant="outline" className="text-xs">
                          ⏱ {lesson.estimated_duration_minutes} min
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600">
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => onDeleteLesson(lesson.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
