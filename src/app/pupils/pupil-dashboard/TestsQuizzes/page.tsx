"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/CustomLoader";
import { FaClipboardList } from "react-icons/fa";

export default function TestsQuizzes() {
  const [tests, setTests] = useState<{ title: string; subject: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/api/tests-quizzes");
        if (res.ok) {
          const data = await res.json();
          setTests(data);
        }
      } catch (error) {
        console.error("Error fetching tests/quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaClipboardList className="mr-2 text-orange-500" /> Tests & Quizzes
      </h1>

      {loading ? <Loader /> : (
        tests.length > 0 ? (
          <ul className="space-y-4">
            {tests.map((test, index) => (
              <li key={index} className="p-4 bg-white rounded-md shadow-md border">
                <h2 className="font-bold text-lg">{test.title}</h2>
                <p className="text-gray-600">{test.subject} - Date: {test.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tests or quizzes available.</p>
        )
      )}
    </div>
  );
}
