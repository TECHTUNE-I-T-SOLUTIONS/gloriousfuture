"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function TeacherPreferencesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [prefs, setPrefs] = useState({
    email_notifications: true,
    default_dashboard_view: "dashboard",
    compact_mode: false,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/teacher/preferences", { credentials: "include" })
        if (res.ok) {
          const data = await res.json().catch(() => null)
          if (data) setPrefs((p) => ({ ...p, ...data }))
        }
      } catch (err) {
        // ignore - preferences endpoint may not exist yet
        console.debug("No preferences endpoint or failed to fetch preferences", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/teacher/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
        credentials: "include",
      })
      if (res.ok) {
        setToast({ message: "Preferences saved", type: "success" })
      } else {
        setToast({ message: "Failed to save preferences", type: "error" })
      }
    } catch (err) {
      console.error(err)
      setToast({ message: "Failed to save preferences", type: "error" })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 2500)
    }
  }

  if (loading) return <div className="p-8">Loading preferences...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Preferences</h1>
      <p className="text-sm text-muted-foreground mb-6">Customize your teacher account preferences and defaults.</p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic account and display settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="mb-1">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive email updates for messages and alerts</p>
              </div>
              <div>
                <input
                  id="email_notifications"
                  type="checkbox"
                  checked={prefs.email_notifications}
                  onChange={(e) => setPrefs((p) => ({ ...p, email_notifications: e.target.checked }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-2/3">
                <Label className="mb-1">Default Dashboard View</Label>
                <p className="text-sm text-gray-500">Choose which page you see first after login</p>
              </div>
              <div className="w-1/3">
                <select
                  className="w-full p-2 border border-border rounded-md bg-input"
                  value={prefs.default_dashboard_view}
                  onChange={(e) => setPrefs((p) => ({ ...p, default_dashboard_view: e.target.value }))}
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="assignments">Assignments</option>
                  <option value="cbt-exams">CBT Exams</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="mb-1">Compact Mode</Label>
                <p className="text-sm text-gray-500">Reduce paddings and use denser lists</p>
              </div>
              <div>
                <input
                  id="compact_mode"
                  type="checkbox"
                  checked={prefs.compact_mode}
                  onChange={(e) => setPrefs((p) => ({ ...p, compact_mode: e.target.checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset
        </Button>
        {toast && <span className={`text-sm ${toast.type === "success" ? "text-green-600" : "text-red-600"}`}>{toast.message}</span>}
      </div>
    </div>
  )
}
