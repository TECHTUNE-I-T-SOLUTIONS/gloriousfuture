"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Session } from "next-auth"
import { FaTrash, FaEdit, FaPlus, FaBell, FaClock, FaCalendarAlt } from "react-icons/fa"
import { getSupabaseClient } from "@/lib/supabase"
import { getSession } from "next-auth/react"

const supabase = getSupabaseClient()

export default function TeacherAlert() {
  const [session, setSession] = useState<Session | null>(null)
  type Alert = {
    id: string | number
    teacher_id: string
    message: string
    start_time: string
    end_time: string
  }
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [message, setMessage] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [allClasses, setAllClasses] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null)
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [teacherId, setTeacherId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSession() {
      const userSession = await getSession()
      setSession(userSession)
    }
    fetchSession()
  }, [])

  useEffect(() => {
    console.log("Session Data:", session) // Debugging
    type UserWithUIN = { uin?: string }
    async function fetchTeacherId() {
      const uin = (session?.user as UserWithUIN)?.uin
      if (uin) {
        if (!supabase) {
          console.error("Supabase not configured")
          return
        }
        const { data, error } = await supabase.from("teachers").select("id").eq("uin", uin).single()

        if (error) {
          console.error("Error fetching teacher ID:", String(error))
          return
        }
        setTeacherId(data?.id || null)
      }
    }

    fetchTeacherId()
  }, [session])

  useEffect(() => {
    async function fetchAlerts() {
      if (teacherId) {
        if (!supabase) {
          console.error("Supabase not configured")
          return
        }
        const { data, error } = await supabase.from("alerts").select("*").eq("teacher_id", teacherId)

        if (error) {
          console.error("Error fetching alerts:", String(error))
          return
        }
        setAlerts(data || [])
      }
    }

    fetchAlerts()
  }, [teacherId])

  useEffect(() => {
    // fetch classes list for checkbox selection
    ;(async () => {
      try {
        if (!supabase) {
          console.error('Supabase not configured')
          return
        }
        const { data } = await supabase.from('classes').select('id, name')
        setClasses(data || [])
      } catch (err) {
        console.error('Failed to fetch classes', err)
      }
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherId) return

  setLoading(true)
  type AlertPayload = {
    teacher_id: string
    message: string
    start_time: string
    end_time: string
    class_ids?: string[]
    all_classes?: boolean
  }
  const alertData: AlertPayload = { teacher_id: teacherId, message, start_time: startTime, end_time: endTime }
  if (allClasses) alertData.all_classes = true
  else alertData.class_ids = selectedClassIds

    try {
        if (editing && editId) {
        await fetch("/api/alerts", { method: "PUT", body: JSON.stringify({ id: editId, ...alertData }), credentials: "include" })
      } else {
        await fetch("/api/alerts", { method: "POST", body: JSON.stringify(alertData), credentials: "include" })
      }

      setEditing(false)
      setEditId(null)
      setMessage("")
      setStartTime("")
      setEndTime("")
  setAlerts((prev) => [...prev, { id: Date.now(), ...alertData }])
  setToast({ message: 'Alert created successfully', type: 'success' })
    } catch (error) {
      console.error("Error submitting alert:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    try {
      const idStr = String(id)
  await fetch("/api/alerts", { method: "DELETE", body: JSON.stringify({ id: idStr }), credentials: "include" })
      setAlerts((prev) => prev.filter((alert) => String(alert.id) !== idStr))
    } catch (error) {
      console.error("Error deleting alert:", error)
    }
  }

  const handleEdit = (alert: Alert) => {
    setEditing(true)
    setEditId(alert.id)
    setMessage(alert.message)
    setStartTime(alert.start_time)
    setEndTime(alert.end_time)
  }

  const cancelEdit = () => {
    setEditing(false)
    setEditId(null)
    setMessage("")
    setStartTime("")
    setEndTime("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <FaBell className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 text-balance">Alert Management</h1>
              <p className="text-slate-600 mt-1">Create and manage school alerts for students and parents</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaPlus className="text-sm" />
                  {editing ? "Edit Alert" : "Create New Alert"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alert Message</label>
                  <textarea
                    placeholder="Enter your alert message here..."
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-32"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Target Classes</label>
                    <div className="flex flex-col space-y-2 max-h-40 overflow-auto p-2 border rounded">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={allClasses} onChange={(e) => { setAllClasses(e.target.checked); if (e.target.checked) setSelectedClassIds([]) }} />
                        <span className="text-sm">All Classes</span>
                      </label>
                      {classes.map((c) => (
                        <label key={c.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedClassIds.includes(c.id)}
                            onChange={(e) => {
                              const next = e.target.checked ? [...selectedClassIds, c.id] : selectedClassIds.filter((id) => id !== c.id)
                              setSelectedClassIds(next)
                              if (next.length > 0) setAllClasses(false)
                            }}
                            aria-label={`Class ${c.name}`}
                          />
                          <span className="text-sm">{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {/* Preview panel */}
                  <div className="w-full p-4 bg-slate-50 rounded border border-slate-200">
                    <h4 className="font-semibold mb-2">Preview</h4>
                    <p className="text-sm text-slate-800 mb-2">{message || "(No message yet)"}</p>
                    <p className="text-xs text-slate-500">Target: {allClasses ? "All Classes" : (selectedClassIds.length ? selectedClassIds.map(id => classes.find(c=>c.id===id)?.name).filter(Boolean).join(', ') : 'None selected')}</p>
                    <p className="text-xs text-slate-500">From: {startTime || '—'} To: {endTime || '—'}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : editing ? "Update Alert" : "Create Alert"}
                  </button>

                  {editing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Active Alerts</h2>
              <p className="text-slate-600">Manage your published alerts</p>
            </div>

            {alerts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FaBell className="text-slate-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Alerts Yet</h3>
                <p className="text-slate-600">Create your first alert to notify students and parents</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaBell className="text-blue-600" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(alert)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit Alert"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(alert.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete Alert"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-800 font-medium mb-4 leading-relaxed">{alert.message}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-green-500" />
                          <span>Start: {new Date(alert.start_time).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaClock className="text-red-500" />
                          <span>End: {new Date(alert.end_time).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Alert ID: {alert.id}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(alert.end_time) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {new Date(alert.end_time) > new Date() ? "Active" : "Expired"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
