"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

interface TestQuiz {
  id?: string;
  title: string;
  description: string;
  due_date: string;
  class_id: string;
}

export default function TeacherTestsQuizzes() {
  const [tests, setTests] = useState<TestQuiz[]>([]);
  const [newTest, setNewTest] = useState<TestQuiz>({
    title: "",
    description: "",
    due_date: "",
    class_id: "",
  });
  const [editingTest, setEditingTest] = useState<TestQuiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/api/teacher/tests-quizzes");
        if (res.ok) {
          const data = await res.json();
          setTests(Array.isArray(data) ? data : []);
        } else {
          setTests([]);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingTest) {
      setEditingTest((prev) => (prev ? { ...prev, [name]: value } : null));
    } else {
      setNewTest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/teacher/tests-quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTest),
      });

      if (res.ok) {
        const createdTest = await res.json();
        setTests((prev) => [...prev, createdTest]);
        setNewTest({ title: "", description: "", due_date: "", class_id: "" });
      }
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingTest || !editingTest.id) return;

    try {
      const res = await fetch(`/api/teacher/tests-quizzes/${editingTest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTest),
      });

      if (res.ok) {
        setTests((prev) => prev.map((t) => (t.id === editingTest.id ? editingTest : t)));
        setEditingTest(null);
      }
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this test?")) return;

    try {
      const res = await fetch(`/api/teacher/tests-quizzes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTests((prev) => prev.filter((test) => test.id !== id));
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">Tests & Quizzes</h2>
      <p className="text-gray-600 mt-2">Create, manage, and evaluate quizzes.</p>

      {/* Form for creating/editing tests */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">{editingTest ? "Edit Test/Quiz" : "Create Test/Quiz"}</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={editingTest ? editingTest.title : newTest.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editingTest ? editingTest.description : newTest.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="date"
          name="due_date"
          value={editingTest ? editingTest.due_date : newTest.due_date}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="text"
          name="class_id"
          placeholder="Class ID"
          value={editingTest ? editingTest.class_id : newTest.class_id}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <div className="flex space-x-2">
          {editingTest ? (
            <>
              <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
                <FaSave className="mr-2" /> Update
              </button>
              <button onClick={() => setEditingTest(null)} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center">
                <FaTimes className="mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <FaPlus className="mr-2" /> Add Test/Quiz
            </button>
          )}
        </div>
      </div>

      {/* List of tests */}
      {loading ? (
        <p className="mt-4 text-gray-500">Loading tests...</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {tests.map((test) => (
            <li key={test.id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{test.title}</h4>
                <p className="text-gray-600">{test.description}</p>
                <p className="text-gray-500">Due: {test.due_date}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingTest(test)} className="bg-yellow-500 text-white px-3 py-2 rounded">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(test.id)} className="bg-red-500 text-white px-3 py-2 rounded">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
