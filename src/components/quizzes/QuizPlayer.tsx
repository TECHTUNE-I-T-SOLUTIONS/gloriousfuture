"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiVolume2, FiVolumeX } from 'react-icons/fi'

type Option = { id: string; option_text: string; is_correct?: boolean; order_index?: number }
type Question = { id: string; question_text: string; order_index: number; time_limit_seconds?: number; options: Option[] }

export default function QuizPlayer({ quizId }: { quizId: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<any | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const correctAudio = useRef<HTMLAudioElement | null>(null)
  const wrongAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    correctAudio.current = new Audio('/correct.mp3')
    wrongAudio.current = new Audio('/wrong.mp3')
    correctAudio.current.load()
    wrongAudio.current.load()
  }, [])

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!quizId) throw new Error('Quiz ID not provided')
        const res = await fetch(`/api/public/quizzes/${quizId}`)
        if (!res.ok) throw new Error('Quiz not found or not available')
        const data = await res.json()
        if (!data.quiz || !data.questions) throw new Error('Invalid quiz data')
        setQuiz(data.quiz)
        setQuestions(data.questions || [])
        setIndex(0)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quiz'
        setError(message)
        console.error('Quiz load error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (quizId) fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (!questions || questions.length === 0) return
    const q = questions[index]
    const ttl = q?.time_limit_seconds ?? quiz?.time_per_question ?? 20
    setTimeLeft(ttl)
    setSelectedOption(null)
    setShowAnswer(false)
  }, [index, questions, quiz])

  useEffect(() => {
    if (finished || !questions || questions.length === 0 || showAnswer) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [questions, index, showAnswer, finished])

  const playSound = (which: 'correct' | 'wrong') => {
    if (!soundEnabled) return
    try {
      if (which === 'correct') correctAudio.current?.play().catch(() => {})
      else wrongAudio.current?.play().catch(() => {})
    } catch {
      // ignore play errors
    }
  }

  const handleTimeout = () => {
    setShowAnswer(true)
    playSound('wrong')
    setTimeout(() => nextQuestion(), 1600)
  }

  const choose = (optionId: string) => {
    if (showAnswer) return
    setSelectedOption(optionId)
    setShowAnswer(true)
    const q = questions[index]
    const opt = q.options.find((o) => o.id === optionId)
    if (opt?.is_correct) {
      setScore((s) => s + 1)
      playSound('correct')
    } else {
      playSound('wrong')
    }
    setTimeout(() => nextQuestion(), 1200)
  }

  const nextQuestion = () => {
    if (index + 1 >= questions.length) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
  }

  const restart = () => {
    setStarted(false)
    setIndex(0)
    setScore(0)
    setFinished(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-6xl mb-4">🎯</motion.div>
        <h2 className="text-2xl font-bold">Loading Quiz...</h2>
      </div>
    )
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
          <p className="text-white/80 mb-6">{error || 'This quiz may have been removed or is not available.'}</p>
          <Link href="/quizzes" className="inline-block px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition">
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    )
  }

  // Show hero before questions start
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-indigo-500 to-indigo-800 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <Link href="/quizzes" className="flex items-center gap-2 text-white/80 hover:text-white transition mb-8">
            <FiArrowLeft /> Back to Quizzes
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Hero Image */}
            {quiz?.thumbnail_url && (
              <div className="relative w-full h-72 sm:h-96 bg-gradient-to-br from-indigo-400 to-purple-500">
                <Image
                  src={quiz.thumbnail_url}
                  alt={quiz.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
              >
                {quiz?.title}
              </motion.h1>
              {quiz?.description && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-indigo-700 text-justify mb-8 leading-relaxed"
                >
                  {quiz.description}
                </motion.p>
              )}
              
              {/* Quiz Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
              >
                <div className="text-center">
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{questions.length}</p>
                  <p className="text-sm text-indigo-600 font-semibold mt-1">Questions</p>
                </div>
                <div className="text-center border-l-2 border-r-2 border-indigo-200">
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{Math.round((questions.length * (quiz?.time_per_question || 20)) / 60)}</p>
                  <p className="text-sm text-indigo-600 font-semibold mt-1">Minutes</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">∞</p>
                  <p className="text-sm text-indigo-600 font-semibold mt-1">Free</p>
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStarted(true)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold text-xl rounded-xl hover:shadow-2xl transition-all shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Let's Begin →</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Finished state (Results)
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    const message = percentage === 100 ? '🏆 Perfect!' : percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '💪 Keep Practicing'
    const color = percentage === 100 ? 'from-yellow-400 to-yellow-600' : percentage >= 80 ? 'from-indigo-600 to-purple-600' : percentage >= 60 ? 'from-blue-600 to-indigo-600' : 'from-orange-600 to-red-600'
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-indigo-500 to-indigo-800 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated confetti-like background */}
        <div className="absolute top-0 right-0 w-full h-full">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div 
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        <motion.div 
          initial={{ scale: 0, opacity: 0, rotate: -180 }} 
          animate={{ scale: 1, opacity: 1, rotate: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 max-w-3xl text-center shadow-2xl border border-white/20 relative z-10"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-9xl mb-6"
          >
            {percentage === 100 ? '🏆' : percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${color} mb-4`}
          >
            {message}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-indigo-700 text-3xl font-extrabold mb-2">
              Final Score
            </p>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {score} <span className="text-2xl text-indigo-600">/ {questions.length}</span>
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden shadow-lg">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${color} rounded-full`}
            />
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold text-indigo-700 mb-10"
          >
            {percentage}% <span className="text-xl text-indigo-600">Accuracy</span>
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restart} 
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all shadow-lg"
            >
              🔄 Try Again
            </motion.button>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/quizzes" className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all shadow-lg">
                ← Back to Quizzes
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  const q = questions[index]
  const progress = ((index + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col min-h-screen">
        {/* Header with Score */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/quizzes" className="flex items-center gap-2 text-white/70 hover:text-white transition font-semibold">
            <FiArrowLeft /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-md rounded-full text-sm font-bold text-white shadow-lg">
              <span>🏆 Score: {score}/{questions.length}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition border border-white/20"
            >
              {soundEnabled ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
            </motion.button>
          </div>
          <div className="text-right font-extrabold">
            <span className="text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Q{index + 1}</span>
            <span className="text-white/50">/{questions.length}</span>
          </div>
        </div>

        {/* Progress bar with animation */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ duration: 0.5 }}
          className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden origin-left shadow-lg border border-white/10"
        >
          <motion.div 
            animate={{ width: `${progress}%` }} 
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-full shadow-lg"
          />
        </motion.div>

        {/* Main Quiz Container - Full Height Flex */}
        <AnimatePresence>
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-16 border border-white/10"
          >
            {/* Timer - Top Right */}
            <div className="mb-12 flex justify-end">
              <motion.div
                animate={{ 
                  scale: timeLeft <= 5 ? [1, 1.2, 1] : 1,
                  boxShadow: timeLeft <= 5 ? ['0 0 0 0px rgba(239,68,68,0.7)', '0 0 0 30px rgba(239,68,68,0)'] : 'none'
                }}
                transition={{ duration: timeLeft <= 5 ? 0.6 : 0.3, repeat: timeLeft <= 5 ? Infinity : 0 }}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center font-extrabold shadow-2xl transition-all border-2 ${
                  timeLeft <= 5 
                    ? 'bg-red-600 text-white border-red-400' 
                    : timeLeft <= 10
                    ? 'bg-yellow-500 text-white border-yellow-300'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-cyan-300'
                }`}
              >
                <span className="text-3xl">{timeLeft}</span>
                <span className="text-xs opacity-90">seconds</span>
              </motion.div>
            </div>

            {/* Question Text - Centered */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-16 text-center"
            >
              <p className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                {q.question_text}
              </p>
            </motion.div>

            {/* Options Grid - 2x2 Modern Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedOption === opt.id
                const isCorrect = !!opt.is_correct
                const showCorrect = showAnswer && isCorrect
                const wrongSelected = showAnswer && isSelected && !isCorrect
                const notAnsweredButWrong = showAnswer && !isSelected && !isCorrect && selectedOption === null
                
                return (
                  <motion.button
                    key={opt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: optIdx * 0.1 }}
                    whileHover={{ scale: showAnswer ? 1 : 1.08 }}
                    whileTap={{ scale: showAnswer ? 1 : 0.93 }}
                    onClick={() => !showAnswer && choose(opt.id)}
                    disabled={showAnswer}
                    className={`p-6 md:p-7 rounded-3xl text-center lg:text-left font-bold text-base md:text-lg transition-all duration-300 border-3 relative overflow-hidden group transform ${
                      showCorrect
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300 shadow-2xl scale-105'
                        : wrongSelected
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400 shadow-xl'
                        : notAnsweredButWrong
                        ? 'bg-gray-400 text-gray-600 border-gray-500 opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-cyan-300 shadow-xl scale-102'
                        : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/60 hover:shadow-xl backdrop-blur-sm'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: optIdx * 0.1 + 0.1 }}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-extrabold text-base md:text-lg bg-white/30 flex-shrink-0 backdrop-blur-sm border border-white/50"
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </motion.div>
                      <span className="flex-grow leading-relaxed text-left">{opt.option_text}</span>
                      <motion.span 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: showAnswer ? 1 : 0, rotate: showAnswer ? 0 : -180 }}
                        className="text-3xl flex-shrink-0"
                      >
                        {showCorrect ? '✓' : wrongSelected ? '✗' : ''}
                      </motion.span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 p-6 rounded-2xl text-center font-semibold text-lg border-2"
                >
                  {q.options.find((o) => o.id === selectedOption)?.is_correct ? (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 rounded-xl p-5 border border-green-400/50 backdrop-blur-sm">
                      <span className="text-2xl mr-2">✅</span>
                      <span>Correct! Well done!</span>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-200 rounded-xl p-5 border border-red-400/50 backdrop-blur-sm">
                      <span className="text-2xl mr-2">❌</span>
                      <span>Incorrect. The correct answer is: <strong>{q.options.find(o => o.is_correct)?.option_text}</strong></span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}