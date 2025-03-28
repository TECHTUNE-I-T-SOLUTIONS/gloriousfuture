"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainCBTExams() {
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    
    const storedExam = sessionStorage.getItem("activeExam");
    if (!storedExam) {
      router.push("/pupil-dashboard/CBTExams");
      return;
    }

    const examData = JSON.parse(storedExam);
    setExam(examData);
    setTimeLeft(examData.duration * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const submitExam = async () => {
    await fetch("/api/pupils/submit-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId: exam.id, answers }),
    });

    sessionStorage.removeItem("activeExam");
    router.push("/pupil-dashboard/CBTExams");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg h-screen">
      <h2 className="text-xl font-semibold">{exam?.title}</h2>
      <p>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</p>

      {exam?.questions?.map((q: any, index: number) => (
        <div key={index} className="mt-4 p-4 border rounded">
          <p className="font-semibold">{q.question}</p>
          {q.options.map((option: string, optIndex: number) => (
            <label key={optIndex} className="block">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                onChange={() => handleAnswerChange(index, option)}
              /> {option}
            </label>
          ))}
        </div>
      ))}

      <button onClick={submitExam} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Submit Exam
      </button>
    </div>
  );
}
