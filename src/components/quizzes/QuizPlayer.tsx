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
  const introAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Use WWTBAM-style sounds from trivia game
    correctAudio.current = new Audio('/correct.mp3')
    wrongAudio.current = new Audio('/wrong.mp3')
    introAudio.current = new Audio('/intro.mp3')
    correctAudio.current.load()
    wrongAudio.current.load()
    introAudio.current.load()
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white flex flex-col items-center justify-center p-6">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-6xl mb-4">🎯</motion.div>
        <h2 className="text-2xl font-bold">Loading Quiz...</h2>
      </div>
    )
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="bg-amber-900/30 backdrop-blur-md rounded-2xl p-8 max-w-md text-center border border-amber-600/50">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
          <p className="text-white/80 mb-6">{error || 'This quiz may have been removed or is not available.'}</p>
          <Link href="/quizzes" className="inline-block px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition">
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    )
  }

  // Show hero before questions start
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Game Show Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(2, 13, 48, 0.8)), url(/quiz-bg.jpeg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-amber-600/5 to-transparent blur-3xl opacity-30 z-0" />
        <div className="absolute inset-0 opacity-5 z-0">
          <div className="absolute top-20 left-10 w-40 h-40 border border-amber-600 rounded-full" />
          <div className="absolute bottom-32 right-10 w-56 h-56 border border-amber-600 rounded-full" />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Link href="/quizzes" className="flex items-center gap-2 text-white/70 hover:text-white transition mb-8 font-semibold">
            <FiArrowLeft /> Back to Quizzes
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-b from-slate-800/95 to-slate-900/95 rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-600/40 relative backdrop-blur-sm"
          >
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
            
            {/* Hero Image */}
            {quiz?.thumbnail_url && (
              <div className="relative w-full h-72 sm:h-96 bg-gradient-to-br from-slate-800 to-blue-900">
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold text-amber-500 mb-4 text-center"
              >
                {quiz?.title}
              </motion.h1>
              {quiz?.description && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-white/80 text-center mb-8 leading-relaxed"
                >
                  {quiz.description}
                </motion.p>
              )}
              
              {/* Quiz Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-br from-slate-700/50 to-blue-900/50 rounded-2xl border border-amber-600/30"
              >
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-amber-500">{questions.length}</p>
                  <p className="text-sm text-amber-400/80 font-semibold mt-1">Questions</p>
                </div>
                <div className="text-center border-l-2 border-r-2 border-amber-600/30">
                  <p className="text-4xl font-extrabold text-amber-500">{Math.round((questions.length * (quiz?.time_per_question || 20)) / 60)}</p>
                  <p className="text-sm text-amber-400/80 font-semibold mt-1">Minutes</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-amber-500">∞</p>
                  <p className="text-sm text-amber-400/80 font-semibold mt-1">Free</p>
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Play intro sound
                  if (soundEnabled) introAudio.current?.play().catch(() => {})
                  setStarted(true)
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-bold text-xl rounded-xl hover:shadow-2xl transition-all shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">🎮 Let&apos;s Begin →</span>
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
    const message = percentage === 100 ? '🏆 Perfect! You\'re a Champion!' : percentage >= 80 ? '🎉 Excellent Performance!' : percentage >= 60 ? '👍 Great Job!' : '💪 Keep Practicing'
    const isBig = percentage >= 60 // Show celebrations for 60% and above
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Game Show Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: isBig ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(2, 13, 48, 0.9)), url(/congrats.gif)' : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(2, 13, 48, 0.9))',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5 z-0">
          <div className="absolute top-20 right-10 w-80 h-80 border border-amber-600 rounded-full" />
          <div className="absolute bottom-20 left-10 w-96 h-96 border border-amber-600 rounded-full" />
        </div>

        <motion.div 
          initial={{ scale: 0, opacity: 0, rotate: -180 }} 
          animate={{ scale: 1, opacity: 1, rotate: 0 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-gradient-to-b from-slate-800/95 to-slate-900/95 rounded-3xl p-12 max-w-3xl text-center shadow-2xl border-2 border-amber-600/40 relative z-10 backdrop-blur-sm"
        >
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-t-3xl" />

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
            className="text-5xl font-extrabold text-amber-500 mb-4"
          >
            {message}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-amber-400/80 text-xl font-semibold mb-2">
              Final Score
            </p>
            <p className="text-5xl font-extrabold text-amber-500">
              {score} <span className="text-2xl text-amber-400/80">/ {questions.length}</span>
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-6 overflow-hidden shadow-lg border border-amber-600/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full shadow-lg"
            />
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold text-amber-400 mb-10"
          >
            {percentage}% <span className="text-xl text-amber-400/70">Accuracy</span>
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
              className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all shadow-lg border border-amber-400/20"
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
              <Link href="/quizzes" className="inline-block px-10 py-4 bg-slate-700 text-amber-400 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all shadow-lg border border-amber-600/30 hover:border-amber-500/50">
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
  const answerLetters = ['A', 'B', 'C', 'D']
  const answerColors = [
    { bg: 'from-emerald-600 to-emerald-700', border: 'border-emerald-500', hover: 'hover:from-emerald-500 hover:to-emerald-600' },
    { bg: 'from-blue-600 to-blue-700', border: 'border-blue-500', hover: 'hover:from-blue-500 hover:to-blue-600' },
    { bg: 'from-blue-600 to-blue-700', border: 'border-blue-500', hover: 'hover:from-blue-500 hover:to-blue-600' },
    { bg: 'from-orange-600 to-orange-700', border: 'border-orange-500', hover: 'hover:from-orange-500 hover:to-orange-600' },
  ]

  // Dynamic prize ladder based on number of questions with reasonable scaling
  const generatePrizeLadder = () => {
    const stages = []
    const totalQuestions = questions.length || 15
    const prizeValues = [
      100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 
      100000, 250000, 500000, 1000000, 2500000, 5000000
    ]
    
    for (let i = 1; i <= totalQuestions; i++) {
      // Use predefined values or scale linearly if more than 15 questions
      const points = prizeValues[i - 1] || (i * 1000000)
      stages.push({ level: i, points })
    }
    return stages
  }

  const prizeStages = generatePrizeLadder()
  const currentLevel = Math.min(score, prizeStages.length)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white overflow-hidden" style={{
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(2, 13, 48, 0.9)), url(/quiz-bg.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* MAIN QUIZ AREA - 75% */}
      <div className="flex-1 flex flex-col p-6 md:p-8 relative z-10 overflow-y-auto">
        {/* Top Section - Progress Bar & Timer */}
        <div className="flex items-start justify-between mb-8">
          {/* Center: Progress Bar (Full Width) */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div 
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: 1 }} 
              transition={{ duration: 0.5 }}
              className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden border-2 border-amber-600/50"
            >
              <motion.div 
                animate={{ width: `${progress}%` }} 
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full shadow-lg"
              />
            </motion.div>
          </div>

          {/* Right: Timer + Back + Sound */}
          <div className="flex items-center gap-4">
            {/* Timer */}
            <motion.div
              animate={{ 
                scale: timeLeft <= 5 ? [1, 1.15, 1] : 1,
                boxShadow: timeLeft <= 5 ? ['0 0 0 0px rgba(217,119,6,0.7)', '0 0 0 25px rgba(217,119,6,0)'] : 'none'
              }}
              transition={{ duration: timeLeft <= 5 ? 0.6 : 0.3, repeat: timeLeft <= 5 ? Infinity : 0 }}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-extrabold shadow-2xl transition-all border-4 flex-shrink-0 ${
                timeLeft <= 5 
                  ? 'bg-red-600 text-white border-red-400' 
                  : timeLeft <= 10
                  ? 'bg-orange-500 text-white border-orange-300'
                  : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-300'
              }`}
            >
              <span className="text-3xl">{timeLeft}</span>
              <span className="text-xs">sec</span>
            </motion.div>

            {/* Sound Toggle */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-amber-600/20 rounded-full hover:bg-amber-600/40 transition border border-amber-600/50"
            >
              {soundEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
            </motion.button>

            {/* Back Button */}
            <Link href="/quizzes" className="flex items-center gap-1 text-white/70 hover:text-amber-400 transition font-semibold text-sm">
              <FiArrowLeft size={16} /> Back
            </Link>
          </div>
        </div>

        {/* Middle Section - Question & Options */}
        <div className="flex-1 flex flex-col justify-center mt-8">
          <AnimatePresence>
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              {/* Question Box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 rounded-3xl border-3 border-amber-600/50 p-8 md:p-10 backdrop-blur-sm">
                  <p className="text-3xl md:text-4xl font-bold text-white text-center leading-tight">
                    {q.question_text}
                  </p>
                </div>
              </motion.div>

              {/* Answer Options - 2x2 GRID */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xl mx-auto">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === opt.id
                  const isCorrect = !!opt.is_correct
                  const showCorrect = showAnswer && isCorrect
                  const wrongSelected = showAnswer && isSelected && !isCorrect
                  const colors = answerColors[optIdx % 4]
                  
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: optIdx * 0.12 }}
                      whileHover={{ scale: showAnswer ? 1 : 1.05 }}
                      whileTap={{ scale: showAnswer ? 1 : 0.95 }}
                      onClick={() => !showAnswer && choose(opt.id)}
                      disabled={showAnswer}
                      className={`aspect-square rounded-2xl font-bold transition-all duration-300 border-3 overflow-hidden group flex flex-col items-center justify-center p-2 h-28 sm:h-32 md:h-36 ${
                        showCorrect
                          ? 'bg-emerald-600 border-emerald-400 shadow-2xl scale-105'
                          : wrongSelected
                          ? 'bg-red-600 border-red-400 shadow-xl opacity-50'
                          : isSelected && !showAnswer
                          ? `bg-gradient-to-br ${colors.bg} border-yellow-400 shadow-2xl scale-105`
                          : `bg-gradient-to-br ${colors.bg} border-white/30 shadow-xl ${!showAnswer ? colors.hover : ''}`
                      }`}
                    >

                      {/* Answer Text */}
                      <span className="text-center text-white leading-tight font-semibold text-xs sm:text-xs md:text-sm px-1">
                        {opt.option_text}
                      </span>

                      {/* Checkmark/X */}
                      <motion.span 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: showAnswer ? 1 : 0, rotate: showAnswer ? 0 : -180 }}
                        className="absolute bottom-1 right-1 text-lg sm:text-2xl"
                      >
                        {showCorrect ? '✓' : wrongSelected ? '✗' : ''}
                      </motion.span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Feedback Message */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 p-5 rounded-2xl text-center font-semibold"
              >
                {q.options.find((o) => o.id === selectedOption)?.is_correct ? (
                  <div className="bg-emerald-600/40 text-emerald-100 rounded-lg p-4 border-2 border-emerald-500/70 backdrop-blur-sm">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Correct!</span>
                  </div>
                ) : (
                  <div className="bg-red-600/40 text-red-100 rounded-lg p-4 border-2 border-red-500/70 backdrop-blur-sm">
                    <span className="text-2xl mr-3">❌</span>
                    <span>Incorrect. Answer: <strong>{q.options.find(o => o.is_correct)?.option_text}</strong></span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: Score Display */}
        <div className="mt-8 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full font-bold text-white shadow-lg border-2 border-amber-500/50 w-fit">
          <span className="text-lg">🏆 {score}/{questions.length}</span>
        </div>
      </div>

      {/* PRIZE LADDER - 25% */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-80 hidden md:flex flex-col relative z-10 pr-6 pb-6"
      >
        <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden border-3 border-amber-600/40 backdrop-blur-sm shadow-2xl h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 text-center border-b-3 border-amber-500/30">
            <p className="text-xs font-bold text-amber-50 uppercase tracking-widest">Prize Ladder</p>
          </div>

          {/* Prize Levels - Scrollable */}
          <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
            {prizeStages.map((stage, idx) => {
              const isCurrentLevel = idx + 1 === currentLevel
              const isPassed = idx < currentLevel
              
              return (
                <motion.div
                  key={stage.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={!isCurrentLevel ? { x: 5 } : {}}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-between border-2 flex-shrink-0 ${
                    isCurrentLevel
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-300 shadow-2xl scale-105'
                      : isPassed
                      ? 'bg-emerald-600/40 border-emerald-500/50'
                      : 'bg-slate-700/40 border-slate-600/40'
                  }`}
                >
                  <span className={`font-bold ${isCurrentLevel ? 'text-amber-50' : isPassed ? 'text-emerald-300' : 'text-white/70'}`}>
                    Q{stage.level}
                  </span>
                  <span className={`font-bold text-right ${isCurrentLevel ? 'text-amber-50' : isPassed ? 'text-emerald-300' : 'text-white/80'}`}>
                    ${stage.points < 1000000 
                      ? (stage.points / 1000).toFixed(0) + 'K'
                      : (stage.points / 1000000).toFixed(1) + 'M'
                    }
                  </span>
                  {isCurrentLevel && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ▶
                    </motion.span>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Current Prize */}
          <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-4 border-t-3 border-amber-600/30">
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wide mb-2">Current Prize</p>
            <p className="text-2xl font-extrabold text-amber-500">
              ${prizeStages[Math.max(0, currentLevel - 1)]?.points < 1000000
                ? '$' + (prizeStages[Math.max(0, currentLevel - 1)]?.points / 1000).toFixed(0) + 'K'
                : '$' + (prizeStages[Math.max(0, currentLevel - 1)]?.points / 1000000).toFixed(1) + 'M'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}