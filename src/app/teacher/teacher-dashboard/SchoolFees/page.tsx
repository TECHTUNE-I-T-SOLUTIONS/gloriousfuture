"use client"

import { useEffect, useState } from "react"
import CustomAlert from "@/components/CustomAlert"
import ConfirmModal from "@/components/ConfirmModal"

type ClassItem = { id: string; name: string }
type Fee = { id: string; class: string; amount: number; session: string; term1_amount?: number | null; term2_amount?: number | null; term3_amount?: number | null }

// payload types for API requests
type SchoolFeesCreatePayload = {
  class_ids: string[]
  session: string
  amount?: number
  term1_amount?: number | null
  term2_amount?: number | null
  term3_amount?: number | null
}

type SchoolFeesUpdatePayload = {
  id: string
  session: string
  amount?: number
  term1_amount?: number | null
  term2_amount?: number | null
  term3_amount?: number | null
}

export default function TeacherSchoolFees() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [amount, setAmount] = useState<string>("")
  const [term1Amount, setTerm1Amount] = useState<string>("")
  const [term2Amount, setTerm2Amount] = useState<string>("")
  const [term3Amount, setTerm3Amount] = useState<string>("")
  const [session, setSession] = useState<string>("2024/2025")
  const [fees, setFees] = useState<Fee[]>([])
  const [currentSessionActive, setCurrentSessionActive] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [editing, setEditing] = useState<Fee | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)
  const sessions = [
    "2024/2025",
    "2025/2026",
    "2026/2027",
    "2027/2028",
    "2028/2029",
    "2029/2030",
    "2030/2031",
  ]

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/teacher/classes', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setClasses(data as ClassItem[])
        }
      } catch (err) { console.error(err) }
    }
    fetchClasses()
    fetchFees()
    fetchCurrentSession()
  }, [])

  const fetchCurrentSession = async () => {
    try {
      const res = await fetch('/api/teacher/school-session')
      if (res.ok) {
        const b = await res.json()
        if (b && b.success && b.data) setCurrentSessionActive(b.data.session || null)
      }
    } catch (err) { console.error(err) }
  }

  const setActiveSession = async (s: string) => {
    try {
      const res = await fetch('/api/teacher/school-session', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session: s }) })
      if (res.ok) {
        setCurrentSessionActive(s)
      }
    } catch (err) { console.error(err) }
  }

  const fetchFees = async () => {
    try {
      const res = await fetch('/api/teacher/school-fees', { credentials: 'include' })
      if (res.ok) {
        const body = await res.json()
        if (body && body.success) setFees(body.data || [])
      }
    } catch (err) { console.error(err) }
  }

  const toggleClass = (id: string) => {
    setSelectedClasses((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  const submit = async () => {
    if (selectedClasses.length === 0) return setToast({ message: 'Choose class(es)', type: 'error' })
    try {
      const payload: SchoolFeesCreatePayload = { class_ids: selectedClasses, session }
      if (term1Amount || term2Amount || term3Amount) {
        payload.term1_amount = term1Amount ? Number(term1Amount) : 0
        payload.term2_amount = term2Amount ? Number(term2Amount) : 0
        payload.term3_amount = term3Amount ? Number(term3Amount) : 0
      } else if (amount) {
        payload.amount = Number(amount)
      }
      const res = await fetch('/api/teacher/school-fees', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body && body.success) {
        setToast({ message: 'Saved', type: 'success' })
        setAmount('')
        setTerm1Amount('')
        setTerm2Amount('')
        setTerm3Amount('')
        setSelectedClasses([])
        await fetchFees()
      } else {
        setToast({ message: 'Failed: ' + (body?.error || 'unknown'), type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Failed', type: 'error' }) }
  }

  const handleDelete = async (id: string) => {
    // open confirmation modal
    setConfirmTarget(id)
    setConfirmOpen(true)
  }

  const doDelete = async () => {
    if (!confirmTarget) return
    try {
      const res = await fetch(`/api/teacher/school-fees?id=${confirmTarget}`, { method: 'DELETE', credentials: 'include' })
      const b = await res.json().catch(() => ({}))
      if (res.ok && b && b.success) {
        setToast({ message: 'Deleted', type: 'success' })
        await fetchFees()
      } else {
        setToast({ message: 'Delete failed', type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Delete failed', type: 'error' }) }
    finally {
      setConfirmOpen(false)
      setConfirmTarget(null)
    }
  }

  const saveEdit = async () => {
    if (!editing) return
    try {
      const payload: SchoolFeesUpdatePayload = { id: editing.id, session }
      if (term1Amount || term2Amount || term3Amount) {
        payload.term1_amount = term1Amount ? Number(term1Amount) : 0
        payload.term2_amount = term2Amount ? Number(term2Amount) : 0
        payload.term3_amount = term3Amount ? Number(term3Amount) : 0
      } else if (amount) {
        payload.amount = Number(amount)
      }
      const res = await fetch('/api/teacher/school-fees', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const b = await res.json().catch(() => ({}))
      if (res.ok && b && b.success) {
        setToast({ message: 'Updated', type: 'success' })
        setEditing(null)
        setAmount('')
        setTerm1Amount('')
        setTerm2Amount('')
        setTerm3Amount('')
        await fetchFees()
      } else {
        setToast({ message: 'Update failed', type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Update failed', type: 'error' }) }
  }

  return (
    <div>
      {toast && <CustomAlert message={toast.message} type={toast.type === 'success' ? 'success' : 'error'} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold mb-4">School Fees</h1>
      <div className="mb-4 flex items-center space-x-4">
        <label className="text-sm">Active Session</label>
        <select aria-label="Active session" value={currentSessionActive || session} onChange={e => setActiveSession(e.target.value)} className="border rounded p-2">
          {sessions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="text-sm text-gray-500">Current: {currentSessionActive || 'not set'}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Set Fees</h2>
            <div className="mb-2">
              <label className="block text-sm">Classes</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {classes.map(c => (
                  <label key={c.id} className="flex items-center space-x-2">
                    <input type="checkbox" checked={selectedClasses.includes(c.id)} onChange={() => toggleClass(c.id)} />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-sm">Term 1 Amount</label>
                <input className="border rounded p-2 w-full" value={term1Amount} onChange={e => setTerm1Amount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm">Term 2 Amount</label>
                <input className="border rounded p-2 w-full" value={term2Amount} onChange={e => setTerm2Amount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm">Term 3 Amount</label>
                <input className="border rounded p-2 w-full" value={term3Amount} onChange={e => setTerm3Amount(e.target.value)} placeholder="0.00" />
              </div>
            </div>
                <div className="mb-2">
                    <label className="block text-sm">Session</label>
                    <select aria-label="Select session" value={session} onChange={e => setSession(e.target.value)} className="border rounded p-2 w-full">
                      {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    {!editing ? (
                      <button onClick={submit} className="px-4 py-2 bg-primary text-white rounded">Create Fee</button>
                    ) : (
                      <button onClick={saveEdit} className="px-4 py-2 bg-emerald-600 text-white rounded">Update Fee</button>
                    )}
                  </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Existing Fees</h2>
            <div className="p-4 border rounded">
              <div className="space-y-2">
                {fees.length === 0 && <p className="text-sm text-muted">No fees yet</p>}
                {fees.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{f.class}</p>
                      <div className="text-sm text-muted">{f.session}</div>
                      {f.term1_amount || f.term2_amount || f.term3_amount ? (
                        <div className="mt-1 space-y-1 text-sm">
                          <div>Term1: ₦{f.term1_amount ? Number(f.term1_amount).toFixed(2) : '0.00'}</div>
                          <div>Term2: ₦{f.term2_amount ? Number(f.term2_amount).toFixed(2) : '0.00'}</div>
                          <div>Term3: ₦{f.term3_amount ? Number(f.term3_amount).toFixed(2) : '0.00'}</div>
                        </div>
                      ) : (
                        <div className="text-sm">₦{Number(f.amount).toFixed(2)}</div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button onClick={() => { setEditing(f); setAmount(String(f.amount)); setSession(f.session); setTerm1Amount(f.term1_amount ? String(f.term1_amount) : ''); setTerm2Amount(f.term2_amount ? String(f.term2_amount) : ''); setTerm3Amount(f.term3_amount ? String(f.term3_amount) : '') }} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => handleDelete(f.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Fee"
        description="Are you sure you want to delete this fee entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={doDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null) }}
      />
    </div>
  )
}
