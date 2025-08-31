"use client"

import { useEffect, useState } from "react"
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
}

export default function Payments() {
  const { pupil } = usePupil()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFee, setSchoolFee] = useState<{ amount: number; id?: string } | null>(null)
  const [currentSession, setCurrentSession] = useState<string | null>(null)

  useEffect(() => {
    const uin = typeof pupil?.uin === "string" ? pupil.uin : undefined
    if (!uin) {
      setLoading(false)
      return
    }
    const fetchPayments = async () => {
      try {
  const res = await fetch(`/api/pupils/payments?uin=${encodeURIComponent(uin)}`, { credentials: "include" })
        if (res.ok) {
          const j = await res.json()
          // { payments, schoolFee, currentSession }
          setPayments((j.payments || []) as Payment[])
          if (j.schoolFee && typeof j.schoolFee.amount === 'number') setSchoolFee({ amount: j.schoolFee.amount, id: j.schoolFee.id })
          if (j.currentSession) setCurrentSession(j.currentSession)
        }
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [pupil?.uin])

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
      const res = await fetch('/api/pupils/paystack/init', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId }) })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        console.error('init failed', j)
        return
      }
      const data = await res.json()
      // expected: { authorization_url }
      const url = data.authorization_url || data.url || data.authorization?.authorization_url
      if (!url) {
        console.error('no authorization url', data)
        return
      }
      window.open(url, '_blank')
    } catch (err) {
      console.error('pay init error', err)
    }
  }

  const createAndPay = async () => {
    try {
      if (!pupil) return
      if (!schoolFee || !currentSession) return console.error('missing fee or session')
      // create payment record
      const body = {
        uin: pupil.uin,
        amount: schoolFee.amount,
        class: pupil.class || undefined,
        session: currentSession,
      }
      const res = await fetch('/api/pupils/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) return console.error('failed to create payment')
      const created = await res.json()
      // now init
      if (created && created.id) {
        await handlePayNow(created.id)
      }
    } catch (err) {
      console.error('createAndPay error', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500 rounded-lg">
            <FaFileInvoiceDollar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h1>
            <p className="text-gray-600">Track your school fees and payment transactions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{formatCurrency(getTotalPaid())}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FaClock className="w-5 h-5 text-amber-500" />
                <span className="text-2xl font-bold text-amber-600">{formatCurrency(getPendingAmount())}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FaReceipt className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{payments.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FaFileInvoiceDollar className="text-pink-500" />
              <span>Payment Transactions</span>
            </CardTitle>
            <CardDescription>Complete history of your payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            {getStatusBadge(payment.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payment.payment_method}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payment.payment_reference}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(payment.paid_at || payment.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {payment.status.toLowerCase() === 'pending' && (
                              <Button size="sm" onClick={() => handlePayNow(payment.id)} className="bg-primary text-white">
                                Pay Now
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => {
                                // open printable receipt window
                                const win = window.open('', '_blank', 'noopener,noreferrer')
                                if (!win) return
                                const html = `
                                  <html>
                                    <head>
                                      <title>Payment Receipt</title>
                                      <style>
                                        body{font-family: Arial, Helvetica, sans-serif; padding:20px}
                                        .header{display:flex;align-items:center;gap:12px}
                                        .logo{width:80px;height:80px;object-fit:contain}
                                        .title{font-size:18px;font-weight:700}
                                        .muted{color:#666}
                                        .details{margin-top:20px;border:1px solid #eee;padding:12px;border-radius:8px}
                                        .row{display:flex;justify-content:space-between;padding:6px 0}
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <img src="/logo.png" class="logo" alt="School Logo" />
                                        <div>
                                          <div class="title">Glorious Future School</div>
                                          <div class="muted">Payment Receipt</div>
                                        </div>
                                      </div>
                                      <div class="details">
                                        <div class="row"><div><strong>Amount</strong></div><div>${formatCurrency(payment.amount)}</div></div>
                                        <div class="row"><div><strong>Status</strong></div><div>${payment.status}</div></div>
                                        <div class="row"><div><strong>Method</strong></div><div>${payment.payment_method || '-'}</div></div>
                                        <div class="row"><div><strong>Reference</strong></div><div>${payment.payment_reference || '-'}</div></div>
                                        <div class="row"><div><strong>Paid At</strong></div><div>${payment.paid_at || payment.created_at || '-'}</div></div>
                                      </div>
                                      <div style="margin-top:20px;font-size:12px;color:#666">This is a system generated receipt. Contact the school for enquiries.</div>
                                      <script>window.onload = function(){ setTimeout(()=>{ window.print(); }, 200); }</script>
                                    </body>
                                  </html>
                                `
                                win.document.open()
                                win.document.write(html)
                                win.document.close()
                              }}
                            >
                              <FaDownload className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaFileInvoiceDollar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Records</h3>
                {schoolFee ? (
                  <div className="mt-4">
                    <p className="text-gray-600">Your current session fee</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(schoolFee.amount)}</p>
                    <div className="mt-4">
                      <Button onClick={createAndPay} className="bg-primary text-white">Pay Now</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500">You haven&apos;t made any payments yet.</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Payment history will appear here once transactions are made.
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
