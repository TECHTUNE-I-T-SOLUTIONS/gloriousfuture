"use client"

import type React from "react"

import { useEffect, useState } from "react"
import CustomAlert from "@/components/CustomAlert"
import { FaBookOpen, FaSave, FaTimes } from "react-icons/fa"

interface Assignment {
  id: string
  title: string
  subject: string
  due_date: string
  description: string
  submission_text?: string | null
  submission_file?: string | null
  submitted?: boolean
  submitted_at?: string
  grade?: number | null
  feedback?: string | null
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionText, setSubmissionText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/pupils/assignments")
        if (res.ok) {
          const data = await res.json()
          setAssignments(data)
        }
      } catch (error) {
        console.error("Error fetching assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const handleOpenAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
  setSubmissionText(assignment.submission_text || "")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return

    const formData = new FormData()
    formData.append("assignment_id", selectedAssignment.id)
    formData.append("submission_text", submissionText)
    if (file) {
      formData.append("file", file)
    }

    try {
      const res = await fetch("/api/pupils/assignments/submit", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setToast({ message: "Assignment submitted successfully!", type: "success" })
        const payload = await res.json()
        // optimistic update: mark assignment as submitted and attach submission info
        setAssignments((prev) =>
          prev.map((a) => {
            if (a.id !== selectedAssignment.id) return a
            return {
              ...a,
              submitted: true,
              submission_text: submissionText || null,
              submission_file: payload?.submission?.file_url ?? null,
              submitted_at: payload?.submission?.submitted_at ?? new Date().toISOString(),
            }
          }),
        )
        setSelectedAssignment(null)
        setFile(null)
        setSubmissionText("")
      }
    } catch (error) {
      console.error("Error submitting assignment:", error)
    }
  }

  const formatDescription = (description: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(description)
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-800">Assignment Questions:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              {parsed.questions.map((question: string, index: number) => (
                <li key={index} className="text-gray-700">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )
      }
      return <p className="text-gray-700">{description}</p>
    } catch {
      // If not JSON, display as regular text
      return <p className="text-gray-700">{description}</p>
    }
  }

  return (
    <>
      {toast && <CustomAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4 flex items-center">
          <FaBookOpen className="mr-2 text-green-500" /> Assignments
        </h1>

        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length > 0 ? (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="p-4 bg-white rounded-md shadow-md border cursor-pointer"
                onClick={() => handleOpenAssignment(assignment)}
              >
                <h2 className="font-bold text-lg">{assignment.title}</h2>
                <p className="text-gray-600">
                  {assignment.subject} - Due: {assignment.due_date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}

        {/* Assignment Submission Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h2>
                <p className="text-sm text-gray-500">Due: {selectedAssignment.due_date}</p>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">{formatDescription(selectedAssignment.description)}</div>
              </div>

              <div className="p-6 space-y-6">
                {/* Submission editor */}
                <div>
                  <label htmlFor="submission_text" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Submission
                  </label>
                  <textarea
                    id="submission_text"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Write your assignment submission here..."
                  />
                </div>

                {/* File upload and existing submission info */}
                <div>
                  <label htmlFor="submission_file" className="block text-sm font-medium text-gray-700 mb-2">
                    Attach File (Optional)
                  </label>

                  <input
                    id="submission_file"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />

                  {selectedAssignment.submitted && (
                    <div className="mt-4 bg-white border border-green-100 rounded-md p-4">
                      <p className="text-sm font-medium text-green-700">You have submitted this assignment.</p>
                      {selectedAssignment.submission_file && (
                        <p className="mt-2">
                          <a href={selectedAssignment.submission_file} target="_blank" rel="noreferrer" className="text-green-600 underline">
                            View submitted file
                          </a>
                        </p>
                      )}
                      {selectedAssignment.grade != null && <p className="mt-2 text-sm text-gray-700">Grade: {selectedAssignment.grade}%</p>}
                      {selectedAssignment.feedback && (
                        <div className="mt-2 text-sm text-gray-700">
                          <p className="font-medium">Teacher Feedback:</p>
                          <p>{selectedAssignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                  <button onClick={handleSubmitAssignment} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium shadow-sm">
                    <FaSave className="mr-2" /> Submit Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
