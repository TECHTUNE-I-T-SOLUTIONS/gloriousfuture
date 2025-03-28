"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaBookOpen, FaUpload, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  description: string;
  submission_text?: string;
  submission_file?: string;
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/pupils/assignments");
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleOpenAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText(assignment.submission_text || "");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;

    const formData = new FormData();
    formData.append("assignment_id", selectedAssignment.id);
    formData.append("submission_text", submissionText);
    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("/api/pupils/assignments/submit", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Assignment submitted successfully!");
        setSelectedAssignment(null);
        setFile(null);
        setSubmissionText("");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  return (
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
              <p className="text-gray-600">{assignment.subject} - Due: {assignment.due_date}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No assignments available.</p>
      )}

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-3/4">
            <h2 className="text-xl font-semibold">{selectedAssignment.title}</h2>
            <p className="text-gray-600">{selectedAssignment.description}</p>

            {/* Rich Text Editor */}
            <div className="mt-4">
              <ReactQuill value={submissionText} onChange={setSubmissionText} />
            </div>

            {/* File Upload */}
            <div className="mt-4">
              <input type="file" onChange={handleFileChange} className="border p-2 w-full rounded-md" />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex space-x-2">
              <button onClick={handleSubmitAssignment} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
                <FaSave className="mr-2" /> Submit
              </button>
              <button onClick={() => setSelectedAssignment(null)} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center">
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
