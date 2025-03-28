"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "next-auth/react"; // ✅ Use getSession() instead of useSession()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TeacherAlert() {
  const [session, setSession] = useState<any>(null); // ✅ Store session manually
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  // ✅ Fetch session manually from API
  useEffect(() => {
    async function fetchSession() {
      const userSession = await getSession();
      setSession(userSession);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    console.log("Session Data:", session); // Debugging
    async function fetchTeacherId() {
      if (session?.user?.uin) {
        const { data, error } = await supabase
          .from("teachers")
          .select("id")
          .eq("uin", session.user.uin)
          .single();

        if (error) {
          console.error("Error fetching teacher ID:", error.message);
          return;
        }
        setTeacherId(data?.id || null);
      }
    }

    fetchTeacherId();
  }, [session]);

  useEffect(() => {
    async function fetchAlerts() {
      if (teacherId) {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .eq("teacher_id", teacherId);

        if (error) {
          console.error("Error fetching alerts:", error.message);
          return;
        }
        setAlerts(data || []);
      }
    }

    fetchAlerts();
  }, [teacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;

    const alertData = { teacher_id: teacherId, message, start_time: startTime, end_time: endTime };

    if (editing && editId) {
      await fetch("/api/alerts", { method: "PUT", body: JSON.stringify({ id: editId, ...alertData }) });
    } else {
      await fetch("/api/alerts", { method: "POST", body: JSON.stringify(alertData) });
    }

    setEditing(false);
    setEditId(null);
    setMessage("");
    setStartTime("");
    setEndTime("");

    setAlerts((prev) => [...prev, { id: Date.now(), ...alertData }]); // Update UI without reload
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/alerts", { method: "DELETE", body: JSON.stringify({ id }) });
    setAlerts((prev) => prev.filter((alert) => alert.id !== id)); // Update UI without reload
  };

  const handleEdit = (alert: any) => {
    setEditing(true);
    setEditId(alert.id);
    setMessage(alert.message);
    setStartTime(alert.start_time);
    setEndTime(alert.end_time);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Manage Alerts</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
        <textarea
          placeholder="Alert Message"
          className="w-full p-2 border rounded mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <label className="block mb-2">Start Time:</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mb-4"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <label className="block mb-2">End Time:</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mb-4"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editing ? "Update Alert" : "Create Alert"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white p-4 rounded shadow-md">
              <p className="text-lg">{alert.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(alert.start_time).toLocaleString()} - {new Date(alert.end_time).toLocaleString()}
              </p>
              <div className="mt-4 flex gap-3">
                <button className="text-blue-500" onClick={() => handleEdit(alert)}>
                  <FaEdit />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(alert.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
