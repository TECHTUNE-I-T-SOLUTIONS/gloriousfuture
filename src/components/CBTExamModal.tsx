"use client";
import { useState, useEffect } from "react";

interface Exam {
  id: string;
  exam_title: string;
  subject: string;
  class_id: string;
  questions: any[];
}

interface CBTExamModalProps {
  exam: Exam | null;
  onClose: () => void;
  onSave: (updatedExam: Exam) => void;
}

export default function CBTExamModal({ exam, onClose, onSave }: CBTExamModalProps) {
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);

  useEffect(() => {
    if (exam) {
      setExamTitle(exam.exam_title);
      setSubject(exam.subject);
      setQuestions(exam.questions);
    }
  }, [exam]);

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

  const handleSave = () => {
    if (exam) {
      onSave({ ...exam, exam_title: examTitle, subject, questions });
    }
  };

  if (!exam) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-semibold">Modify Exam</h2>
        <input type="text" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="border p-2 w-full mt-2" />

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

        <div className="flex justify-between mt-4">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
