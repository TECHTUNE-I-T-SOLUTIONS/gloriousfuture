"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/CustomLoader";
import { FaCalendarAlt } from "react-icons/fa";

export default function Timetable() {
  const [timetable, setTimetable] = useState<{ day: string; subject: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch("/api/timetable");
        if (res.ok) {
          const data = await res.json();
          setTimetable(data);
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaCalendarAlt className="mr-2 text-yellow-500" /> Timetable
      </h1>

      {loading ? <Loader /> : (
        timetable.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Day</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{entry.day}</td>
                  <td className="border p-2">{entry.subject}</td>
                  <td className="border p-2">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No timetable available.</p>
        )
      )}
    </div>
  );
}
