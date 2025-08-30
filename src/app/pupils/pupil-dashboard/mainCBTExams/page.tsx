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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Timer and Progress */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600 text-sm">Subject: {exam.subject}</p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <FaClock className={`w-5 h-5 ${timeLeft < 300 ? "text-red-500" : "text-blue-500"}`} />
                <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? "text-red-500" : "text-blue-500"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-32">
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-700">
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
            <Card className="shadow-lg border-0 sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FaQuestionCircle className="text-blue-500" />
                  <span>Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {exam.questions?.map((_: unknown, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          currentQuestion === index
                            ? "bg-blue-500 text-white shadow-md"
                            : answers[index]
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <span>Not answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 p-4">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm">
                    Question {currentQuestion + 1} of {exam.questions?.length || 0}
                  </Badge>
                  {answers[currentQuestion] && (
                    <Badge className="bg-green-100 text-green-700">
                      <FaCheckCircle className="w-3 h-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {exam.questions?.[currentQuestion] && (
                  <>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {exam.questions[currentQuestion].question}
                      </p>
                    </div>

                    <RadioGroup
                      value={answers[currentQuestion] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
                      className="space-y-3"
                    >
                      {exam.questions[currentQuestion].options?.map((opt: unknown, optIndex: number) => {
                        const option = String(opt ?? "")
                        return (
                        <div
                          key={optIndex}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem value={option} id={`option-${optIndex}`} className="text-blue-500" />
                          <Label
                            htmlFor={`option-${optIndex}`}
                            className="flex-1 cursor-pointer text-gray-700 leading-relaxed"
                          >
                            {/* show a), b), c), d) prefixes for clarity */}
                            <span className="font-semibold mr-2">{String.fromCharCode(97 + optIndex)})</span>
                            {option}
                          </Label>
                        </div>
                        )
                      })}
                    </RadioGroup>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t">
                      <Button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        variant="outline"
                      >
                        Previous
                      </Button>

                      <div className="space-x-3">
                        {currentQuestion < (exam.questions?.length || 0) - 1 ? (
                          <Button
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Next
                          </Button>
                        ) : (
                          <Button onClick={() => setShowSubmitDialog(true)} className="bg-green-500 hover:bg-green-600">
                            Submit Exam
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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
