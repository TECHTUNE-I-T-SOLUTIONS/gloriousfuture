"use client"

import { useEffect, useState, useMemo, ChangeEvent } from "react"
import { usePupil } from "../../pupil-context"
import { FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimes, FaReceipt, FaDownload } from "react-icons/fa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Payment {
  id: string
  amount: number
  status: string
  payment_method: string
  payment_reference: string
  paid_at?: string
  created_at?: string
  terms?: string[]
  // optional DB fields
  session?: string | null
  class?: string | null
  uin?: string | null
  email?: string | null
  profile_picture?: string | null
}

type PaymentResponseItem = Payment & { placeholder?: boolean }

export default function Payments() {
  const { pupil } = usePupil()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  type SchoolFeeShape = {
    id?: string
    amount?: number
    session?: string
    term1_amount?: number | null
    term2_amount?: number | null
    term3_amount?: number | null
  }
  const [schoolFee, setSchoolFee] = useState<SchoolFeeShape | null>(null)
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [selectedTerms, setSelectedTerms] = useState<string[]>([])
  // no modal flow — direct PDF downloads only
  const [includePupil, setIncludePupil] = useState<boolean>(false) // New state for includePupil
  const [termsFormatted, setTermsFormatted] = useState<string[]>([]) // New state for formatted terms

  const [paidTerms, setPaidTerms] = useState<string[]>([])
  // per-term paid amounts and remaining amounts for the current session
  const [, setTermPaidAmounts] = useState<Record<string, number>>({})
  const [termRemaining, setTermRemaining] = useState<Record<string, number>>({})
  const [fullyPaidTerms, setFullyPaidTerms] = useState<string[]>([])

  // dispute modal state
  const [showDisputeModal, setShowDisputeModal] = useState<boolean>(false)
  const [disputePayment, setDisputePayment] = useState<Payment | null>(null)
  const [disputeReason, setDisputeReason] = useState<string>('')
  const [disputeDetails, setDisputeDetails] = useState<string>('')
  const [disputes, setDisputes] = useState<Array<Record<string, unknown>>>([])
  const [showDisputesListModal, setShowDisputesListModal] = useState<boolean>(false)

  // toast state (simple local toast)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [creatingPayment, setCreatingPayment] = useState<boolean>(false)

  const hasDispute = (paymentId: string) => {
    try {
  return disputes.some((d) => String((d as Record<string, unknown>).payment_id) === String(paymentId))
    } catch {
      return false
    }
  }


  const submitDispute = async () => {
    if (!disputePayment) return
    try {
      const body = { payment_id: disputePayment.id, pupil_id: pupil?.id ?? null, uin: pupil?.uin ?? null, reason: disputeReason, details: disputeDetails }
      const res = await fetch('/api/pupils/payments/disputes', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) {
        const text = await res.text().catch(() => null)
        window.alert('Failed to submit dispute. Please try again.')
        console.error('dispute submit failed', { status: res.status, body: text })
        return
      }
  setShowDisputeModal(false)
  setDisputeReason('')
  setDisputeDetails('')
  setToast({ type: 'success', message: 'Dispute submitted. A teacher will review and respond.' })
  setTimeout(() => setToast(null), 3500)
      // refresh disputes list
      // refresh disputes list for the pupil
      try {
        const u = typeof pupil?.uin === 'string' ? pupil.uin : undefined
        if (u) {
          const dr = await fetch(`/api/pupils/payments/disputes?uin=${encodeURIComponent(u)}`, { credentials: 'include' })
          if (dr.ok) {
            const dj = await dr.json()
            setDisputes(dj.disputes || [])
          }
        }
      } catch {
        // ignore
      }
  } catch (err) {
  console.error('submitDispute error', err)
  setToast({ type: 'error', message: 'Failed to submit dispute. Please try again.' })
  setTimeout(() => setToast(null), 3500)
    }
  }

  // Filtering / searching / sorting state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterSession, setFilterSession] = useState<string | 'all'>('all')
  // Generate a range of session text strings based on the current year to
  // avoid server polling while keeping the dropdown up-to-date.
  const sessionsList = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    // Create sessions from (year - 1)/year up to (year + 5)/(year + 6)
    const before = 1
    const after = 5
    const arr: { id: string; session: string; active?: boolean }[] = []
    for (let offset = -before; offset <= after; offset++) {
      const y1 = year + offset
      const y2 = y1 + 1
      const s = `${y1}/${y2}`
      arr.push({ id: s, session: s, active: false })
    }
    return arr
  }, [])
  const [filterClass, setFilterClass] = useState<string | 'all'>('all')
  const [filterTerm, setFilterTerm] = useState<string | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc')
  const [dateFrom, setDateFrom] = useState<string | null>(null)
  const [dateTo, setDateTo] = useState<string | null>(null)

  // animate when selectedTerms changes - removed (used by previous floating bar)

  useEffect(() => {
    const uin = typeof pupil?.uin === "string" ? pupil.uin : undefined
    if (!uin) {
      setLoading(false)
      return
    }
    const fetchPayments = async () => {
      try {
        // request placeholders so the client always receives per-term placeholders when appropriate
        const res = await fetch(`/api/pupils/payments?uin=${encodeURIComponent(uin)}&placeholders=1`, { credentials: "include" })
        if (res.ok) {
          const j = await res.json()
          const realPayments = (j.payments || []).filter((p: PaymentResponseItem) => !p.placeholder)
          // compute paid terms for current session (used to disable selection)
          try {
            type PaymentWithTerms = Payment & { terms?: string[] }
            const paid: string[] = (realPayments as PaymentWithTerms[])
              .filter((p) => typeof p.status === 'string' && ["paid", "completed", "success"].includes(p.status.toLowerCase()))
              .flatMap((p) => (Array.isArray(p.terms) ? (p.terms as string[]) : []))
            const s = new Set<string>()
            for (const t of paid) s.add(t)
            const uniquePaid: string[] = Array.from(s)
            // store in React state so UI updates reactively
            setPaidTerms(uniquePaid)
          } catch {
            console.error('paid terms parse error')
            setPaidTerms([])
          }
          setPayments(realPayments as Payment[])
          // always set schoolFee if provided by the API
          if (j.schoolFee) setSchoolFee(j.schoolFee)
          if (j.currentSession) setCurrentSession(j.currentSession)
          // NOTE: do not override the user's session filter with the server value.
          // We intentionally keep filterSession as 'all' by default and let the pupil
          // choose from the static session dropdown to avoid polling and id mismatch.
           if (j.includePupil) setIncludePupil(j.includePupil) // Fetch includePupil from API
           if (j.termsFormatted) setTermsFormatted(j.termsFormatted) // Fetch formatted terms from API
          // compute per-term paid amounts and remaining amounts scoped to the current session
          try {
            const visibleTerms = (j.termsFormatted && j.termsFormatted.length) ? j.termsFormatted : ["Term 1", "Term 2", "Term 3"]
            // build term amount map using schoolFee if available
            const sfAny = (j.schoolFee ?? schoolFee) as unknown as Record<string, unknown>
            const rawTermVals = [sfAny?.["term1_amount"], sfAny?.["term2_amount"], sfAny?.["term3_amount"]]
            const totalAmount = Number(sfAny?.["amount"] ?? (j.schoolFee ? (j.schoolFee.amount ?? 0) : (schoolFee?.amount ?? 0)))
            const defaultPerTerm = totalAmount > 0 ? Math.round((totalAmount / visibleTerms.length) * 100) / 100 : 0
            const termAmountMap: Record<string, number | null> = {}
            for (let i = 0; i < visibleTerms.length; i++) {
              const raw = rawTermVals[i]
              const parsed = raw === undefined || raw === null ? NaN : Number(raw)
              if (!isNaN(parsed) && parsed > 0) termAmountMap[visibleTerms[i]] = parsed
              else if (totalAmount > 0) termAmountMap[visibleTerms[i]] = defaultPerTerm
              else termAmountMap[visibleTerms[i]] = null
            }

            const paidAmounts: Record<string, number> = {}
            for (const t of visibleTerms) paidAmounts[t] = 0

            const paidPayments = (realPayments as Payment[]).filter((p) => typeof p.status === 'string' && ["paid", "completed", "success"].includes(p.status.toLowerCase()))
            const sessionId = j.currentSession ?? currentSession
            for (const p of paidPayments) {
              if (!sessionId || String(p.session || '') !== String(sessionId)) continue
              if (!Array.isArray(p.terms) || p.terms.length === 0) continue
              const termsIn = p.terms.filter((x: unknown) => visibleTerms.includes(String(x))) as string[]
              if (termsIn.length === 0) continue
              const share = (typeof p.amount === 'number' && p.amount > 0) ? (p.amount / termsIn.length) : 0
              for (const t of termsIn) paidAmounts[t] = (paidAmounts[t] || 0) + share
            }

            const remaining: Record<string, number> = {}
            const fullyPaid: string[] = []
            for (const t of visibleTerms) {
              const amt = termAmountMap[t]
              const paidAmt = Math.round((paidAmounts[t] || 0) * 100) / 100
              if (typeof amt === 'number' && !isNaN(amt) && amt > 0) {
                const rem = Math.max(0, Math.round((amt - paidAmt) * 100) / 100)
                remaining[t] = rem
                if (rem <= 0) fullyPaid.push(t)
              } else {
                // no configured amount for this term; treat any paid amount as fully paid
                remaining[t] = 0
                if (paidAmt > 0) fullyPaid.push(t)
              }
            }
            setTermPaidAmounts(paidAmounts)
            setTermRemaining(remaining)
            setFullyPaidTerms(fullyPaid)
            // also set paidTerms array (legacy state) to match fully paid terms
            setPaidTerms(fullyPaid)
          } catch (err) {
            console.error('term financials compute error', err)
          }
        }
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  // We intentionally do not fetch sessions from the server here to avoid
  // frequent polling. `sessionsList` is seeded from a static list above.
  }, [pupil?.uin, currentSession, schoolFee])


  // helper to derive paid terms from payments array
  const computePaidTermsFromPayments = (paymentsArr: Payment[]) => {
    try {
      type PaymentWithTerms = Payment & { terms?: string[] }
      const paid: string[] = (paymentsArr as PaymentWithTerms[])
  .filter((p) => !((p as unknown as PaymentResponseItem).placeholder) && typeof p.status === 'string' && ["paid", "completed", "success"].includes(p.status.toLowerCase()) && typeof p.amount === 'number' && p.amount > 0)
        .flatMap((p) => (Array.isArray(p.terms) ? (p.terms as string[]) : []))
      const s = new Set<string>()
      for (const t of paid) s.add(t)
      return Array.from(s)
    } catch (e) {
      console.error('computePaidTermsFromPayments error', e)
      return []
    }
  }

  // Export a styled receipt by creating a temporary DOM node and calling captureElementToPdf (PDF-only)
  const exportReceipt = async (payment: Payment) => {
    try {
      const id = `receipt-export-${payment.id}`
      // avoid duplicate
      let node = document.getElementById(id) as HTMLElement | null
      if (node) node.remove()

      node = document.createElement('div')
  node.id = id
      node.setAttribute(
        'data-school',
        document.querySelector('meta[name="school"]')?.getAttribute('content') || 'Glorious Future Academy',
      )
      // include pupil identity: name and class instead of address/contact
  const pupilRec = pupil as unknown as Record<string, unknown>
  node.setAttribute('data-for', String(pupilRec?.full_name ?? pupilRec?.name ?? ''))
  if (pupilRec?.uin) node.setAttribute('data-uin', String(pupilRec.uin))
  if (pupilRec?.class) node.setAttribute('data-class', String(pupilRec.class))

      // Enhanced inline styles for beautiful receipt design
      node.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      node.style.padding = '24mm'
      node.style.maxWidth = '800px'
      node.style.margin = '0 auto'
      node.style.fontFamily =
        "'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      node.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      node.style.borderRadius = '16px'

      const termsText = Array.isArray(payment.terms) ? payment.terms.join(', ') : String(payment.terms || '')

      // Try to inline the site logo as a data URL so the print blob doesn't
      // show a broken image or wait for a network load. Fallback to the
      // original /logo.png if embedding fails.
      let logoSrc = '/logo.png'
      try {
        const resp = await fetch('/logo.png')
        if (resp.ok) {
          const b = await resp.blob()
          const arr = await new Response(b).arrayBuffer()
          // convert ArrayBuffer to base64 in a browser-safe way
          const bytes = new Uint8Array(arr)
          let binary = ''
          const chunkSize = 0x8000
          for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize)
            // convert Uint8Array chunk to regular array for apply
            binary += String.fromCharCode.apply(null, Array.prototype.slice.call(chunk))
          }
          const base64 = (typeof window !== 'undefined' && typeof window.btoa === 'function')
            ? window.btoa(binary)
            : Buffer.from(arr).toString('base64')
          const mime = b.type || 'image/png'
          logoSrc = `data:${mime};base64,${base64}`
        }
      } catch {
        // ignore and use default path
      }

      node.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
            pointer-events: none;
          "></div>
          
          <div style="
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
            position: relative;
          ">
              <div style="
              height: 64px;
              width: 64px;
              border-radius: 16px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            ">
              <img src="${logoSrc}" alt="Glorious Future Academy logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;background:white;padding:6px;"/>
            </div>
            <div style="flex: 1;">
              <div style="
                font-weight: 800;
                font-size: 24px;
                color: #1e293b;
                background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 4px;
              ">Glorious Future Academy</div>
              <div style="
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Official Payment Receipt</div>
            </div>
            <div style="
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 8px 16px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
            ">${String(payment.status)}</div>
          </div>

          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
          ">
            <div style="
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-radius: 12px;
              padding: 24px;
              border: 1px solid #e2e8f0;
            ">
              <h3 style="
                font-weight: 700;
                font-size: 16px;
                color: #1e293b;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 50%;
                "></div>
                Payment Information
              </h3>
              <div style="space-y: 12px;">
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Amount Paid</div>
                  <div style="font-weight: 700; font-size: 20px; color: #059669;">${formatCurrency(payment.amount)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Reference Number</div>
                  <div style="font-weight: 600; color: #1e293b; font-family: 'Courier New', monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; display: inline-block;">${payment.payment_reference}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Payment Method</div>
                  <div style="font-weight: 600; color: #1e293b;">${payment.payment_method || '-'}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Academic Terms</div>
                  <div style="font-weight: 600; color: #1e293b;">${termsText}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Transaction Date</div>
                  <div style="font-weight: 600; color: #1e293b;">${formatDate(payment.paid_at || payment.created_at)}</div>
                </div>
              </div>
            </div>

            <div style="
              background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
              border-radius: 12px;
              padding: 24px;
              border: 1px solid #fbbf24;
              position: relative;
            ">
              <h3 style="
                font-weight: 700;
                font-size: 16px;
                color: #1e293b;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                  border-radius: 50%;
                "></div>
                Student Information
              </h3>
              <div style="space-y: 12px;">
                ${pupilRec?.profile_picture ? `<div style="position:absolute; top:16px; right:16px; width:56px; height:56px; border-radius:50%; overflow:hidden; box-shadow:0 6px 12px rgba(0,0,0,0.08);"><img src="${String(pupilRec.profile_picture ?? '')}" alt="profile" style="width:100%;height:100%;object-fit:cover;"/></div>` : ''}
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #92400e; font-weight: 500; margin-bottom: 4px;">Student UIN</div>
                  <div style="font-weight: 600; color: #1e293b; font-family: 'Courier New', monospace; background: rgba(251, 191, 36, 0.2); padding: 4px 8px; border-radius: 6px; display: inline-block;">${String(pupilRec?.uin ?? '')}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #92400e; font-weight: 500; margin-bottom: 4px;">Full Name</div>
                  <div style="font-weight: 700; color: #1e293b; font-size: 16px;">${String(pupilRec?.full_name ?? pupilRec?.name ?? '')}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #92400e; font-weight: 500; margin-bottom: 4px;">Class</div>
                  <div style="font-weight: 600; color: #1e293b;">${String(pupilRec?.class ?? '')}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Email</div>
                  <div style="font-weight: 600; color: #1e293b;">${String(pupilRec?.email ?? pupilRec?.email_address ?? '')}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 4px;">Session</div>
                  <div style="font-weight: 600; color: #1e293b;">${String(payment.session ?? currentSession ?? '')}</div>
                </div>
              </div>
            </div>
          </div>

          <div style="
            text-align: center;
            padding-top: 24px;
            border-top: 2px solid #e2e8f0;
            position: relative;
          ">
            <div style="
              font-size: 12px;
              color: #64748b;
              margin-bottom: 8px;
              font-weight: 500;
            ">This is an official receipt generated on ${new Date().toLocaleDateString('en-GB')}</div>
            <div style="
              font-size: 10px;
              color: #94a3b8;
              font-style: italic;
            ">For any queries, please contact the school administration</div>
            
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 60px;
              height: 4px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 2px;
            "></div>
          </div>
        </div>
      `

      // Build a standalone HTML document for printing and open it as a blob URL.
      // This avoids opening about:blank and prevents our code from injecting any
      // extra headers/titles/footers. Browser print dialog may still include
      // browser-controlled headers/footers (user setting); generating a PDF
      // programmatically would fully avoid those, but for now we print the
      // designed receipt directly.
      const wrapperStyle = `background: ${node.style.background}; padding: ${node.style.padding}; max-width: ${node.style.maxWidth}; margin: ${node.style.margin}; font-family: ${node.style.fontFamily}; box-shadow: ${node.style.boxShadow}; border-radius: ${node.style.borderRadius};`;

      const html = `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>Receipt</title>
            <style>
              @page { size: A4; margin: 0 }
              html,body { height: 100%; margin: 0; padding: 0; }
              body { display: flex; align-items: center; justify-content: center; background: white; }
              .receipt-root { ${wrapperStyle} }
              img { max-width: 100%; height: auto; display: block; }
              /* ensure the inner card fits the page nicely */
              .receipt-card { box-sizing: border-box; width: 100%; }
            </style>
          </head>
          <body>
            <div class="receipt-root">
              ${node.innerHTML}
            </div>
            <script>
              // Auto-print and close after printing. Keep a small delay to let
              // images load in some environments.
              function tryPrint() {
                try {
                  window.focus();
                  window.print();
                } catch (e) {
                  console.error('print failed', e);
                }
              }
              window.addEventListener('load', function(){
                // Give images a bit more time to render inside the blob window
                // before calling print. 800-1200ms is usually enough on local dev.
                setTimeout(function(){ tryPrint(); setTimeout(function(){ window.close(); }, 500); }, 900);
              });
            <\/script>
          </body>
        </html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank');
      if (!w) {
        // Fallback: append node to DOM and trigger regular print (older popup blockers)
        document.body.appendChild(node);
        try {
          window.print();
        } finally {
          try { node.remove(); } catch {}
        }
      } else {
        // Revoke the blob URL after a short timeout to allow the print window to load.
        setTimeout(() => {
          try { URL.revokeObjectURL(url); } catch {}
        }, 20000);
      }
    } catch (err) {
      console.error('Export receipt failed', err)
      window.alert('Failed to export receipt. See console for details.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <FaClock className="w-4 h-4 text-amber-500" />
      case "failed":
      case "cancelled":
        return <FaTimes className="w-4 h-4 text-red-500" />
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
      case "failed":
      case "cancelled":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Short date for compact/mobile display (no time)
  const formatDateShort = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTotalPaid = () => {
    try {
      const paidPayments = payments.filter((p) => typeof p.status === 'string' && ["paid", "completed", "success"].includes(p.status.toLowerCase()) && typeof p.amount === 'number' && p.amount > 0)
      return Math.round(paidPayments.reduce((s, p) => s + (p.amount || 0), 0) * 100) / 100
    } catch {
      return 0
    }
  }

  const getPendingAmount = () => {
    try {
      const pending = payments.filter((p) => typeof p.status === 'string' && ["pending"].includes(p.status.toLowerCase()) && typeof p.amount === 'number' && p.amount > 0)
      return Math.round(pending.reduce((s, p) => s + (p.amount || 0), 0) * 100) / 100
    } catch {
      return 0
    }
  }

  // Handle pay now: initialize payment provider payload and open Paystack iframe.
  const handlePayNow = async (paymentId: string) => {
    try {
      // Try to fetch payment init data. Backend endpoint may vary; use a best-effort path.
  let data: Record<string, unknown> = {}
      try {
        const initRes = await fetch(`/api/pupils/payments/init?payment_id=${encodeURIComponent(paymentId)}`, { credentials: 'include' })
        if (initRes.ok) data = await initRes.json()
        console.debug('payment init response', data)
      } catch {
        // ignore; fall back to safe defaults
        data = {}
      }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataAny: any = data
  const returnedAmountKobo = dataAny?.amount_kobo ?? (dataAny?.amount ? Math.round(Number(dataAny.amount) * 100) : null)
  const reference = dataAny?.reference || dataAny?.payment?.payment_reference || dataAny?.payment?.id
      if (!returnedAmountKobo || Number(returnedAmountKobo) <= 0) {
        console.error("Paystack init returned no amount", data)
        window.alert("Payment initialization failed: amount missing. Please contact the administrator.")
        return
      }

      if (
        !(window as unknown as { PaystackPop?: unknown }).PaystackPop &&
        !document.querySelector("#paystack-script")
      ) {
        const s = document.createElement("script")
        s.id = "paystack-script"
        s.src = "https://js.paystack.co/v1/inline.js"
        s.async = true
        document.body.appendChild(s)
        await new Promise<void>((resolve) => {
          s.onload = () => resolve()
          s.onerror = () => resolve()
        })
      }

      const PaystackPop = (window as unknown as { PaystackPop?: unknown }).PaystackPop
      if (!PaystackPop) {
  const authUrl = dataAny?.authorization_url ?? dataAny?.data?.authorization_url ?? dataAny?.data?.authorizationUrl ?? null
        if (authUrl) {
          window.open(authUrl, "_blank")
          return
        }
        console.error("Paystack script not available and no authorization url")
        return
      }

      const onCloseHandler = () => {
        ;(async () => {
          try {
            const ref = dataAny?.data?.reference || dataAny?.data?.ref || dataAny?.access_code || dataAny?.reference || dataAny?.payment?.payment_reference || dataAny?.payment?.id
            if (!ref) return
            const ver = await fetch(`/api/pupils/paystack/verify?reference=${encodeURIComponent(ref)}&format=json`)
            if (ver.ok) {
              const uin = typeof pupil?.uin === "string" ? pupil.uin : undefined
              if (uin) {
                const pr = await fetch(`/api/pupils/payments?uin=${encodeURIComponent(uin)}`, {
                  credentials: "include",
                })
                if (pr.ok) {
                  const pj = await pr.json()
                  const newPayments = (pj.payments || []) as Payment[]
                  setPayments(newPayments)
                  setPaidTerms(computePaidTermsFromPayments(newPayments))
                }
              }
            }
          } catch (err) {
            console.error("verification failed", err)
          }
        })()
      }

      const callbackHandler = (response: unknown) => {
        ;(async () => {
          try {
            const r = response as Record<string, unknown>
            const ref = (r.reference as string) || (r.trxref as string) || (r.transaction as string)
            if (!ref) return
            const ver = await fetch(`/api/pupils/paystack/verify?reference=${encodeURIComponent(ref)}&format=json`)
            if (ver.ok) {
              const uin = typeof pupil?.uin === "string" ? pupil.uin : undefined
              if (uin) {
                const pr = await fetch(`/api/pupils/payments?uin=${encodeURIComponent(uin)}`, {
                  credentials: "include",
                })
                if (pr.ok) {
                    const pj = await pr.json()
                    const newPayments = (pj.payments || []) as Payment[]
                    setPayments(newPayments)
                    setPaidTerms(computePaidTermsFromPayments(newPayments))
                }
              }
            }
          } catch (err) {
            console.error("callback verification error", err)
          }
        })()
      }

      const setupEmail =
        (dataAny?.data?.customer?.email as string) ||
        (dataAny?.data?.customer_email as string) ||
        (pupil?.email as string) ||
        ""
      if (!setupEmail || !setupEmail.includes("@")) {
        console.error("Invalid email for Paystack:", setupEmail)
        window.alert("Missing or invalid email address for payment. Please ensure your profile has a valid email.")
        return
      }

  const amountForPaystack = Number(data?.amount_kobo ?? (data?.amount ? Math.round(Number(data.amount) * 100) : undefined))

      const handler = (PaystackPop as unknown as PaystackSetup).setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: setupEmail,
        amount: returnedAmountKobo || amountForPaystack || undefined,
        ref: reference || undefined,
        onClose: onCloseHandler,
        callback: callbackHandler,
      })
      handler.openIframe()
    } catch (err) {
      console.error("pay init error", err)
    }
  }

  const createAndPay = async () => {
    try {
      if (!pupil) return
      if (creatingPayment) return
      setCreatingPayment(true)
      const termsToSend = selectedTerms
      if (!termsToSend || termsToSend.length === 0) {
        setToast({ type: 'error', message: 'Please select one or more terms before paying' })
        setTimeout(() => setToast(null), 3000)
        setCreatingPayment(false)
        return
      }

      // Compute amount even when schoolFee is missing. Fallback per-term amount is derived
      // from existing payments (if any) or falls back to 0. We prefer an average of existing
      // term payment amounts when possible so selecting other terms produces a sensible value.
      const computeFallbackPerTerm = () => {
        const termPayments = payments.filter((p) => Array.isArray((p as Payment).terms) && (p as Payment).terms!.length > 0 && p.amount && p.amount > 0)
        if (termPayments.length > 0) {
          const sum = termPayments.reduce((s, x) => s + (x.amount || 0), 0)
          return Math.round((sum / termPayments.length) * 100) / 100
        }
        // otherwise try any payment amount
        const any = payments.find((p) => p.amount && p.amount > 0)
        return any ? (any.amount || 0) : 0
      }

      let amountToPay = 0
      const sfAny = schoolFee as unknown as Record<string, unknown>
      if (schoolFee) {
        const termAmounts: Record<string, number> = {
          "Term 1": Number(sfAny?.["term1_amount"] ?? Number.NaN),
          "Term 2": Number(sfAny?.["term2_amount"] ?? Number.NaN),
          "Term 3": Number(sfAny?.["term3_amount"] ?? Number.NaN),
        }
        const hasPerTerm = !isNaN(termAmounts["Term 1"]) || !isNaN(termAmounts["Term 2"]) || !isNaN(termAmounts["Term 3"])
        if (hasPerTerm) {
          // prefer session-aware remaining amounts when available
          if (termRemaining && Object.keys(termRemaining).length > 0) {
            amountToPay = termsToSend.reduce((sum, t) => sum + (termRemaining[t] || 0), 0)
          } else {
            amountToPay = termsToSend.reduce((sum, t) => sum + (termAmounts[t] || 0), 0)
          }
        } else {
          amountToPay = (schoolFee.amount || 0) * termsToSend.length
        }
      } else {
        const fallback = computeFallbackPerTerm()
        amountToPay = Math.round(fallback * termsToSend.length * 100) / 100
      }

      const body = {
        uin: pupil.uin,
        amount: amountToPay,
        class: pupil.class || undefined,
        session: currentSession,
        terms: termsToSend,
    includePupil: includePupil, // Include pupil in the request
    formattedTerms: termsFormatted, // Include formatted terms in the request
      }
      // basic sanity checks before sending
      if (!currentSession) {
        console.error('createAndPay: missing current session, aborting', { body })
        setToast({ type: 'error', message: 'Unable to create payment: current session not set. Refresh and try again.' })
        setTimeout(() => setToast(null), 3500)
        setCreatingPayment(false)
        return
      }

      console.debug('createAndPay: creating payment with body', body)
      const res = await fetch("/api/pupils/payments", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
  if (!res.ok) {
        // try to decode error response for debugging
        const text = await res.text().catch(() => null)
        console.error("failed to create payment", { status: res.status, statusText: res.statusText, body: text })
        try {
          const json = text ? JSON.parse(text) : null
          if (json && json.error) console.error('server error detail:', json.error)
        } catch {
          // ignore JSON parse
        }
        setToast({ type: 'error', message: 'Failed to create payment. See console for details.' })
        setTimeout(() => setToast(null), 3500)
        setCreatingPayment(false)
        return
      }
      const created = await res.json()
      // server may return { payment } or the payment directly; handle both
      const paymentId = (created && (created.id || (created.payment && created.payment.id))) || null
      if (!paymentId) {
        console.error('createAndPay: unable to determine created payment id', created)
        setToast({ type: 'error', message: 'Payment created but failed to initialize. Contact admin.' })
        setTimeout(() => setToast(null), 3500)
        setCreatingPayment(false)
        return
      }

      // initiate the provider flow
      await handlePayNow(paymentId)

      // refresh payments after attempting init so UI reflects the pending row
      try {
        const uin = typeof pupil?.uin === 'string' ? pupil.uin : undefined
        if (uin) {
          const pr = await fetch(`/api/pupils/payments?uin=${encodeURIComponent(uin)}&placeholders=1`, { credentials: 'include' })
          if (pr.ok) {
            const pj = await pr.json()
            const newPayments = (pj.payments || []) as Payment[]
            setPayments(newPayments)
            setPaidTerms(computePaidTermsFromPayments(newPayments))
          }
        }
      } catch {
        // ignore refresh errors
      }
      setCreatingPayment(false)
    } catch (err) {
      console.error("createAndPay error", err)
      setToast({ type: 'error', message: 'Unexpected error. See console.' })
      setTimeout(() => setToast(null), 3500)
      setCreatingPayment(false)
    }
  }

  const computeSelectedAmount = () => {
    // If we have a schoolFee, use it; otherwise compute a sensible fallback
    const sfAny = schoolFee as unknown as Record<string, unknown> | null
    if (sfAny) {
      const t1raw = sfAny["term1_amount"]
      const t2raw = sfAny["term2_amount"]
      const t3raw = sfAny["term3_amount"]
      const tvals: Array<number | null> = [t1raw == null ? null : Number(t1raw), t2raw == null ? null : Number(t2raw), t3raw == null ? null : Number(t3raw)]
      const hasPerTerm = tvals.some((v) => typeof v === 'number' && !isNaN(v) && v > 0)
      if (selectedTerms.length === 0) return Number(sfAny["amount"] ?? schoolFee?.amount ?? 0)
      if (hasPerTerm) {
        // if we have session-aware remaining amounts, use those (handles price changes)
        if (termRemaining && Object.keys(termRemaining).length > 0) {
          return selectedTerms.reduce((sum, term) => sum + (termRemaining[term] || 0), 0)
        }
        // sum only configured per-term amounts; ignore unset (null) terms
        const total = selectedTerms.reduce((sum, term) => {
          const idx = term === "Term 1" ? 0 : term === "Term 2" ? 1 : 2
          const v = tvals[idx]
          return sum + (typeof v === 'number' && v > 0 ? v : 0)
        }, 0)
        return total
      }
      return (Number(sfAny["amount"] ?? schoolFee?.amount ?? 0)) * selectedTerms.length
    }

    // fallback: derive per-term amount from historic payments (average) or any payment amount
    const termPayments = payments.filter((p) => Array.isArray((p as Payment).terms) && (p as Payment).terms!.length > 0 && p.amount && p.amount > 0)
    if (termPayments.length > 0) {
      const sum = termPayments.reduce((s, x) => s + (x.amount || 0), 0)
      const per = Math.round((sum / termPayments.length) * 100) / 100
      return per * (selectedTerms.length || 1)
    }
    const any = payments.find((p) => p.amount && p.amount > 0)
    const per = any ? (any.amount || 0) : 0
    return per * (selectedTerms.length || 1)
  }

  // memoized filtered & sorted payments for UI
  const filteredPayments = useMemo(() => {
    const list = payments.filter((p) => {
      if (filterSession !== 'all' && String(p.session || '') !== String(filterSession)) return false
      if (filterClass !== 'all' && String(p.class || '') !== String(filterClass)) return false
      if (filterTerm !== 'all') {
        const termsArr = Array.isArray(p.terms) ? (p.terms as string[]) : []
        if (!termsArr.includes(String(filterTerm))) return false
      }
      if (dateFrom) {
        const d = p.paid_at || p.created_at
        if (!d || new Date(d) < new Date(dateFrom)) return false
      }
      if (dateTo) {
        const d = p.paid_at || p.created_at
        if (!d || new Date(d) > new Date(dateTo + 'T23:59:59')) return false
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const hay = `${p.payment_reference || ''} ${p.payment_method || ''} ${p.status || ''} ${p.amount || ''} ${p.session || ''} ${p.class || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    list.sort((a,b) => {
      switch (sortBy) {
        case 'date_asc': return (new Date(a.paid_at || a.created_at || 0).getTime() || 0) - (new Date(b.paid_at || b.created_at || 0).getTime() || 0)
        case 'date_desc': return (new Date(b.paid_at || b.created_at || 0).getTime() || 0) - (new Date(a.paid_at || a.created_at || 0).getTime() || 0)
        case 'amount_asc': return (a.amount || 0) - (b.amount || 0)
        case 'amount_desc': return (b.amount || 0) - (a.amount || 0)
        default: return 0
      }
    })
    return list
  }, [payments, filterSession, filterClass, filterTerm, dateFrom, dateTo, searchQuery, sortBy])

  type PaystackSetup = {
    setup: (opts: Record<string, unknown>) => { openIframe: () => void }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4 sm:space-y-6">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-28">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="p-2 bg-pink-500 rounded-lg w-fit">
            <FaFileInvoiceDollar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-balance">Payment History</h1>
            <p className="text-sm sm:text-base text-gray-600 text-pretty">
              Track your school fees and payment transactions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Paid</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2 p-2">
                <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">
                  {formatCurrency(getTotalPaid())}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2 p-2">
                <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600 truncate">
                  {formatCurrency(getPendingAmount())}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2 p-2">
                <FaReceipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{payments.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Select Terms to Pay</CardTitle>
            <CardDescription className="text-sm">Choose which terms you want to pay for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {(() => {
                const visibleTerms = termsFormatted && termsFormatted.length ? termsFormatted : ["Term 1", "Term 2", "Term 3"]
                // build a mapping from term name -> amount using schoolFee term fields when available
                const sfAny = schoolFee as unknown as Record<string, unknown>
                const rawTermVals = [sfAny?.["term1_amount"], sfAny?.["term2_amount"], sfAny?.["term3_amount"]]
                const totalAmount = Number(sfAny?.["amount"] ?? schoolFee?.amount ?? 0)
                const defaultPerTerm = totalAmount > 0 ? Math.round((totalAmount / visibleTerms.length) * 100) / 100 : 0
                const termAmountMap: Record<string, number | null> = {}
                for (let i = 0; i < visibleTerms.length; i++) {
                  const raw = rawTermVals[i]
                  const parsed = raw === undefined || raw === null ? NaN : Number(raw)
                  if (!isNaN(parsed) && parsed > 0) termAmountMap[visibleTerms[i]] = parsed
                  else if (totalAmount > 0) termAmountMap[visibleTerms[i]] = defaultPerTerm
                  else termAmountMap[visibleTerms[i]] = null
                }
                return visibleTerms.map((t) => {
                  const termAmount = termAmountMap[t] || 0
                  const checked = selectedTerms.includes(t)
                  const termPaid = fullyPaidTerms.includes(t) || paidTerms.includes(t)
                  return (
                    <label
                      key={t}
                      className={`flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg bg-white shadow-sm cursor-pointer transition-all hover:shadow-md ${
                        checked ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                          checked={checked}
                          disabled={termPaid}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedTerms((prev) => Array.from(new Set([...prev, t])))
                            else setSelectedTerms((prev) => prev.filter((x) => x !== t))
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-gray-900">{t} {termPaid && <span className="text-xs text-green-600 ml-2">(Paid)</span>}</div>
              <div className="text-xs sm:text-sm text-gray-600">{termAmount !== null ? <>
                {formatCurrency(termAmount)}{termRemaining && typeof termRemaining[t] === 'number' && termRemaining[t] > 0 ? <span className="text-xs text-red-600 ml-2">(Remaining {formatCurrency(termRemaining[t])})</span> : null}
              </> : <span className="text-gray-400 italic">Not set</span>}</div>
                        </div>
                      </div>
            <div className="text-sm sm:text-base font-bold text-gray-900 ml-2">{termAmount !== null ? formatCurrency(termAmount) : <span className="text-gray-400 italic">Not set</span>}</div>
                    </label>
                  )
                })
              })()}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <FaFileInvoiceDollar className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
              <span>Payment Transactions</span>
            </CardTitle>
            <CardDescription className="text-sm">Complete history of your payment transactions</CardDescription>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" onClick={() => setShowDisputesListModal(true)}>View disputes</Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {/* Summary (replaces floating sticky bar) - shows selected terms, amount and Pay Now */}
            {/* Summary - always show (compute selected amount even when schoolFee is missing) */}
            <div className="mb-4 p-3 border rounded bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2 w-full md:w-2/3">
                  <input
                    type="search"
                    title="Search payments"
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search reference, method, status or amount"
                    className="flex-1 px-3 py-2 border rounded bg-gray-50 text-sm"
                  />
                  <div className="flex items-center space-x-2">
                    <select title="Filter by session" value={filterSession} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterSession(e.target.value as string | 'all')} className="px-2 py-2 border rounded bg-white text-sm">
                      <option value="all">All sessions</option>
                      {sessionsList.length > 0 ? sessionsList.map((s) => (<option key={s.id} value={s.id}>{s.session}{s.active ? ' (current)' : ''}</option>)) : Array.from(new Set(payments.map((p) => p.session).filter(Boolean))).map((s) => (<option key={String(s)} value={String(s)}>{String(s)}</option>))}
                    </select>
                    <div title="Session filter matches the session text stored on each payment (e.g. 2025/2026). Using textual sessions avoids extra server polling." className="text-xs text-gray-500">?
                    </div>
                  </div>
                  <select title="Filter by class" value={filterClass} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterClass(e.target.value as string | 'all')} className="px-2 py-2 border rounded bg-white text-sm hidden sm:inline">
                    <option value="all">All classes</option>
                    {Array.from(new Set(payments.map((p) => p.class).filter(Boolean))) .map((c) => (
                      <option key={String(c)} value={String(c)}>{String(c)}</option>
                    ))}
                  </select>
                  <select title="Filter by term" value={filterTerm} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterTerm(e.target.value as string | 'all')} className="px-2 py-2 border rounded bg-white text-sm hidden md:inline">
                    <option value="all">All terms</option>
                    {Array.from(new Set((payments.flatMap((p) => Array.isArray(p.terms) ? p.terms || [] : [])).filter(Boolean))) .map((t) => (
                      <option key={String(t)} value={String(t)}>{String(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input title="From date" type="date" className="px-2 py-2 border rounded text-sm" value={dateFrom ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value || null)} />
                  <input title="To date" type="date" className="px-2 py-2 border rounded text-sm" value={dateTo ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value || null)} />
                  <select title="Sort payments" value={sortBy} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc')} className="px-2 py-2 border rounded bg-white text-sm">
                    <option value="date_desc">Date (newest)</option>
                    <option value="date_asc">Date (oldest)</option>
                    <option value="amount_desc">Amount (high)</option>
                    <option value="amount_asc">Amount (low)</option>
                  </select>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {selectedTerms.length > 0 ? (selectedTerms.length === 1 ? 'Your selected term fee' : 'Your selected terms fee') : 'Total amount'}
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 truncate">{formatCurrency(computeSelectedAmount() || 0)}</div>
                {selectedTerms.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1 truncate">{selectedTerms.join(', ')}</div>
                )}
                 {includePupil && <div className="text-xs text-gray-600 mt-1">Including pupil in payment</div>}
                 {termsFormatted.length > 0 && <div className="text-xs text-gray-600 mt-1">Available Terms: {termsFormatted.join(', ')}</div>}
              </div>
              <div className="flex-shrink-0 ml-4">
                  <Button onClick={createAndPay} className="bg-primary text-white px-6 py-2" disabled={
                    selectedTerms.length === 0 || selectedTerms.every((t) => fullyPaidTerms.includes(t)) || computeSelectedAmount() <= 0
                  }>
                  Pay Now
                </Button>
              </div>
            </div>
            {payments.length > 0 ? (
              <div>
                {/* Mobile: show stacked cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="bg-white rounded-lg shadow p-4">
                      <div className="grid grid-cols-2 gap-2 items-start">
                              <div className="min-w-0">
                                <div className="text-sm font-medium truncate">{formatCurrency(payment.amount)}</div>
                                <div className="text-xs text-gray-500 mt-1 truncate">{formatDateShort(payment.paid_at || payment.created_at)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">{getStatusBadge(payment.status)}</div>
                                <div className="text-xs text-gray-500 mt-1 truncate">{payment.payment_method || '-'}</div>
                              </div>
                            </div>
                        <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-mono text-gray-700 truncate">Ref: {payment.payment_reference}</div>
                        <div className="flex items-center gap-2">
                          {payment.status.toLowerCase() === "pending" && (
                            <Button size="sm" variant="outline" className="text-red-600 text-xs px-3 py-1" onClick={() => { setDisputePayment(payment); setShowDisputeModal(true) }}>Dispute</Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-blue-600 text-xs px-3 py-1" onClick={() => exportReceipt(payment)}>
                            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" /> Receipt
                          </Button>
                        </div>
                      </div>
                      </div>
                    ))}
                </div>

                {/* Desktop/tablet: keep the existing table */}
                <div className="hidden md:block overflow-x-auto -mx-3 sm:mx-0">
                  <div className="min-w-full inline-block align-middle">
                    <Table className="min-w-[600px] sm:min-w-full">
                      <TableHeader>
                        <TableRow>
                              <TableHead className="text-xs sm:text-sm font-medium text-right w-28">Amount</TableHead>
                              <TableHead className="text-xs sm:text-sm font-medium">Status</TableHead>
                              <TableHead className="text-xs sm:text-sm font-medium hidden sm:table-cell">Method</TableHead>
                              <TableHead className="text-xs sm:text-sm font-medium max-w-[160px]">Reference</TableHead>
                              <TableHead className="text-xs sm:text-sm font-medium hidden md:table-cell text-center w-40">Date</TableHead>
                              <TableHead className="text-xs sm:text-sm font-medium text-right w-36">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-xs sm:text-sm text-right">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                {getStatusIcon(payment.status)}
                                <div className="hidden sm:block">{getStatusBadge(payment.status)}</div>
                                <div className="sm:hidden text-xs font-medium capitalize">{payment.status}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline" className="capitalize text-xs">
                                {payment.payment_method}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs max-w-[160px] truncate text-left">
                              {payment.payment_reference}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 hidden md:table-cell text-center">
                              {formatDate(payment.paid_at || payment.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                                {payment.status.toLowerCase() === "pending" && (
                                        <Button size="sm" variant="outline" className="text-red-600 text-xs px-2 py-1 sm:px-3 sm:py-2" onClick={() => { setDisputePayment(payment); setShowDisputeModal(true) }} disabled={hasDispute(payment.id)}>
                                          {hasDispute(payment.id) ? 'Disputed' : 'Dispute'}
                                        </Button>
                                      )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 sm:px-3 sm:py-2"
                                  onClick={() => exportReceipt(payment)}
                                >
                                  <FaDownload className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                  <span className="hidden sm:inline">Receipt</span>
                                </Button>
                                {/* Image export removed — PDF-only flow */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <FaFileInvoiceDollar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Payment Records</h3>
                {schoolFee ? (
                  <div className="mt-4 space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-gray-600">Your current session fee</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {(() => {
                        const sfAny = schoolFee as unknown as Record<string, unknown>
                        const amounts = [
                          Number(sfAny["term1_amount"] ?? Number.NaN),
                          Number(sfAny["term2_amount"] ?? Number.NaN),
                          Number(sfAny["term3_amount"] ?? Number.NaN),
                        ]
                        const hasPerTerm = !isNaN(amounts[0]) || !isNaN(amounts[1]) || !isNaN(amounts[2])
                        let totalSelectedAmount = 0
                        if (selectedTerms.length > 0) {
                          if (hasPerTerm) {
                            totalSelectedAmount = selectedTerms.reduce((acc, term) => {
                              const idx = term === "Term 1" ? 0 : term === "Term 2" ? 1 : 2
                              return acc + (amounts[idx] || 0)
                            }, 0)
                          } else {
                            totalSelectedAmount = (schoolFee.amount || 0) * selectedTerms.length
                          }
                        }
                        return formatCurrency(selectedTerms.length ? totalSelectedAmount : (schoolFee.amount ?? 0))
                      })()}
                    </p>
                    <div>
                      <Button onClick={createAndPay} className="bg-primary text-white px-6 py-2 sm:px-8 sm:py-3">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-gray-500">You haven&apos;t made any payments yet.</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Payment history will appear here once transactions are made.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

          {/* PDF download only — modal removed */}

  {/* floating bottom bar removed — replaced with summary inside Payment Transactions card */}
      {/* disputes list modal */}
      {showDisputesListModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your disputes</h3>
              <div>
                <Button variant="ghost" onClick={() => setShowDisputesListModal(false)}>Close</Button>
              </div>
            </div>
            <div className="mt-4">
              {disputes.length === 0 ? (
                <div className="text-sm text-gray-600">No disputes found.</div>
              ) : (
                <div className="space-y-2">
                  {disputes.map((d: Record<string, unknown>) => {
                    const id = String(d.id ?? '')
                    const reason = String(d.reason ?? '')
                    const details = String(d.details ?? '')
                    const status = String(d.status ?? '')
                    const created_at = String(d.created_at ?? '')
                    return (
                      <div key={id} className="border p-3 rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{reason}</div>
                            <div className="text-sm text-gray-600">{details}</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Status: {status}</div>
                            <div className="text-xs text-gray-500">{created_at}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{toast.message}</div>
      )}

      {/* Dispute modal rendered inside page container */}
      {showDisputeModal && disputePayment ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <h3 className="text-lg font-semibold">Dispute Payment</h3>
            <p className="text-sm text-gray-600">Ref: {disputePayment.payment_reference} — {formatCurrency(disputePayment.amount)}</p>
            <div className="mt-3 space-y-2">
              <div>
                <label htmlFor="dispute-reason" className="text-xs font-medium">Reason</label>
                <input id="dispute-reason" placeholder="e.g. incorrect amount charged" aria-label="Dispute reason" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} className="w-full border px-2 py-2 rounded mt-1" />
              </div>
              <div>
                <label htmlFor="dispute-details" className="text-xs font-medium">Details</label>
                <textarea id="dispute-details" placeholder="Provide more details about the dispute" aria-label="Dispute details" value={disputeDetails} onChange={(e) => setDisputeDetails(e.target.value)} className="w-full border px-2 py-2 rounded mt-1" rows={4} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowDisputeModal(false)}>Cancel</Button>
              <Button onClick={() => submitDispute()} className="bg-primary text-white">Submit Dispute</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
