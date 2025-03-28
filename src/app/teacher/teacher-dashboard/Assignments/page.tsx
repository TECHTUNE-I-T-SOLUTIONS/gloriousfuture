"use client";

import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  questions: string[];
}

interface Submission {
  id: string;
  assignment_id: string;
  pupil_id: string;
  submitted_at: string;
  file_url?: string;
  text_submission?: string;
  grade?: number;
  feedback?: string;
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<{ [key: string]: { grade: string; feedback: string } }>({});

  // State for new assignment form
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newQuestions, setNewQuestions] = useState<string[]>([""]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/teacher/assignments");
        if (res.ok) {
          const data = await res.json();
          setAssignments(data.assignments);
          setSubmissions(data.submissions);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleGradeChange = (submissionId: string, field: "grade" | "feedback", value: string) => {
    setGrading((prev) => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], [field]: value },
    }));
  };

  const submitGrade = async (submissionId: string) => {
    const { grade, feedback } = grading[submissionId];

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId, grade, feedback }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === submissionId ? { ...sub, grade, feedback } : sub))
        );
        alert("Grade submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting grade:", error);
    }
  };

  // Handle adding new questions
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[index] = value;
    setNewQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setNewQuestions([...newQuestions, ""]);
  };

  const createAssignment = async () => {
    if (!newTitle || !newDueDate || newQuestions.some((q) => q.trim() === "")) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, dueDate: newDueDate, questions: newQuestions }),
      });

      if (res.ok) {
        const newAssignment = await res.json();
        setAssignments([...assignments, newAssignment]);
        setNewTitle("");
        setNewDueDate("");
        setNewQuestions([""]);
        alert("Assignment created successfully!");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Assignments</h2>

      {/* Create Assignment Form */}
      <div className="p-4 bg-gray-50 rounded-md shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-3">Create New Assignment</h3>
        <input
          type="text"
          placeholder="Assignment Title"
          className="w-full p-2 border rounded-md mb-2"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded-md mb-2"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        
        <h4 className="text-md font-semibold mt-3">Questions:</h4>
        {newQuestions.map((question, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Question ${index + 1}`}
            className="w-full p-2 border rounded-md mb-2"
            value={question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
          />
        ))}
        <button className="bg-gray-500 text-white px-3 py-1 rounded-md mb-2" onClick={addQuestion}>
          Add Question
        </button>

        <button className="w-full bg-blue-500 text-white p-2 rounded-md" onClick={createAssignment}>
          Create Assignment
        </button>
      </div>

      {/* Display Assignments */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment.id} className="p-4 bg-gray-100 rounded-md shadow-sm mb-4">
            <h3 className="text-lg font-bold">{assignment.title}</h3>
            <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>

            <h4 className="mt-3 font-semibold">Submitted Assignments</h4>
            <ul className="space-y-2">
              {submissions
                .filter((sub) => sub.assignment_id === assignment.id)
                .map((sub) => (
                  <li key={sub.id} className="p-3 bg-white rounded-md shadow-sm border">
                    <p className="text-sm text-gray-700">Pupil ID: {sub.pupil_id}</p>
                    <p className="text-xs text-gray-500">Submitted: {new Date(sub.submitted_at).toLocaleString()}</p>

                    {sub.file_url && (
                      <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        View Submitted File
                      </a>
                    )}

                    {sub.text_submission && (
                      <pre className="p-2 mt-2 bg-gray-50 rounded-md border">{sub.text_submission}</pre>
                    )}

                    <div className="mt-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Grade"
                        className="p-2 border rounded-md mr-2"
                        value={grading[sub.id]?.grade || ""}
                        onChange={(e) => handleGradeChange(sub.id, "grade", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Feedback"
                        className="p-2 border rounded-md"
                        value={grading[sub.id]?.feedback || ""}
                        onChange={(e) => handleGradeChange(sub.id, "feedback", e.target.value)}
                      />
                      <button
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => submitGrade(sub.id)}
                      >
                        Submit Grade
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
