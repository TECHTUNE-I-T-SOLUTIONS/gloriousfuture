"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingUp, Users, Award, Filter, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ExamResult {
  id: string
  student: string
  subject: string
  score: number
  maxScore?: number
  examDate?: string
  grade?: string
}

interface Attempt {
  id: string
  pupil_id?: string
  score?: number
  submitted_at?: string | null
  answers?: unknown
  pupils?: Record<string, unknown> | null
}

export default function TeacherExamResults() {
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attemptsOpen, setAttemptsOpen] = useState(false)
  const [attemptsError, setAttemptsError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({})
  const [attemptsPage, setAttemptsPage] = useState(0)
  const [attemptsTotal, setAttemptsTotal] = useState(0)
  const [currentExamId, setCurrentExamId] = useState<string | null>(null)
  const pageSize = 20

  // fetch attempts when modal is open or page/exam changes
  useEffect(() => {
    const fetchAttempts = async () => {
      if (!attemptsOpen || !currentExamId) return
      setAttemptsError(null)
      try {
        const res = await fetch(`/api/teacher/exam-attempts?examId=${encodeURIComponent(currentExamId)}&limit=${pageSize}&offset=${attemptsPage * pageSize}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })

        const text = await res.text()
        let parsed: unknown
        try {
          parsed = JSON.parse(text)
        } catch (parseErr) {
          console.error('Failed to parse attempts response', parseErr, text)
          throw new Error('Invalid server response')
        }

        const payload = parsed as { success?: boolean; attempts?: Attempt[]; total?: number; error?: string }
        if (!payload.success) throw new Error(payload.error || 'Unknown error')
        setAttempts(payload.attempts || [])
        setAttemptsTotal(Number(payload.total || 0))
        // clamp page
        const lastPage = Math.max(0, Math.ceil(Number(payload.total || 0) / pageSize) - 1)
        if (attemptsPage > lastPage) setAttemptsPage(lastPage)
      } catch (err) {
        console.error('Exam attempts error', err)
        setAttempts([])
        setAttemptsTotal(0)
        setAttemptsError(String((err as Error).message || err))
      }
    }

    fetchAttempts()
    // re-run when attemptsOpen, attemptsPage or currentExamId changes
  }, [attemptsOpen, attemptsPage, currentExamId])

  useEffect(() => {
    const fetchResults = async () => {
      try {
  const res = await fetch("/api/teacher/exam-results", { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch results")

        const data = await res.json()

        if (Array.isArray(data)) {
          // Enhance data with additional properties for better UI
          const enhancedData = data.map((result, index) => ({
            ...result,
            maxScore: 100,
            examDate: new Date(Date.now() - index * 86400000).toISOString(),
            grade: getGrade(result.score),
          }))
          setResults(enhancedData)
        } else {
          setResults([])
        }
      } catch (error) {
        console.error("Error fetching exam results:", error)
        setError("Failed to load exam results.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const getGrade = (score: number): string => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800"
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      case "D":
        return "bg-orange-100 text-orange-800"
      case "F":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0, passRate: 0 }

    const scores = results.map((r) => r.score)
    const average = scores.reduce((a, b) => a + b, 0) / scores.length
    const highest = Math.max(...scores)
    const lowest = Math.min(...scores)
    const passRate = (scores.filter((s) => s >= 60).length / scores.length) * 100

    return { average, highest, lowest, passRate }
  }

  const stats = calculateStats()

  const groupBySubject = () => {
    const grouped = results.reduce(
      (acc, result) => {
        if (!acc[result.subject]) {
          acc[result.subject] = []
        }
        acc[result.subject].push(result)
        return acc
      },
      {} as Record<string, ExamResult[]>,
    )

    return Object.entries(grouped).map(([subject, results]) => ({
      subject,
      results,
      average: results.reduce((sum, r) => sum + r.score, 0) / results.length,
      count: results.length,
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // (attempt fetching is handled by the single useEffect defined above)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Exam Results
          </h1>
          <p className="text-gray-500 mt-2">View and analyze student performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border bg-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.average.toFixed(1)}%</div>
            <Progress value={stats.average} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Highest Score</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.highest}%</div>
            <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Pass Rate</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.passRate.toFixed(1)}%</div>
            <Progress value={stats.passRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Results</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{results.length}</div>
            <p className="text-xs text-gray-500 mt-1">Exam submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="by-subject">By Subject</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {error ? (
            <Card className="border-border bg-card">
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-red-500">{error}</p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No exam results available</h3>
                <p className="text-gray-500">Results will appear here once exams are completed</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <Card key={result.id} className="border-border bg-card">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-card-foreground">{result.student}</CardTitle>
                    <Badge variant="secondary">{result.subject}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Score</span>
                      <span className="text-2xl font-bold text-foreground">
                        {result.score}/{result.maxScore || 100}
                      </span>
                    </div>
                    <Progress value={result.score} className="h-2 mt-2" />
                    {result.examDate && (
                      <p className="text-xs text-gray-500 mt-2">{new Date(result.examDate).toLocaleDateString()}</p>
                    )}
                  </CardContent>
                  <div className="p-3 border-t">
                    <Button size="sm" onClick={() => {
                      // open modal for this exam's attempts
                      setAttemptsOpen(true)
                      setAttemptsPage(0)
                      // prefer cbt_exam_id (from exam_results) if available, otherwise fall back to result.id
                      setCurrentExamId(((result as unknown) as Record<string, unknown>)['cbt_exam_id'] as string || result.id)
                    }}>View Attempts</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-subject" className="space-y-6">
          {groupBySubject().map(({ subject, results, average, count }) => (
            <Card key={subject} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground">{subject}</CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{count} students</Badge>
                    <Badge variant="outline">Avg: {average.toFixed(1)}%</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((result) => (
                    <div key={result.id} className="p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{result.student}</span>
                        <Badge className={getGradeColor(result.grade || "F")} variant="secondary">
                          {result.grade}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Score</span>
                        <span className="font-bold text-foreground">{result.score}%</span>
                      </div>
                      <Progress value={result.score} className="mt-2 h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    
      <Dialog open={attemptsOpen} onOpenChange={setAttemptsOpen}>
        <DialogContent className="max-w-3xl p-4">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Exam Attempts</h3>
            <div>
              <Button size="sm" variant="ghost" onClick={() => setAttemptsOpen(false)}>Close</Button>
            </div>
          </div>
          <div className="space-y-3 p-2 max-h-[60vh] overflow-auto">
            {attempts.length === 0 && !attemptsError && (
              <div className="text-sm text-gray-500">No attempts found for this exam.</div>
            )}
            {attemptsError && (
              <div className="text-sm text-red-600">{attemptsError}</div>
            )}
            {attempts.map((a) => {
              const pupil = (a.pupils ?? null) as Record<string, unknown> | null
                const displayName = String(pupil?.full_name || pupil?.name || a.pupil_id || 'Unknown Student')
                const lastName = ''
              const submitted = a.submitted_at ? new Date(String(a.submitted_at)).toLocaleString() : '—'
              const score = typeof a.score === 'number' ? `${a.score}%` : '-'
              const answers = a.answers as unknown as Record<string, unknown> | string | null;
              return (
                <div key={String(a.id)} className="p-3 border rounded bg-background">
                  <div className="flex flex-col md:flex-row md:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{displayName}{lastName ? ` ${lastName}` : ''}</div>
                      <div className="text-sm text-gray-500">Submitted: {submitted}</div>
                    </div>
                    <div className="w-40 flex-shrink-0 text-right">
                      <div className="font-bold text-lg">{score}</div>
                    </div>
                  </div>
                  {answers && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold mb-1">Answers</div>
                        <Button size="sm" variant="ghost" onClick={() => setOpenAnswers((s) => ({ ...s, [String(a.id)]: !s[String(a.id)] }))}>
                          {openAnswers[String(a.id)] ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      {openAnswers[String(a.id)] && (
                        <div className="space-y-2 mt-2">
                          {typeof answers === 'object' && answers !== null ? (
                            // support both arrays and plain objects. If answers is an array we want 1-based numbering;
                            // if it's an object with numeric keys ("0","1"...) convert to 1-based too.
                            Array.isArray(answers)
                              ? (answers as unknown[]).map((ans, i) => (
                                  <div key={i} className="text-xs bg-slate-50 p-2 rounded border">
                                    <div className="font-medium">Question {i + 1}</div>
                                    <div className="whitespace-pre-wrap text-sm">{String(ans)}</div>
                                  </div>
                                ))
                              : Object.entries(answers as Record<string, unknown>).map(([q, ans]) => {
                                  // if the key is a number ("0","1") display it as 1-based, otherwise show the key
                                  const numericKey = /^\d+$/.test(q) ? String(Number(q) + 1) : q
                                  return (
                                    <div key={q} className="text-xs bg-slate-50 p-2 rounded border">
                                      <div className="font-medium">Question {numericKey}</div>
                                      <div className="whitespace-pre-wrap text-sm">{String(ans)}</div>
                                    </div>
                                  )
                                })
                          ) : (
                            <div className="text-xs bg-slate-50 p-2 rounded border">{String(answers)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-500">Total: {attemptsTotal}</div>
              <div className="space-x-2">
                {/** compute lastPage from attemptsTotal */}
                {(() => {
                  const lastPage = Math.max(0, Math.ceil(attemptsTotal / pageSize) - 1)
                  return (
                    <>
                      <Button disabled={attemptsPage <= 0} onClick={() => { if (attemptsPage > 0) setAttemptsPage(attemptsPage - 1) }}>Prev</Button>
                      <Button disabled={attemptsPage >= lastPage} onClick={() => { if (attemptsPage < lastPage) setAttemptsPage(attemptsPage + 1) }}>Next</Button>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
