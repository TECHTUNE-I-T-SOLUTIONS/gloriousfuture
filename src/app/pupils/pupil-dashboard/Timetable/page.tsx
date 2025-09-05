"use client"

import { useEffect, useRef, useState } from "react"
import Loader from "@/components/CustomLoader"
import { FaCalendarAlt, FaDownload } from "react-icons/fa"

type TimetableEntry = { day: string; subject: string; time: string; class?: string; class_id?: string }

export default function Timetable() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [pupilClass, setPupilClass] = useState<string | null>(null)
  const [classesMap, setClassesMap] = useState<Record<string, string>>({})
  const tableRef = useRef<HTMLDivElement | null>(null)

  // fetch pupil details once
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const det = await fetch('/api/pupils/details?self=1', { credentials: 'include' })
        if (!mounted) return
        if (det.ok) {
          const d = await det.json()
          setPupilClass(d.class || d.class_name || null)
        }
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const r = await fetch('/api/teacher/classes')
        if (!mounted) return
        if (r.ok) {
          const arr = await r.json()
          const map: Record<string, string> = {}
          if (Array.isArray(arr)) arr.forEach((c: { id: string; name: string }) => { if (c && c.id) map[c.id] = c.name })
          setClassesMap(map)
        }
      } catch {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  // fetch timetable when pupilClass is available (or fetch generic if null)
  useEffect(() => {
    let mounted = true
    const fetchTimetable = async () => {
      try {
        const classParam = (pupilClass && pupilClass.length) ? `?class=${encodeURIComponent(pupilClass)}` : ''
        const res = await fetch(`/api/timetable${classParam}`, { credentials: 'include' })
        let data: TimetableEntry[] = []
        if (res.ok) data = await res.json()

        // map timetable entries that use class_id to class text using classesMap
        if (data && data.length > 0) {
          data = data.map((e) => {
            if (e.class_id && classesMap && classesMap[e.class_id]) {
              return { ...e, class: classesMap[e.class_id] }
            }
            return e
          })

          if (pupilClass) {
            const hasClassField = data.some((e) => typeof e.class === 'string')
            if (hasClassField) data = data.filter((e) => (e.class && e.class === pupilClass))
          }
        }

        if ((!data || data.length === 0) && classParam) {
          const r2 = await fetch('/api/timetable', { credentials: 'include' })
          if (r2.ok) data = await r2.json()
          // map and filter the same way for the fallback
          data = data.map((e) => {
            if (e.class_id && classesMap && classesMap[e.class_id]) return { ...e, class: classesMap[e.class_id] }
            return e
          })
          if (pupilClass) {
            const hasClassField = data.some((e) => typeof e.class === 'string')
            if (hasClassField) data = data.filter((e) => (e.class && e.class === pupilClass))
          }
        }

        if (mounted) setTimetable(data || [])
      } catch (error) {
        console.error('Error fetching timetable:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchTimetable()
    return () => { mounted = false }
  }, [pupilClass, classesMap])

  // download as PDF (uses html2canvas dynamically)
  const handleDownload = async () => {
    // Try server-side PDF first (high-fidelity). Fallback to client capture if server fails.
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: window.location.href })
      })
      if (!res.ok) throw new Error('Server PDF failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'timetable.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      return
    } catch (err) {
      console.warn('Server PDF failed, falling back to client capture', err)
    }

    // fallback: previous html2canvas-based capture
    try {
      const html2canvas = (await import('html2canvas')).default
      const el = tableRef.current
      if (!el) return
      const canvas = await html2canvas(el, { scale: 2 })
      const dataUrl = canvas.toDataURL('image/png')
      const w = window.open('about:blank')
      if (!w) return
      w.document.write(`<img src="${dataUrl}" style="width:100%"/>`)
      w.document.close()
    } catch (err) {
      console.error('Client capture failed', err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaCalendarAlt className="mr-2 text-yellow-500" /> Timetable
      </h1>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Your Class Timetable{pupilClass ? ` — ${pupilClass}` : ''}</h2>
        <div>
          <button onClick={handleDownload} className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white rounded">
            <FaDownload /> Download PDF
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : timetable.length > 0 ? (
        <div ref={tableRef}>
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
        </div>
      ) : (
        <p className="text-gray-500">No timetable available.</p>
      )}
    </div>
  )
}
