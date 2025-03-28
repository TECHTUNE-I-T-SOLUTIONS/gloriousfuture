"use client";

import { useEffect, useState } from "react";

interface ExamResult {
  id: string;
  student: string;
  subject: string;
  score: number;
}

export default function TeacherExamResults() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/teacher/exam-results");
        if (!res.ok) throw new Error("Failed to fetch results");

        const data = await res.json();

        // Ensure `data` is an array before updating state
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]); // Set an empty array if data is not an array
        }
      } catch (error) {
        console.error("Error fetching exam results:", error);
        setError("Failed to load exam results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Exam Results</h2>

      {loading ? (
        <p className="text-gray-500">Loading exam results...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No exam results available.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((result) => (
            <li key={result.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
              <p className="text-lg font-bold">{result.student} - {result.subject}</p>
              <span className="text-sm text-gray-600">Score: {result.score}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
