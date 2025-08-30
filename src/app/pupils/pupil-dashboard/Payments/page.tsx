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
          setPayments(await res.json())
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
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <FaDownload className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
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
                <p className="text-gray-500">You haven&apos;t made any payments yet.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Payment history will appear here once transactions are made.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
