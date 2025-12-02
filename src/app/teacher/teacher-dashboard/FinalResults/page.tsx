"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinalResultsPage() {
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [loading, setLoading] = useState(false)
  type SubjectResult = { assignment_avg?: number | null; test_avg?: number | null; exam_avg?: number | null; assignment_max?: number | null; test_max?: number | null; exam_max?: number | null; weighted_total?: number | null; grade?: string }
  type FinalResult = { pupil_id?: string; pupil_name?: string; average?: number; grade?: string; results?: Record<string, SubjectResult>; id?: string; created_at?: string }
  const [results, setResults] = useState<FinalResult[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/teacher/classes', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          // server returns array of classes
          setClasses(data || [])
        }
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  const generate = async () => {
    if (!selectedClass) return setMessage('Please select a class')
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/teacher/final-results/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ classId: selectedClass }),
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage(json?.error || 'Failed to generate results')
      } else {
        setResults(json?.data || [])
        setMessage('Final results generated')
      }
    } catch (err) {
      console.error(err)
      setMessage('Error generating results')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Final Results</h1>
        <p className="text-sm text-muted-foreground">Generate final results per class and review grades.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Final Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="class">Class</Label>
              <select id="class" aria-label="Class" className="w-full p-2 border border-border rounded-md bg-input" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex gap-3">
              <Button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate Final Results'}</Button>
              <Button variant="outline" onClick={() => { setSelectedClass(''); setResults([]); setMessage(null) }}>Reset</Button>
            </div>
          </div>

          {message && <div className="mt-4 text-sm text-muted-foreground">{message}</div>}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Generated Reports</h2>
        {results.length === 0 ? (
          <div className="text-sm text-muted-foreground">No reports yet. Generate results for a class to see them here.</div>
        ) : (
          <div className="space-y-4">
            {results.map((r: FinalResult) => (
              <Card key={r.pupil_id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.pupil_name || r.pupil_id}</div>
                    <div className="text-sm text-muted-foreground">Average: {r.average?.toFixed?.(2) ?? 'N/A'} — Grade: {r.grade}</div>
                  </div>
                  <div>
                    <a className="text-sm text-primary" href={`/api/teacher/final-results/pdf?pupilId=${r.pupil_id}&classId=${selectedClass}`} target="_blank" rel="noreferrer">Download PDF</a>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(r.results || {}).map(([subject, info]) => {
                    const s = info as SubjectResult
                    return (
                      <div key={subject} className="bg-muted p-3 rounded-md">
                        <div className="font-medium text-sm">{subject}</div>
                        <div className="text-xs text-muted-foreground">Exam Avg: {s?.exam_avg ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Test Avg: {s?.test_avg ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Assignment Avg: {s?.assignment_avg ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Weighted: {s?.weighted_total ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Grade: {s?.grade ?? '—'}</div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
