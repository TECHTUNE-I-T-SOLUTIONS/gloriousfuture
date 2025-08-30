"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Calendar, Plus, Clock, BookOpen, Trash2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface TimetableEntry {
  id: string
  subject: string
  day: string
  time: string
  class_id?: string | null
  class_name?: string | null
  classes?: { id: string; name: string } | null
}

// shape returned by the server
type RawTimetableEntry = {
  id: string
  subject: string
  day: string
  time: string
  class_id?: string | null
  classes?: { id: string; name: string } | null
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

export default function TeacherTimetable() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState<{ subject: string; day: string; time: string; class_id?: string | null }>({ subject: "", day: "", time: "", class_id: "" })
  const [showAddForm, setShowAddForm] = useState(false)
  // toast system
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "warning" | "info" }[]>([])

  // classes for selection
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
    const [scope, setScope] = useState<'mine' | 'all'>('mine')
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"day-time" | "subject">("day-time")
  const [filterDay, setFilterDay] = useState<string>("")
  const [allModalOpen, setAllModalOpen] = useState(false)
  const [currentClassIndex, setCurrentClassIndex] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 5

  // edit modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null)

  // delete confirm modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const addToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }

  const toggleAddForm = () => {
    if (!showAddForm) {
      setNewEntry((prev) => ({
        ...prev,
        day: prev.day || DAYS_OF_WEEK[0],
        time: prev.time || TIME_SLOTS[0],
        class_id: prev.class_id || (classes[0]?.id ?? ""),
      }))
    }
    setShowAddForm((s) => !s)
  }

  // centralized fetch so we can re-use after add/update
  // intentionally omit `classes` from deps to avoid refetch loop; classes are fetched once on mount
  /* eslint-disable react-hooks/exhaustive-deps */
  const fetchAndSetTimetable = useCallback(async (url = `/api/teacher/timetable${scope === 'all' ? '?all=1' : ''}`) => {
    try {
      setLoading(true)
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch timetable")
      const data = await res.json()
      if (Array.isArray(data)) {
        const raw = data as RawTimetableEntry[]
        const normalized: TimetableEntry[] = raw.map((d) => {
          // server often returns time as "HH:MM:SS" — normalize to "HH:MM" to match TIME_SLOTS
          const timeStr = typeof d.time === 'string' ? (d.time.length >= 5 ? d.time.slice(0,5) : d.time) : ''
          const rawDay = (d.day || "").toString().trim()
          const canonicalDay = (DAYS_OF_WEEK.find((dw) => dw.toLowerCase() === rawDay.toLowerCase()) ?? rawDay) as string
          const classNameFromPayload = d.classes?.name ?? null
          const classNameFromLookup = (classNameFromPayload || classes.find((c) => c.id === d.class_id)?.name) ?? null
          return {
            id: d.id,
            subject: d.subject,
            day: canonicalDay,
            time: timeStr,
            class_id: d.class_id ?? null,
            class_name: classNameFromLookup,
            classes: d.classes ?? null,
          }
        })
        setTimetable(normalized)
      } else {
        setTimetable([])
      }
    } catch (err) {
      console.error("Error fetching timetable:", err)
      setError("Failed to load timetable")
    } finally {
      setLoading(false)
    }
  }, [scope])

  // fetch classes once on mount; after classes load, refresh timetable so class_name lookups work
  useEffect(() => {
    let mounted = true
    const fetchClasses = async () => {
      try {
    const res = await fetch('/api/teacher/classes', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && mounted) {
            setClasses(data)
            // fetch timetable again now that classes are available for name lookup
            await fetchAndSetTimetable()
          }
        }
      } catch (err) {
        console.error('Error fetching classes:', err)
      }
    }

    fetchClasses()
    return () => {
      mounted = false
    }
  }, [fetchAndSetTimetable])

  // derived list: only show timetable for the selected class (if any)
  const filteredTimetable = timetable
  .filter((t) => (filterDay ? t.day === filterDay : true))
  .filter((t) => (searchQuery ? `${t.subject} ${t.day} ${t.time} ${t.class_name ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase()) : true))
    .filter((t) => (filterDay ? t.day === filterDay : true))
    .filter((t) => (searchQuery ? `${t.subject} ${t.day} ${t.time}`.toLowerCase().includes(searchQuery.toLowerCase()) : true))
    .sort((a, b) => {
      if (sortBy === "subject") return a.subject.localeCompare(b.subject)
      // default day-time sort
      const dayIndex = (d: string) => DAYS_OF_WEEK.indexOf(d)
      if (dayIndex(a.day) !== dayIndex(b.day)) return dayIndex(a.day) - dayIndex(b.day)
      return a.time.localeCompare(b.time)
    })

  const handleInputChange = (field: string, value: string) => {
    setNewEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addTimetableEntry = async () => {
    if (!newEntry.subject || !newEntry.day || !newEntry.time) {
      addToast("Please fill in all fields before submitting.", "warning")
      return
    }

    if (!newEntry.class_id) {
      addToast("Please select a class for this timetable entry.", "warning")
      return
    }

    // Check for conflicts
    const conflict = timetable.find((entry) => entry.day === newEntry.day && entry.time === newEntry.time)

    if (conflict) {
      addToast(`Time slot conflict! ${conflict.subject} is already scheduled for ${newEntry.day} at ${newEntry.time}`, "warning")
      return
    }

    try {
      const res = await fetch("/api/teacher/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
        credentials: "include",
      })

      if (res.ok) {
        // Re-fetch the current scope (server-side) so UI shows up-to-date entries
        await fetchAndSetTimetable()
        setNewEntry({ subject: "", day: "", time: "", class_id: "" })
        setShowAddForm(false)
        addToast("Timetable entry added.", "success")
      } else {
        const payload = await res.json().catch(() => null)
        addToast(payload?.error ?? "Failed to add entry", "error")
      }
    } catch (error) {
      console.error("Error adding timetable entry:", error)
      addToast("Failed to add timetable entry.", "error")
    }
  }

  // All-classes modal helpers
  const groupedByClass = (): { classId: string | null; className: string | null; rows: TimetableEntry[] }[] => {
    const map = new Map<string | null, TimetableEntry[]>()
    timetable.forEach((t) => {
      const key = t.class_id ?? null
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    })
    const arr: { classId: string | null; className: string | null; rows: TimetableEntry[] }[] = []
    for (const [k, v] of map.entries()) {
      arr.push({ classId: k, className: v[0]?.class_name ?? null, rows: v })
    }
    return arr
  }

  const nextClass = () => setCurrentClassIndex((i) => Math.min(i + 1, groupedByClass().length - 1))
  const prevClass = () => setCurrentClassIndex((i) => Math.max(i - 1, 0))

  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/teacher/timetable/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (res.ok) {
        setTimetable((prev) => prev.filter((entry) => entry.id !== id))
        addToast("Entry deleted.", "success")
      } else {
        addToast("Failed to delete entry.", "error")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      addToast("Error deleting entry.", "error")
    }
  }

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return
    await deleteEntry(deleteTargetId)
    setDeleteModalOpen(false)
    setDeleteTargetId(null)
  }

  const openEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry)
    setEditModalOpen(true)
  }

  const saveEdit = async () => {
    if (!editingEntry) return
    if (!editingEntry.subject || !editingEntry.day || !editingEntry.time) {
      addToast("Please fill all fields.", "warning")
      return
    }
    try {
      const res = await fetch(`/api/teacher/timetable/${editingEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEntry),
        credentials: "include",
      })
      if (res.ok) {
  // re-fetch normalized timetable so the grid matches TIME_SLOTS and canonical days
  await fetchAndSetTimetable()
  setEditModalOpen(false)
  setEditingEntry(null)
  addToast("Entry updated.", "success")
      } else {
        const payload = await res.json().catch(() => null)
        addToast(payload?.error ?? "Failed to update entry", "error")
      }
    } catch (err) {
      console.error("Error updating entry:", err)
      addToast("Failed to update entry.", "error")
    }
  }

  // grid is built directly from filteredTimetable during render

  const getSubjectColor = (subject: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ]

    const hash = subject.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    return colors[Math.abs(hash) % colors.length]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // build grid on the fly from filteredTimetable when rendering

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Toasts */}
      <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded shadow-md text-sm max-w-xs ${t.type === "success" ? "bg-green-600 text-white" : t.type === "error" ? "bg-red-600 text-white" : "bg-gray-800 text-white"}`}>
            {t.message}
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Weekly Timetable
          </h1>
          <p className="text-muted-foreground mt-2">Manage your class schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant={scope === 'mine' ? undefined : 'ghost'} onClick={() => setScope('mine')}>My class</Button>
            <Button variant={scope === 'all' ? undefined : 'ghost'} onClick={() => setScope('all')}>All</Button>
          </div>
          {/* class select removed for weekly schedule: server controls scope */}

          <div className="hidden sm:flex items-center gap-2">
            <Input placeholder="Search subject, day or time" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64" />
            <Select value={filterDay} onValueChange={(v: string) => setFilterDay(v)}>
              <SelectTrigger className="bg-input border-border w-36"><SelectValue placeholder="All days" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {DAYS_OF_WEEK.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: string) => setSortBy(v === "subject" ? "subject" : "day-time")}>
              <SelectTrigger className="bg-input border-border w-36"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day-time">Day & Time</SelectItem>
                <SelectItem value="subject">Subject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={toggleAddForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Class
          </Button>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card className="border-border bg-card animate-fade-in-up p-4">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Timetable Entry
            </CardTitle>
            <CardDescription>Schedule a new class session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject name"
                  value={newEntry.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={newEntry.class_id ?? ""} onValueChange={(value: string) => handleInputChange("class_id", value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder={classes.length ? "Select class" : "No classes"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.length === 0 ? <SelectItem value="">No classes available</SelectItem> : classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select value={newEntry.day} onValueChange={(value: string) => handleInputChange("day", value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select value={newEntry.time} onValueChange={(value: string) => handleInputChange("time", value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={addTimetableEntry} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Add Entry
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Grid */}
      <Card className="border-border bg-orange-500">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>Your complete class timetable</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div>
              {/* Mobile: stacked list */}
              <div className="md:hidden space-y-3">
                {filteredTimetable.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No timetable entries yet.</div>
                ) : (
                  filteredTimetable.map((entry) => (
                    <div key={entry.id} className="p-3 bg-background border border-border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium">{entry.subject}</div>
                        <div className="text-sm text-muted-foreground">{entry.day} • {entry.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(entry)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => openDeleteModal(entry.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop/Tablet: grid */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    <div className="p-3 bg-muted rounded-lg font-medium text-center">
                      <Clock className="h-4 w-4 mx-auto mb-1" />
                      Time
                    </div>
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="p-3 bg-muted rounded-lg font-medium text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                      <div className="p-3 bg-background border border-border rounded-lg font-medium text-center flex items-center justify-center">
                        {time}
                      </div>
                          {DAYS_OF_WEEK.map((day) => {
                            // find entry for this day/time from the filtered set
                            const entry = filteredTimetable.find((e) => e.day === day && e.time === time)
                        return (
                          <div key={`${day}-${time}`} className="min-h-[60px] border border-border rounded-lg">
                            {entry ? (
                              <div className="p-2 h-full flex flex-col justify-between">
                                <div>
                                  <Badge className={`text-xs mb-1 ${getSubjectColor(entry.subject)}`}>
                                    {entry.subject}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                  <Button onClick={() => openEditModal(entry)} size="sm" variant="ghost">Edit</Button>
                                  <Button
                                    onClick={() => openDeleteModal(entry.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2 h-full flex items-center justify-center text-muted-foreground">
                                <span className="text-xs">Free</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {timetable.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Schedule Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground">{timetable.length}</div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {new Set(timetable.map((e) => e.subject)).size}
                </div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round((timetable.length / (DAYS_OF_WEEK.length * TIME_SLOTS.length)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Schedule Filled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Edit Modal */}
      {editModalOpen && editingEntry && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Edit Timetable Entry</CardTitle>
              <CardDescription>Edit a scheduled class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input value={editingEntry.subject} onChange={(e) => setEditingEntry({ ...editingEntry, subject: e.target.value })} />
                </div>
                <div>
                  <Label>Day</Label>
                  <Select value={editingEntry.day} onValueChange={(v) => setEditingEntry({ ...editingEntry, day: v })}>
                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time</Label>
                  <Select value={editingEntry.time} onValueChange={(v) => setEditingEntry({ ...editingEntry, time: v })}>
                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Class</Label>
                  <Select value={editingEntry.class_id ?? ""} onValueChange={(v) => setEditingEntry({ ...editingEntry, class_id: v })}>
                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {classes.length === 0 ? <SelectItem value="">No classes available</SelectItem> : classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setEditModalOpen(false); setEditingEntry(null) }}>Cancel</Button>
                  <Button onClick={saveEdit}>Save</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <Card className="max-w-sm w-full mx-4">
            <CardHeader>
              <CardTitle>Confirm Delete</CardTitle>
              <CardDescription>Are you sure you want to delete this timetable entry? This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </CardContent>
          </Card>
        </div>
      )}
      {/* All classes modal (paginated by class) */}
      {allModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-4xl overflow-auto">
            <CardHeader>
              <CardTitle>All Timetables</CardTitle>
              <CardDescription>Browse timetables for all classes created by you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium">{groupedByClass()[currentClassIndex]?.className ?? 'Unknown class'}</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => { prevClass(); setPage(0) }}>Previous</Button>
                  <Button variant="outline" onClick={() => { nextClass(); setPage(0) }}>Next</Button>
                  <Button onClick={() => setAllModalOpen(false)} variant="ghost">Close</Button>
                </div>
              </div>

              <div className="space-y-3">
                {(() => {
                  const group = groupedByClass()[currentClassIndex]
                  if (!group) return <div className="text-center py-8">No timetables</div>
                  const start = page * pageSize
                  const rows = group.rows.slice(start, start + pageSize)
                  return (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rows.map((r) => (
                          <div key={r.id} className="p-3 bg-background border border-border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{r.subject}</div>
                                <div className="text-sm text-muted-foreground">{r.day} • {r.time}</div>
                                <div className="text-xs text-muted-foreground">Class: {r.class_name}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" onClick={() => openEditModal(r)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => openDeleteModal(r.id)}>Delete</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          Page {page + 1} of {Math.max(1, Math.ceil(group.rows.length / pageSize))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</Button>
                          <Button variant="outline" onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(group.rows.length / pageSize) - 1))} disabled={page >= Math.ceil(group.rows.length / pageSize) - 1}>Next</Button>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
{
  /* Modals rendered outside the main return content */
}
// Timetable modals are rendered inline in the page. The separate TimetableModals helper
// was removed to avoid exporting components from a page module (Next.js App Router typegen).
