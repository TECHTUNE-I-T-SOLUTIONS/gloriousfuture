"use client"

import { useEffect, useState } from "react"
import { usePupil } from "../../pupil-context"
import { FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimes, FaReceipt, FaDownload } from "react-icons/fa"
import dynamic from "next/dynamic"
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
  const [selectedForReceipt, setSelectedForReceipt] = useState<Payment | null>(null)
  const [includePupil, setIncludePupil] = useState<boolean>(false) // New state for includePupil
  const [termsFormatted, setTermsFormatted] = useState<string[]>([]) // New state for formatted terms

  const ReceiptModal = dynamic(() => import("@/components/ReceiptModal"), { ssr: false })
  const [paidTerms, setPaidTerms] = useState<string[]>([])

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
          } catch (e) {
            console.error('paid terms parse error', e)
            setPaidTerms([])
          }
          setPayments(realPayments as Payment[])
          // always set schoolFee if provided by the API
          if (j.schoolFee) setSchoolFee(j.schoolFee)
          if (j.currentSession) setCurrentSession(j.currentSession)
           if (j.includePupil) setIncludePupil(j.includePupil) // Fetch includePupil from API
           if (j.termsFormatted) setTermsFormatted(j.termsFormatted) // Fetch formatted terms from API
        }
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [pupil?.uin])

  // helper to derive paid terms from payments array
  const computePaidTermsFromPayments = (paymentsArr: Payment[]) => {
    try {
      type PaymentWithTerms = Payment & { terms?: string[] }
      const paid: string[] = (paymentsArr as PaymentWithTerms[])
        .filter((p) => typeof p.status === 'string' && ["paid", "completed", "success"].includes(p.status.toLowerCase()))
        .flatMap((p) => (Array.isArray(p.terms) ? (p.terms as string[]) : []))
      const s = new Set<string>()
      for (const t of paid) s.add(t)
      return Array.from(s)
    } catch (e) {
      console.error('computePaidTermsFromPayments error', e)
      return []
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

  const getTotalPaid = () => {
    return payments
      .filter((p) => ["paid", "completed", "success"].includes(p.status.toLowerCase()))
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getPendingAmount = () => {
    return payments.filter((p) => p.status.toLowerCase() === "pending").reduce((sum, p) => sum + p.amount, 0)
  }

  const handlePayNow = async (paymentId: string) => {
    try {
      const res = await fetch("/api/pupils/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        console.error("init failed", j)
        return
      }
      const data = await res.json()

      const paystack = data?.paystack || data
      const returnedAmount = data?.amount || paystack?.data?.amount || paystack?.authorization?.amount
      const accessCode =
        paystack?.data?.authorization?.access_code ||
        paystack?.data?.reference ||
        paystack?.authorization?.access_code ||
        paystack?.authorization?.reference ||
        paystack?.data?.reference
      const authorizationUrl =
        paystack?.data?.authorization?.authorization_url ||
        paystack?.data?.authorization?.url ||
        paystack?.data?.authorization_url ||
        paystack?.authorization?.authorization_url ||
        paystack?.authorization?.url

      if (!returnedAmount || Number(returnedAmount) <= 0) {
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
        if (authorizationUrl) {
          window.open(authorizationUrl, "_blank")
          return
        }
        console.error("Paystack script not available and no authorization url")
        return
      }

      const onCloseHandler = () => {
        ;(async () => {
          try {
            const ref = data?.data?.reference || data?.data?.ref || accessCode
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
        (data?.data?.customer?.email as string) ||
        (data?.data?.customer_email as string) ||
        (pupil?.email as string) ||
        ""
      if (!setupEmail || !setupEmail.includes("@")) {
        console.error("Invalid email for Paystack:", setupEmail)
        window.alert("Missing or invalid email address for payment. Please ensure your profile has a valid email.")
        return
      }

      const amountForPaystack = Number(
        data?.amount ? Math.round(Number(data.amount) * 100) : paystack?.data?.amount || undefined,
      )

      const handler = (PaystackPop as unknown as PaystackSetup).setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: setupEmail,
        amount: amountForPaystack || undefined,
        ref: accessCode,
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
      const termsToSend = selectedTerms
      if (!termsToSend || termsToSend.length === 0) return window.alert("Please select one or more terms before paying")

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
          amountToPay = termsToSend.reduce((sum, t) => sum + (termAmounts[t] || 0), 0)
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
        window.alert('Unable to create payment: current session is not set. Please refresh the page and try again.')
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
        window.alert('Failed to create payment. See console for details.')
        return
      }
      const created = await res.json()
      if (created && created.id) {
        await handlePayNow(created.id)
      }
    } catch (err) {
      console.error("createAndPay error", err)
    }
  }

  const computeSelectedAmount = () => {
    // If we have a schoolFee, use it; otherwise compute a sensible fallback
    const sfAny = schoolFee as unknown as Record<string, unknown> | null
    if (sfAny) {
      const t1 = Number(sfAny["term1_amount"] ?? Number.NaN)
      const t2 = Number(sfAny["term2_amount"] ?? Number.NaN)
      const t3 = Number(sfAny["term3_amount"] ?? Number.NaN)
      const hasPerTerm = !isNaN(t1) || !isNaN(t2) || !isNaN(t3)
      if (selectedTerms.length === 0) return Number(sfAny["amount"] ?? schoolFee?.amount ?? 0)
      if (hasPerTerm) {
        return selectedTerms.reduce((sum, term) => {
          const idx = term === "Term 1" ? 0 : term === "Term 2" ? 1 : 2
          const vals = [t1, t2, t3]
          return sum + (vals[idx] || 0)
        }, 0)
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
                const defaultPerTerm = Math.round((totalAmount / visibleTerms.length) * 100) / 100
                const termAmountMap: Record<string, number> = {}
                for (let i = 0; i < visibleTerms.length; i++) {
                  const raw = rawTermVals[i]
                  const parsed = raw === undefined || raw === null ? NaN : Number(raw)
                  if (!isNaN(parsed) && parsed > 0) termAmountMap[visibleTerms[i]] = parsed
                  else termAmountMap[visibleTerms[i]] = defaultPerTerm
                }
                return visibleTerms.map((t) => {
                  const termAmount = termAmountMap[t] || 0
                  const checked = selectedTerms.includes(t)
                  const termPaid = paidTerms.includes(t)
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
              <div className="text-xs sm:text-sm text-gray-600">{formatCurrency(termAmount)}</div>
                        </div>
                      </div>
            <div className="text-sm sm:text-base font-bold text-gray-900 ml-2">{formatCurrency(termAmount)}</div>
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
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {/* Summary (replaces floating sticky bar) - shows selected terms, amount and Pay Now */}
            {/* Summary - always show (compute selected amount even when schoolFee is missing) */}
            <div className="mb-4 p-3 border rounded bg-white flex items-center justify-between">
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
                  selectedTerms.length === 0 || selectedTerms.every((t) => paidTerms.includes(t)) || computeSelectedAmount() <= 0
                }>
                  Pay Now
                </Button>
              </div>
            </div>
            {payments.length > 0 ? (
              <div>
                {/* Mobile: show stacked cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {payments.map((payment) => (
                    <div key={payment.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(payment.paid_at || payment.created_at)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{getStatusBadge(payment.status)}</div>
                          <div className="text-xs text-gray-500 mt-1">{payment.payment_method || '-'}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-mono text-gray-700 truncate">Ref: {payment.payment_reference}</div>
                        <div className="flex items-center gap-2">
                          {payment.status.toLowerCase() === "pending" && (
                            <Button size="sm" onClick={() => handlePayNow(payment.id)} className="bg-primary text-white text-xs px-3 py-1">Pay Now</Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-blue-600 text-xs px-3 py-1" onClick={() => setSelectedForReceipt(payment)}>
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
                          <TableHead className="text-xs sm:text-sm font-medium">Amount</TableHead>
                          <TableHead className="text-xs sm:text-sm font-medium">Status</TableHead>
                          <TableHead className="text-xs sm:text-sm font-medium hidden sm:table-cell">Method</TableHead>
                          <TableHead className="text-xs sm:text-sm font-medium">Reference</TableHead>
                          <TableHead className="text-xs sm:text-sm font-medium hidden md:table-cell">Date</TableHead>
                          <TableHead className="text-xs sm:text-sm font-medium text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-xs sm:text-sm">
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
                            <TableCell className="font-mono text-xs max-w-[100px] sm:max-w-none truncate">
                              {payment.payment_reference}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 hidden md:table-cell">
                              {formatDate(payment.paid_at || payment.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                                {payment.status.toLowerCase() === "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handlePayNow(payment.id)}
                                    className="bg-primary text-white text-xs px-2 py-1 sm:px-3 sm:py-2"
                                  >
                                    Pay Now
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 sm:px-3 sm:py-2"
                                  onClick={() => setSelectedForReceipt(payment)}
                                >
                                  <FaDownload className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                  <span className="hidden sm:inline">Receipt</span>
                                </Button>
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

      {selectedForReceipt && (
        <ReceiptModal payment={selectedForReceipt} open={true} onClose={() => setSelectedForReceipt(null)} />
      )}

  {/* floating bottom bar removed — replaced with summary inside Payment Transactions card */}
    </div>
  )
}
