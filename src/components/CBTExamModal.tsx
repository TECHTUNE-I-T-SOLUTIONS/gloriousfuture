"use client";
import { useState, useEffect } from "react";

interface Question {
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
  explanation?: string;
}

interface Exam {
  id: string;
  exam_title: string;
  subject: string;
  class_id: string;
  questions: Question[];
}

interface CBTExamModalProps {
  exam: Exam | null;
  onClose: () => void;
  onSave: (updatedExam: Exam) => void;
}

export default function CBTExamModal({ exam, onClose, onSave }: CBTExamModalProps) {
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "", explanation: "" }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (exam) {
      setExamTitle(exam.exam_title);
      setSubject(exam.subject);
      setCurrentQuestionIndex(0); // Reset to first question when loading new exam

      // Parse questions if they are stored as JSON string
      let questionsData = exam.questions;
      if (typeof questionsData === 'string') {
        try {
          questionsData = JSON.parse(questionsData);
        } catch (error) {
          console.error('Failed to parse questions JSON:', error);
          questionsData = [];
        }
      }

      // Ensure questionsData is an array
      if (!Array.isArray(questionsData)) {
        console.error('Questions data is not an array:', questionsData);
        questionsData = [];
      }

      // Normalize incoming questions so options is {a, b, c, d} format
      const normalized = (questionsData as Question[]).map((q) => {
        let normalizedOptions: { a: string; b: string; c: string; d: string };

        if (Array.isArray(q.options)) {
          // Convert array format to object format
          normalizedOptions = {
            a: q.options[0] || "",
            b: q.options[1] || "",
            c: q.options[2] || "",
            d: q.options[3] || ""
          };
        } else if (typeof q.options === 'object' && q.options !== null) {
          // Ensure object has all required properties
          const opts = q.options as { a?: string; b?: string; c?: string; d?: string };
          normalizedOptions = {
            a: opts.a || "",
            b: opts.b || "",
            c: opts.c || "",
            d: opts.d || ""
          };
        } else {
          // Fallback for unexpected formats
          normalizedOptions = { a: "", b: "", c: "", d: "" };
        }

        return {
          question: q.question,
          options: normalizedOptions,
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || ""
        };
      });
      setQuestions(normalized);
    }
  }, [exam]);

  const handleQuestionChange = (field: string, value: string) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[currentQuestionIndex].question = value;
    } else if (field.startsWith("option")) {
      const optionKey = field.replace("option", "") as keyof Question["options"];
      updatedQuestions[currentQuestionIndex].options[optionKey] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[currentQuestionIndex].correctAnswer = value;
    } else if (field === "explanation") {
      updatedQuestions[currentQuestionIndex].explanation = value;
    }
    setQuestions(updatedQuestions);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSave = () => {
    if (exam) {
      onSave({ ...exam, exam_title: examTitle, subject, questions });
    }
  };

  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Modify Exam</h2>
        <div className="mt-2">
          <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
          <input
            id="examTitle"
            placeholder="Enter exam title"
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mt-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            id="subject"
            placeholder="Enter subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold">
          Questions ({currentQuestionIndex + 1} of {questions.length})
        </h3>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-2 mb-4">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`px-4 py-2 rounded ${
              currentQuestionIndex === questions.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>

        {/* Current question display */}
        {questions.length > 0 && (
          <div className="mt-2 p-4 border rounded bg-gray-50">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                placeholder="Enter the question"
                className="border p-2 w-full"
                value={questions[currentQuestionIndex].question}
                onChange={(e) => handleQuestionChange("question", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
              {(Array.isArray(questions[currentQuestionIndex].options)
                ? Object.values(questions[currentQuestionIndex].options)
                : [questions[currentQuestionIndex].options.a, questions[currentQuestionIndex].options.b, questions[currentQuestionIndex].options.c, questions[currentQuestionIndex].options.d]
              ).map((option, optIndex) => {
                const optionKeys = ['a', 'b', 'c', 'd'] as const;
                const optionKey = optionKeys[optIndex];
                return (
                  <div key={optIndex} className="mb-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Option {optionKey.toUpperCase()}</label>
                    <input
                      type="text"
                      placeholder={`Enter option ${optionKey.toUpperCase()}`}
                      className="border p-2 w-full"
                      value={option}
                      onChange={(e) => handleQuestionChange(`option${optionKey}`, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <input
                type="text"
                placeholder="Enter the correct answer (should match one of the options above)"
                className="border p-2 w-full"
                value={questions[currentQuestionIndex].correctAnswer || ""}
                onChange={(e) => handleQuestionChange("correctAnswer", e.target.value)}
              />
            </div>

            {/* Conditionally show explanation field only if it exists and has content */}
            {(questions[currentQuestionIndex].explanation ||
              (questions[currentQuestionIndex].explanation === "" &&
                questions.some((q) => q.explanation && q.explanation.trim() !== ""))) && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                <input
                  type="text"
                  placeholder="Explain why this is the correct answer (shown to pupils when they get it wrong)"
                  className="border p-2 w-full"
                  value={questions[currentQuestionIndex].explanation || ""}
                  onChange={(e) => handleQuestionChange("explanation", e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
