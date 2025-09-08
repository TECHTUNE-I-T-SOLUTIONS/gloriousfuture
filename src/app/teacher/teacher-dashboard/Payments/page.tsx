"use client"

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import CustomAlert from '@/components/CustomAlert'

type Payment = {
  id: string
  pupil_id?: string | null
  pupil_name?: string | null
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
  terms?: string[] | null
  session?: string | null
  paid_at?: string | null
  created_at?: string | null
}

type Dispute = { id: string; payment_id: string; pupil_id?: string | null; uin?: string | null; reason: string; details?: string | null; status?: string | null; created_at?: string }
type Reply = { id: string; dispute_id: string; author_role: string; author_id?: string | null; message: string; created_at?: string }

export default function TeacherPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selected, setSelected] = useState<Payment|null>(null)
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false)
  const [markPaidRef, setMarkPaidRef] = useState<string>('')
  const [markPaidMethod, setMarkPaidMethod] = useState<string>('cash')
  const [markPaidAt, setMarkPaidAt] = useState<string>('')
  const [filterClass, setFilterClass] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const perPage = 6
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [toast, setToast] = useState<{ message: string; type: 'success'|'error' } | null>(null)
  const [pupils, setPupils] = useState<Array<{ id: string; name?: string; profile_picture?: string; uin?: string; email?: string }>>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pupilsPage, setPupilsPage] = useState(1)
  const [reportPupil, setReportPupil] = useState<{ id: string; name: string } | null>(null)
  const [cashAmount, setCashAmount] = useState<string>('')
  const [showDisputesModal, setShowDisputesModal] = useState(false)
  const [disputesForPayment, setDisputesForPayment] = useState<Dispute[]>([])
  const [currentDispute, setCurrentDispute] = useState<Dispute | null>(null)
  const [replyMessage, setReplyMessage] = useState<string>('')
  const [replies, setReplies] = useState<Reply[]>([])
  const [unresolvedCount, setUnresolvedCount] = useState<number>(0)

  const fetchPayments = useCallback(async (page = 1) => {
    try {
      const qs = new URLSearchParams()
      if (filterClass) qs.set('class', filterClass)
      if (filterStatus) qs.set('status', filterStatus)
      if (searchTerm) qs.set('q', searchTerm)
      qs.set('includePupil', '1')
      qs.set('page', String(page))
      qs.set('perPage', String(perPage))
      const res = await fetch(`/api/teacher/payments?${qs.toString()}`, { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
        if (b && b.success) {
          setPayments(b.data || [])
          if (b.meta && typeof b.meta.total === 'number') {
            setTotalRecords(b.meta.total)
          }
        }
      }
    } catch (err) { console.error(err) }
  }, [filterClass, filterStatus, searchTerm, perPage])

  const fetchPupils = useCallback(async (page = 1) => {
    try {
      const res = await fetch(`/api/teacher/pupils?page=${page}&perPage=10`, { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
  const list = b.data || []
  if (!Array.isArray(list) || list.length === 0) console.warn('teacher pupils: empty result or no data', b)
  setPupils(list)
      }
    } catch (err) { console.error(err) }
  }, [])

  useEffect(() => { fetchPayments() }, [fetchPayments])
  useEffect(() => { fetchPupils(pupilsPage) }, [fetchPupils, pupilsPage])
  useEffect(() => { fetchUnresolvedCount() }, [])

  const fetchUnresolvedCount = async () => {
    try {
      const res = await fetch('/api/pupils/payments/disputes', { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
  const list: Dispute[] = b.disputes || []
  const cnt = Array.isArray(list) ? list.filter((d: Dispute) => d.status !== 'resolved').length : 0
        setUnresolvedCount(cnt)
      }
    } catch (err) { console.error('failed to fetch disputes count', err) }
  }

  // derive class options from fetched payments
  const classOptions = Array.from(new Set(payments.map((p) => p.class).filter(Boolean))) as string[]
  const totalPages = Math.max(1, Math.ceil((totalRecords || 0) / perPage))
  const pageItems = payments

  const view = async (id: string) => {
    try {
  const res = await fetch(`/api/teacher/payments?id=${id}&includePupil=1`, { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
        if (b && b.success) setSelected(b.data)
      }
    } catch (err) { console.error(err) }
  }

  const openDisputes = async (paymentId: string) => {
    try {
      setShowDisputesModal(true)
      setDisputesForPayment([])
  const qs = paymentId ? `?payment_id=${encodeURIComponent(paymentId)}` : ''
  const res = await fetch(`/api/pupils/payments/disputes${qs}`, { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
        setDisputesForPayment(b.disputes || [])
      }
    } catch (err) { console.error(err) }
  }

  const openDisputeDetail = async (d: Dispute) => {
    setCurrentDispute(d)
    setReplyMessage('')
    setReplies([])
    try {
      const res = await fetch(`/api/pupils/payments/disputes/${d.id}?id=${d.id}`, { credentials: 'include' })
      if (res.ok) {
        const b = await res.json()
        setReplies(b.replies || [])
      }
    } catch (err) { console.error(err) }
  }

  const postReply = async () => {
    if (!currentDispute || !replyMessage.trim()) return
    try {
      const res = await fetch(`/api/pupils/payments/disputes/${currentDispute.id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: currentDispute.id, reply_message: replyMessage, author_role: 'teacher' }) })
      const b = await res.json().catch(() => ({}))
      if (res.ok && b && b.success) {
        // optimistic insert into replies list
        const newReply: Reply = { id: b.reply?.id || `temp-${Date.now()}`, dispute_id: currentDispute.id, author_role: 'teacher', message: replyMessage, created_at: new Date().toISOString() }
        setReplies((s) => [...s, newReply])
        setReplyMessage('')
        // refresh disputes list
        const refresh = await fetch(`/api/pupils/payments/disputes?payment_id=${encodeURIComponent(currentDispute.payment_id)}`, { credentials: 'include' })
        if (refresh.ok) {
          const rb = await refresh.json()
          setDisputesForPayment(rb.disputes || [])
        }
      } else {
        setToast({ message: 'Failed to send reply', type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Failed', type: 'error' }) }
  }

  const resolveDispute = async (disputeId: string) => {
    try {
      const res = await fetch(`/api/pupils/payments/disputes/${disputeId}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: disputeId, status: 'resolved' }) })
      const b = await res.json().catch(() => ({}))
      if (res.ok && b && b.success) {
        setToast({ message: 'Dispute resolved', type: 'success' })
        // update local disputes list
        setDisputesForPayment((list) => list.map((x) => x.id === disputeId ? { ...x, status: 'resolved' } : x))
  if (currentDispute && currentDispute.id === disputeId) setCurrentDispute((c: Dispute | null) => c ? ({ ...c, status: 'resolved' }) : c)
      } else {
        setToast({ message: 'Failed to resolve dispute', type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Failed', type: 'error' }) }
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

  const openReportCash = (p: { id: string; name?: string }) => {
    setReportPupil({ id: p.id, name: p.name || '' })
    setCashAmount('')
  }

  const submitCash = async () => {
    if (!reportPupil) return
    try {
      const payload = { pupil_id: reportPupil.id, amount: Number(cashAmount) || 0, terms: ['Term 1'], payment_method: 'cash' }
      const res = await fetch('/api/teacher/payments', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const b = await res.json().catch(() => ({}))
      if (res.ok && b && b.success) {
        setToast({ message: 'Cash payment recorded', type: 'success' })
        setReportPupil(null)
        await fetchPayments()
      } else {
        setToast({ message: 'Failed to record payment', type: 'error' })
      }
    } catch (err) { console.error(err); setToast({ message: 'Failed', type: 'error' }) }
  }

  return (
    <div>
      {toast && <CustomAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold mb-4">Payments</h1>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
        <div className="flex-1 flex items-center space-x-2">
          <input placeholder="Search by pupil name or class" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} className="border px-3 py-2 rounded w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <select aria-label="Filter by class" value={filterClass} onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1); fetchPayments(1) }} className="border px-3 py-2 rounded">
            <option value="">All classes</option>
            {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Filter by status" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); fetchPayments(1) }} className="border px-3 py-2 rounded">
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
          </select>
          <button onClick={() => openDisputes('')} className="px-4 py-2 border rounded flex items-center gap-2">
            All Disputes
            {unresolvedCount > 0 && <span className="inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs px-2 py-0.5">{unresolvedCount}</span>}
          </button>
          <button onClick={() => fetchPayments(currentPage)} className="px-4 py-2 bg-primary text-white rounded">Refresh</button>
        </div>
      </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {pageItems.map((p) => (
      <div key={p.id} className="bg-white shadow-sm border rounded p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <Image src={p.profile_picture || '/default-profile.png'} alt={p.pupil_name || 'avatar'} width={48} height={48} className="object-cover" />
            </div>
            <div className="truncate">
              <p className="font-medium">{p.pupil_name || p.payment_reference || p.uin || p.email}</p>
              <p className="text-sm text-gray-500">{p.class} — ₦{p.amount ? Number(p.amount).toFixed(2) : '0.00'}</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">Terms: {Array.isArray((p as unknown as Record<string, unknown>).terms) ? ((p as unknown as Record<string, unknown>).terms as string[]).join(', ') : '-'}</div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">{p.status}</div>
          <div className="space-x-2">
            <button onClick={() => view(p.id)} className="px-3 py-1 bg-primary text-white rounded">View</button>
            {p.status === 'pending' && <button onClick={() => openDisputes(p.id)} className="px-3 py-1 border rounded">Disputes</button>}
          </div>
        </div>
      </div>
    ))}

        <div className="md:col-span-1 border rounded p-3">
          <h3 className="font-semibold mb-2">Pupils (report cash)</h3>
          <div className="space-y-2">
    {pupils.map((pp) => (
              <div key={pp.id} className="flex items-center justify-between">
                <div className="truncate">
      <div className="font-medium">{pp.name || pp.uin || pp.email}</div>
      <div className="text-xs text-muted">{pp.uin || pp.email}</div>
                </div>
                <div className="ml-2">
      <button onClick={() => openReportCash(pp)} className="px-2 py-1 bg-amber-500 text-white rounded">Report</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage((s) => Math.max(1, s - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <div className="px-3 py-1">Page {currentPage} / {totalPages}</div>
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((s) => Math.min(totalPages, s + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <button onClick={() => setSelected(null)} className="text-muted">Close</button>
            </div>

            {/* summary row */}
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image src={selected.profile_picture || '/default-profile.png'} alt="avatar" width={48} height={48} className="object-cover" />
              </div>
              <div>
                <div className="font-medium">{selected.pupil_name || selected.user_id || selected.uin || selected.email}</div>
                <div className="text-sm text-muted">{selected.class} — {Array.isArray((selected as Payment).terms) ? ((selected as Payment).terms as string[]).join(', ') : (selected.term || '-') } — ₦{selected.amount ? Number(selected.amount).toFixed(2) : '0.00'}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {Object.entries(selected as Record<string, unknown>)
                .filter(([k]) => !['pupils', 'profile_picture', 'pupil_name'].includes(k))
                .map(([k, v]) => {
                  let value: string
                  if (k === 'terms' && Array.isArray(v)) value = (v as string[]).join(', ')
                  else if (typeof v === 'object' && v !== null) value = JSON.stringify(v, null, 2)
                  else value = String(v ?? '-')
                  return (
                    <div key={k} className="flex justify-between"><span className="text-sm text-muted capitalize">{k.replace('_',' ')}</span><span className="font-medium whitespace-pre">{value}</span></div>
                  )
                })}
            </div>

            <div className="mt-4 flex space-x-2">
              {selected.status !== 'paid' && <button onClick={() => { setShowMarkPaidModal(true); setMarkPaidRef(selected.payment_reference || ''); setMarkPaidAt(selected.paid_at || new Date().toISOString()); }} className="px-4 py-2 bg-green-600 text-white rounded">Mark as Received</button>}
              <button onClick={() => updateStatus(selected.id, 'disputed')} className="px-4 py-2 bg-red-600 text-white rounded">Mark Disputed</button>
            </div>

            {/* Mark as received modal */}
            {showMarkPaidModal && selected && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-45">
                <div className="bg-white rounded p-6 max-w-md w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Record Payment Received</h3>
                    <button onClick={() => setShowMarkPaidModal(false)} className="text-muted">Close</button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm" htmlFor="mark-paid-ref">Payment Reference</label>
                    <input id="mark-paid-ref" value={markPaidRef} onChange={(e) => setMarkPaidRef(e.target.value)} className="border px-2 py-1 rounded w-full" />
                    <label className="block text-sm">Payment Method</label>
                    <label className="sr-only" htmlFor="mark-paid-method">Payment Method</label>
                    <select id="mark-paid-method" value={markPaidMethod} onChange={(e) => setMarkPaidMethod(e.target.value)} className="border px-2 py-1 rounded w-full">
                      <option value="cash">Cash</option>
                      <option value="bank">Bank</option>
                      <option value="paystack">Paystack</option>
                      <option value="other">Other</option>
                    </select>
                    <label className="block text-sm" htmlFor="mark-paid-at">Paid At</label>
                    <input id="mark-paid-at" type="datetime-local" value={markPaidAt ? new Date(markPaidAt).toISOString().slice(0,16) : ''} onChange={(e) => setMarkPaidAt(new Date(e.target.value).toISOString())} className="border px-2 py-1 rounded w-full" />
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => setShowMarkPaidModal(false)} className="px-3 py-1 border rounded">Cancel</button>
                    <button onClick={async () => {
                      try {
                        const res = await fetch('/api/teacher/payments', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, status: 'paid', payment_reference: markPaidRef, payment_method: markPaidMethod, paid_at: markPaidAt }) })
                        const b = await res.json().catch(() => ({}))
                        if (res.ok && b && b.success) {
                          setToast({ message: 'Payment marked as received', type: 'success' })
                          setShowMarkPaidModal(false)
                          setSelected(null)
                          await fetchPayments()
                        } else {
                          setToast({ message: 'Failed to update payment', type: 'error' })
                        }
                      } catch (err) { console.error(err); setToast({ message: 'Failed', type: 'error' }) }
                    }} className="px-3 py-1 bg-green-600 text-white rounded">Submit</button>
                  </div>
                </div>
              </div>
            )}

            {/* Disputes modal (list + detail) - top-level so it appears independently */}
            {showDisputesModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
                <div className="bg-white rounded p-6 max-w-3xl w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Disputes</h3>
                    <button onClick={() => { setShowDisputesModal(false); setDisputesForPayment([]); setCurrentDispute(null); }} className="text-muted">Close</button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <h4 className="font-medium mb-2">All Disputes</h4>
                      <div className="space-y-2 max-h-80 overflow-auto">
                        {disputesForPayment.length === 0 && <div className="text-sm text-gray-500">No disputes</div>}
                        {disputesForPayment.map((d) => (
                          <div key={d.id} className={`p-2 border rounded cursor-pointer ${currentDispute?.id === d.id ? 'bg-gray-50' : ''}`} onClick={() => openDisputeDetail(d)}>
                            <div className="font-medium">{d.reason}</div>
                            <div className="text-xs text-muted">{d.status} — {(d.created_at ? new Date(d.created_at).toLocaleString() : '-')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      {currentDispute ? (
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{currentDispute.reason}</h4>
                              <div className="text-sm text-muted">{currentDispute.details}</div>
                            </div>
                            <div className="space-x-2">
                              {currentDispute.status !== 'resolved' && <button onClick={() => resolveDispute(currentDispute.id)} className="px-3 py-1 bg-green-600 text-white rounded">Resolve</button>}
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="font-medium">Conversation</h5>
                            <div className="mt-2 max-h-64 overflow-auto space-y-2 border p-2 rounded">
                              {replies.length === 0 && <div className="text-sm text-gray-500">No messages yet.</div>}
                              {replies.map((r) => (
                                <div key={r.id} className="p-2 bg-gray-50 rounded">
                                  <div className="text-xs text-muted">{r.author_role} — {(r.created_at ? new Date(r.created_at).toLocaleString() : '-')}</div>
                                  <div className="mt-1">{r.message}</div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-3">
                              <label htmlFor="replyMessage" className="sr-only">Reply</label>
                              <textarea id="replyMessage" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full border p-2 rounded" rows={3} />
                              <div className="mt-2 flex justify-end">
                                <button onClick={postReply} className="px-3 py-1 bg-primary text-white rounded">Send Reply</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Select a dispute to view details.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Cash Modal */}
      {reportPupil && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded p-6 max-w-md w-full">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Report Cash Payment</h3>
              <button onClick={() => setReportPupil(null)} className="text-muted">Close</button>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Pupil: {reportPupil.name}</div>
              <label className="block mt-2 text-sm">Amount</label>
              <input type="number" placeholder="Amount (NGN)" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} className="border px-2 py-1 rounded w-full" />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setReportPupil(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={submitCash} className="px-3 py-1 bg-green-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Disputes modal (moved to end) */}
      {showDisputesModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
          <div className="bg-white rounded p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Disputes</h3>
              <button onClick={() => { setShowDisputesModal(false); setDisputesForPayment([]); setCurrentDispute(null); }} className="text-muted">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <h4 className="font-medium mb-2">All Disputes</h4>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {disputesForPayment.length === 0 && <div className="text-sm text-gray-500">No disputes</div>}
                  {disputesForPayment.map((d) => (
                    <div key={d.id} className={`p-2 border rounded cursor-pointer ${currentDispute?.id === d.id ? 'bg-gray-50' : ''}`} onClick={() => openDisputeDetail(d)}>
                      <div className="font-medium">{d.reason}</div>
                      <div className="text-xs text-muted">{d.status} — {(d.created_at ? new Date(d.created_at).toLocaleString() : '-')}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                {currentDispute ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{currentDispute.reason}</h4>
                        <div className="text-sm text-muted">{currentDispute.details}</div>
                      </div>
                      <div className="space-x-2">
                        {currentDispute.status !== 'resolved' && <button onClick={() => resolveDispute(currentDispute.id)} className="px-3 py-1 bg-green-600 text-white rounded">Resolve</button>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-medium">Conversation</h5>
                      <div className="mt-2 max-h-64 overflow-auto space-y-2 border p-2 rounded">
                        {replies.length === 0 && <div className="text-sm text-gray-500">No messages yet.</div>}
                        {replies.map((r) => (
                          <div key={r.id} className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-muted">{r.author_role} — {(r.created_at ? new Date(r.created_at).toLocaleString() : '-')}</div>
                            <div className="mt-1">{r.message}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <label htmlFor="replyMessage" className="sr-only">Reply</label>
                        <textarea id="replyMessage" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full border p-2 rounded" rows={3} />
                        <div className="mt-2 flex justify-end">
                          <button onClick={postReply} className="px-3 py-1 bg-primary text-white rounded">Send Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Select a dispute to view details.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

