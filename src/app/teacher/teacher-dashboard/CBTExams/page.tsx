"use client";
import { useState, useEffect } from "react";
import CustomAlert from "@/components/CustomAlert";
import CBTExamModal from "@/components/CBTExamModal";

interface ClassInfo {
  id: string;
  name: string;
}

interface Exam {
  id: string;
  exam_title: string;
  subject: string;
  class_id: string;
  teacher_id: string;
  questions: any[];
}

export default function TeacherCBTExams() {
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);


  // Fetch session to get teacher ID
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (session?.user?.uin) {
          const teacherRes = await fetch(`/api/teacher/get-teacher-id?uin=${session.user.uin}`);
          const teacherData = await teacherRes.json();
          if (teacherData?.teacher_id) setTeacherId(teacherData.teacher_id);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setAlert({ message: "Error fetching session.", type: "error" });
      }
    };

    fetchSession();
  }, []);

  // Fetch list of classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/teacher/classes");
        const data = await response.json();
        if (Array.isArray(data)) setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setAlert({ message: "Error fetching classes.", type: "error" });
      }
    };

    fetchClasses();
  }, []);

  // Fetch exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/teacher/cbt-exams");
        const data = await response.json();
        if (Array.isArray(data)) setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = value;
    }
    setQuestions(updatedQuestions);
  };

  const createExam = async () => {
    if (!teacherId) {
      setAlert({ message: "Teacher ID not found!", type: "error" });
      return;
    }

    const response = await fetch("/api/teacher/cbt-exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examTitle, subject, classId, teacherId, questions }),
    });

    const result = await response.json();
    if (result.success) {
      setAlert({ message: "Exam created successfully!", type: "success" });
      setExams([...exams, result.data]);
    } else {
      setAlert({ message: "Error creating exam.", type: "error" });
    }
  };

  // delete exam and save exam
  const handleDelete = async (examId: string) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    const response = await fetch(`/api/teacher/cbt-exams?id=${examId}`, { method: "DELETE" });
    const result = await response.json();

    if (result.success) {
      setExams(exams.filter((exam) => exam.id !== examId));
      setAlert({ message: "Exam deleted successfully!", type: "success" });
    } else {
      setAlert({ message: "Error deleting exam.", type: "error" });
    }
  };

  const handleModify = (exam: Exam) => {
    setSelectedExam(exam);
  };

  const handleSaveExam = async (updatedExam: Exam) => {
    const response = await fetch("/api/teacher/cbt-exams", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExam),
    });

    const result = await response.json();
    if (result.success) {
      setExams(exams.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam)));
      setAlert({ message: "Exam updated successfully!", type: "success" });
      setSelectedExam(null);
    } else {
      setAlert({ message: "Error updating exam.", type: "error" });
    }
  };


  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Show Alert */}
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <h2 className="text-xl font-semibold text-gray-700">CBT Exams Management</h2>

      <div className="mt-4">
        <input type="text" placeholder="Exam Title" className="border p-2 w-full" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
        <input type="text" placeholder="Subject" className="border p-2 w-full mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} />

        <select className="border p-2 w-full mt-2" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select a Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      <h3 className="mt-4 text-lg font-semibold">Questions</h3>
      {questions.map((q, index) => (
        <div key={index} className="mt-2 p-2 border rounded">
          <input type="text" placeholder="Question" className="border p-2 w-full" value={q.question} onChange={(e) => handleQuestionChange(index, "question", e.target.value)} />
          {q.options.map((option, optIndex) => (
            <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} className="border p-2 w-full mt-1" value={option} onChange={(e) => handleQuestionChange(index, `option${optIndex}`, e.target.value)} />
          ))}
          <input type="text" placeholder="Correct Answer" className="border p-2 w-full mt-1" value={q.correctAnswer} onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)} />
        </div>
      ))}
      <button onClick={addQuestion} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Add Question</button>
      <button onClick={createExam} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Create Exam</button>

      <h3 className="mt-6 text-lg font-semibold">Created Exams</h3>
      <ul>
        {exams.map((exam) => {
          const classInfo = classes.find((cls) => cls.id === exam.class_id);
          return (
            <li key={exam.id} className="p-2 border mt-2">
              <strong>{exam.exam_title}</strong> ({exam.subject}) - Class: {classInfo ? classInfo.name : "Unknown"}
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleModify(exam)} className="bg-yellow-500 text-white px-3 py-1 rounded">Modify</button>
                <button onClick={() => handleDelete(exam.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          );
        })}
      </ul>

      {selectedExam && <CBTExamModal exam={selectedExam} onClose={() => setSelectedExam(null)} onSave={handleSaveExam} />}      
    </div>
  );
}
