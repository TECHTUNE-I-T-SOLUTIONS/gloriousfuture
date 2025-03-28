"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/CustomLoader";
import { FaFileAlt } from "react-icons/fa";

export default function ExamResults() {
  const [results, setResults] = useState<{ subject: string; score: string; grade: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/exam-results");
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Error fetching exam results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaFileAlt className="mr-2 text-purple-500" /> Exam Results
      </h1>

      {loading ? <Loader /> : (
        results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((result, index) => (
              <li key={index} className="p-4 bg-white rounded-md shadow-md border">
                <h2 className="font-bold">{result.subject}</h2>
                <p>Score: {result.score} ({result.grade})</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No results available.</p>
        )
      )}
    </div>
  );
}
