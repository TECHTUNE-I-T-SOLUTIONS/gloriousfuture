"use client"

import { useEffect, useState } from 'react'
import CustomAlert from '@/components/CustomAlert'

type Payment = {
  id: string
  pupil_id?: string | null
  user_id?: string | null
  email?: string | null
  class?: string | null
  uin?: string | null
  profile_picture?: string | null
  amount?: number | null
  payment_reference?: string | null
  status?: string | null
  payment_method?: string | null
  term?: string | null
  session?: string | null
  paid_at?: string | null
  created_at?: string | null
}

export default function TeacherPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selected, setSelected] = useState<Payment|null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success'|'error' } | null>(null)

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/teacher/payments', { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
        if (b && b.success) setPayments(b.data || [])
      }
    } catch (err) { console.error(err) }
  }

  const view = async (id: string) => {
    try {
      const res = await fetch(`/api/teacher/payments?id=${id}`, { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
        if (b && b.success) setSelected(b.data)
      }
    } catch (err) { console.error(err) }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/teacher/payments', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
      const b = await res.json().catch(() => ({}))
      if (res.ok && b && b.success) {
        setToast({ message: 'Updated', type: 'success' })
        setSelected(null)
        await fetchPayments()
      } else {
        setToast({ message: 'Update failed', type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Update failed', type: 'error' }) }
  }

  return (
    <div>
      {toast && <CustomAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold mb-4">Payments</h1>

      <div className="grid gap-3">
        {payments.map(p => (
          <div key={p.id} className="border p-3 rounded flex items-center justify-between">
            <div className="truncate">
              <p className="font-medium">{p.payment_reference || p.uin || p.email}</p>
              <p className="text-sm text-muted">{p.class} — ₦{p.amount ? Number(p.amount).toFixed(2) : '0.00'}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => view(p.id)} className="px-3 py-1 bg-primary text-white rounded">View</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <button onClick={() => setSelected(null)} className="text-muted">Close</button>
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(selected).map(([k,v]) => (
                <div key={k} className="flex justify-between"><span className="text-sm text-muted capitalize">{k.replace('_',' ')}</span><span className="font-medium">{String(v)}</span></div>
              ))}
            </div>
            <div className="mt-4 flex space-x-2">
              {selected.status !== 'paid' && <button onClick={() => updateStatus(selected.id, 'paid')} className="px-4 py-2 bg-green-600 text-white rounded">Mark as Received</button>}
              <button onClick={() => updateStatus(selected.id, 'disputed')} className="px-4 py-2 bg-red-600 text-white rounded">Mark Disputed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

