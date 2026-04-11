"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { FaClock, FaQuestionCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type Question = { question: string; options?: string[] }
type Exam = { id: string; title?: string; subject?: string; duration?: number; questions?: Question[] }

export default function MainCBTExams() {
  // navigation is handled via dashboard events; router not required here
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  // refs to keep stable access to current state from timers/listeners
  const examRef = useRef<Exam | null>(exam)
  const answersRef = useRef<{ [key: number]: string }>(answers)
  useEffect(() => {
    examRef.current = exam
  }, [exam])
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // stable submit function that reads current values from refs
  const submitExam = useCallback(async () => {
    try {
      const currentExam = examRef.current
      const currentAnswers = answersRef.current
      await fetch("/api/pupils/submit-exam", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: currentExam?.id, answers: currentAnswers }),
      })

      sessionStorage.removeItem("activeExam")
      // use dashboard event to switch back to CBT list
      window.dispatchEvent(new CustomEvent("pupil-set-active-page", { detail: { page: "cbt-exams" } }))
    } catch (error) {
      console.error("Error submitting exam:", error)
    }
  }, [])

  useEffect(() => {
    // disable right-click while taking exam
    const contextHandler = (event: Event) => event.preventDefault()
    document.addEventListener("contextmenu", contextHandler)

    const storedExam = sessionStorage.getItem("activeExam")
    if (!storedExam) {
      // navigate back to the CBT list via dashboard event
      window.dispatchEvent(new CustomEvent("pupil-set-active-page", { detail: { page: "cbt-exams" } }))
      document.removeEventListener("contextmenu", contextHandler)
      return
    }

    const examData = JSON.parse(storedExam)
    setExam(examData)
    setTimeLeft((examData.duration || 0) * 60)

    // timer that reads and updates state; calls stable submitExam when time's up
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // call stable submit function
          void submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      document.removeEventListener("contextmenu", contextHandler)
    }
  }, [submitExam])

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }))
  }

  

  // Keyboard shortcuts: A/B/C/D to select options, ArrowLeft/Right for prev/next, Enter to submit when on last
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!exam) return
      const key = e.key.toLowerCase()
      // map a,b,c,d
      if (["a", "b", "c", "d"].includes(key)) {
        const index = ["a", "b", "c", "d"].indexOf(key)
        const option = exam.questions?.[currentQuestion]?.options?.[index]
        if (option) handleAnswerChange(currentQuestion, option)
      }

      if (key === "arrowleft") {
        setCurrentQuestion(Math.max(0, currentQuestion - 1))
      }
      if (key === "arrowright") {
        setCurrentQuestion(Math.min((exam.questions?.length || 1) - 1, currentQuestion + 1))
      }

      if (key === "enter") {
        if (currentQuestion === (exam.questions?.length || 1) - 1) {
          setShowSubmitDialog(true)
        } else {
          setCurrentQuestion(currentQuestion + 1)
        }
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [exam, currentQuestion, answers])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getProgressPercentage = () => {
    if (!exam?.questions) return 0
    return (getAnsweredCount() / exam.questions.length) * 100
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Timer and Progress */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-xl border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">{exam.title}</h1>
              <p className="text-blue-200/70 text-sm">Subject: {exam.subject}</p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <FaClock className={`w-5 h-5 ${timeLeft < 300 ? "text-red-400 animate-pulse" : "text-cyan-400"}`} />
                <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? "text-red-400" : "text-cyan-300"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-sm text-blue-200/70">Progress:</span>
                <div className="w-32">
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-white">
                  {getAnsweredCount()}/{exam.questions?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 rounded-2xl shadow-xl p-6 sticky top-24 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-6">
                <FaQuestionCircle className="text-cyan-400 text-xl" />
                <h3 className="text-lg font-bold text-white">Questions</h3>
              </div>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {exam.questions?.map((_: unknown, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`
                      w-10 h-10 rounded-xl text-xs font-bold transition-all duration-200 transform
                      ${
                        currentQuestion === index
                          ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg scale-110"
                          : answers[index]
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-0 shadow-md"
                            : "bg-white/10 text-white/60 hover:bg-white/20 border border-white/20"
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg"></div>
                  <span className="text-white/80">Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg"></div>
                  <span className="text-white/80">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white/10 border border-white/20 rounded-lg"></div>
                  <span className="text-white/60">Not answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl shadow-2xl p-8 min-h-screen flex flex-col">
              {/* Header with Progress */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-bold text-lg">
                      Q{currentQuestion + 1}/{exam.questions?.length || 0}
                    </span>
                  </div>
                  {answers[currentQuestion] && (
                    <Badge className="bg-green-400 text-green-900 border-0">
                      <FaCheckCircle className="w-3 h-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Answered: {Object.values(answers).filter(Boolean).length}/{exam.questions?.length || 0}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-8 backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-orange-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / (exam.questions?.length || 1)) * 100}%` }}
                />
              </div>

              {/* Question Section */}
              {exam.questions?.[currentQuestion] && (
                <>
                  <div className="mb-12 flex-grow flex flex-col justify-center">
                    {/* Question Text */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
                      <p className="text-white text-2xl md:text-3xl font-bold leading-relaxed text-center">
                        {exam.questions[currentQuestion].question}
                      </p>
                    </div>

                    {/* Options Grid - 2x2 Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {exam.questions[currentQuestion].options?.map((opt: unknown, optIndex: number) => {
                        const option = String(opt ?? "")
                        const isSelected = answers[currentQuestion] === option
                        const optionLabel = String.fromCharCode(65 + optIndex) // A, B, C, D
                        
                        return (
                          <button
                            key={optIndex}
                            onClick={() => handleAnswerChange(currentQuestion, option)}
                            className={`
                              relative group p-6 rounded-2xl font-bold text-lg transition-all duration-300 transform
                              border-2 backdrop-blur-sm
                              ${isSelected 
                                ? 'bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 border-yellow-200 shadow-lg scale-105' 
                                : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-102'
                              }
                              focus:outline-none focus:ring-2 focus:ring-white/50
                              active:scale-95
                            `}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`
                                flex-shrink-0 w-10 h-10 rounded-full font-bold text-lg
                                flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                  : 'bg-white/20 text-white'
                                }
                              `}>
                                {optionLabel}
                              </div>
                              <span className="text-left flex-1 leading-relaxed">
                                {option}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center gap-4 mt-12 pt-8 border-t border-white/20">
                    <Button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-semibold backdrop-blur-sm transition-all"
                    >
                      ← Previous
                    </Button>

                    <div className="space-x-3 flex">
                      {currentQuestion < (exam.questions?.length || 0) - 1 ? (
                        <Button
                          onClick={() => setCurrentQuestion(currentQuestion + 1)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-300 hover:to-cyan-300 text-blue-900 rounded-full font-semibold transition-all shadow-lg"
                        >
                          Next →
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setShowSubmitDialog(true)} 
                          className="px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 text-green-900 rounded-full font-bold text-lg transition-all shadow-lg"
                        >
                          Submit Exam ✓
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-amber-500" />
                <span>Submit Exam?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to submit your exam? You have answered{" "}
                <span className="font-semibold">{getAnsweredCount()}</span> out of{" "}
                <span className="font-semibold">{exam.questions?.length || 0}</span> questions.
              </p>

              {getAnsweredCount() < (exam.questions?.length || 0) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 text-sm">
                    <FaExclamationTriangle className="inline w-4 h-4 mr-1" />
                    You have unanswered questions. Once submitted, you cannot make changes.
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button onClick={() => setShowSubmitDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={submitExam} className="flex-1 bg-green-500 hover:bg-green-600">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
