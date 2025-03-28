"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/CustomLoader";
import { FaLaptopCode } from "react-icons/fa";

export default function CBTExams() {
  const [exams, setExams] = useState<{ id: string; title: string; subject: string; duration: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/pupils/cbt-exams");
        if (res.ok) {
          const data = await res.json();
          setExams(data);
        }
      } catch (error) {
        console.error("Error fetching CBT exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const confirmExamStart = (exam: any) => {
    setSelectedExam(exam);
  };

  const startExam = () => {
    if (selectedExam) {
      sessionStorage.setItem("activeExam", JSON.stringify(selectedExam));
      window.location.href = "/pupil-dashboard/mainCBTExams";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaLaptopCode className="mr-2 text-red-500" /> CBT Exams
      </h1>

      {loading ? <Loader /> : (
        exams.length > 0 ? (
          <ul className="space-y-4">
            {exams.map((exam) => (
              <li key={exam.id} className="p-4 bg-white rounded-md shadow-md border">
                <h2 className="font-bold text-lg">{exam.title}</h2>
                <p className="text-gray-600">{exam.subject} - {exam.date}</p>
                <button onClick={() => confirmExamStart(exam)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                  Take Exam
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No CBT exams available.</p>
        )
      )}

      {selectedExam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{selectedExam.title}</h2>
            <p>Subject: {selectedExam.subject}</p>
            <p>Duration: {selectedExam.duration} minutes</p>
            <p>Are you sure you want to start?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedExam(null)} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={startExam} className="bg-green-500 text-white px-4 py-2 rounded">Start Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
