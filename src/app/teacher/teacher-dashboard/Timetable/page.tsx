"use client";

import { useEffect, useState } from "react";

interface TimetableEntry {
  id: string;
  subject: string;
  day: string;
  time: string;
}

export default function TeacherTimetable() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({ subject: "", day: "", time: "" });

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch("/api/teacher/timetable");
        if (!res.ok) throw new Error("Failed to fetch timetable");

        const data = await res.json();

        if (Array.isArray(data)) {
          setTimetable(data);
        } else {
          setTimetable([]);
        }
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addTimetableEntry = async () => {
    if (!newEntry.subject || !newEntry.day || !newEntry.time) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/teacher/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        const savedEntry = await res.json();
        setTimetable((prev) => [...prev, savedEntry]);
        setNewEntry({ subject: "", day: "", time: "" }); // Reset form
      } else {
        throw new Error("Failed to add entry");
      }
    } catch (error) {
      console.error("Error adding timetable entry:", error);
      alert("Failed to add timetable entry.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Timetable</h2>

      {/* Timetable Form */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-3">Add New Timetable Entry</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={newEntry.subject}
            onChange={handleInputChange}
            className="p-2 border rounded-md"
          />
          <select name="day" value={newEntry.day} onChange={handleInputChange} className="p-2 border rounded-md">
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
          <input
            type="time"
            name="time"
            value={newEntry.time}
            onChange={handleInputChange}
            className="p-2 border rounded-md"
          />
        </div>
        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={addTimetableEntry}
        >
          Add Entry
        </button>
      </div>

      {/* Display Timetable */}
      {loading ? (
        <p className="text-gray-500">Loading timetable...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : timetable.length === 0 ? (
        <p className="text-gray-500">No timetable available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Day</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry) => (
              <tr key={entry.id} className="bg-white">
                <td className="border p-2">{entry.subject}</td>
                <td className="border p-2">{entry.day}</td>
                <td className="border p-2">{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
