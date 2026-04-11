"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { RecursivePartial, IOptions } from '@tsparticles/engine'
import CustomHeader from '@/components/CustomHeader'
import QuizCard from '@/components/quizzes/QuizCard'
import CustomFooter from '@/components/CustomFooter'
import Link from 'next/link'

export default function PublicQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [init, setInit] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all')

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  useEffect(() => {
    let mounted = true
    const fetchList = async () => {
      try {
        const res = await fetch('/api/public/quizzes')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (mounted) setQuizzes(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchList()
    return () => {
      mounted = false
    }
  }, [])

  // Filter quizzes based on selected filters
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const difficultyMatch = selectedDifficulty === 'all' || q.difficulty_level === selectedDifficulty
      const ageMatch = selectedAgeGroup === 'all' || q.age_group === selectedAgeGroup
      return difficultyMatch && ageMatch
    })
  }, [quizzes, selectedDifficulty, selectedAgeGroup])

  const particlesOptions = useMemo<RecursivePartial<IOptions>>(
    () => ({
      background: { color: '#4338ca' },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: 'push' },
          onHover: { enable: true, mode: 'repulse' },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: '#e0e7ff' },
        links: {
          color: '#e0e7ff',
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          outModes: { default: 'out' as const },
          random: false,
          speed: 2,
          straight: false,
        },
        number: { density: { enable: true }, value: 100 },
        opacity: { value: 0.3 },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }),
    [],
  )

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-200 via-indigo-500 to-indigo-800 flex flex-col">
      {init && (
        <Particles id="particles-quizzes" options={particlesOptions} className="absolute top-0 left-0 w-full h-full z-0" />
      )}

      <CustomHeader />

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-30 px-6 relative z-10 flex-1">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-indigo-100 drop-shadow-lg mb-4"
          >
            Public Quizzes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-indigo-200 mt-4 max-w-3xl mx-auto"
          >
            Challenge yourself with curated quizzes — enjoy interactive learning with immediate feedback and scoring.
          </motion.p>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto mb-16">
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-200"
          >
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Filter Quizzes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-indigo-700 mb-3">Difficulty Level</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'easy', 'medium', 'hard'].map((level) => (
                    <motion.button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full font-semibold transition-all ${
                        selectedDifficulty === level
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                          : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Age Group Filter */}
              <div>
                <label className="block text-sm font-semibold text-indigo-700 mb-3">Age Group</label>
                <div className="flex flex-wrap gap-2">
                  {['all', '6-8', '8-10', '10-12', '12-14'].map((age) => (
                    <motion.button
                      key={age}
                      onClick={() => setSelectedAgeGroup(age)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full font-semibold transition-all ${
                        selectedAgeGroup === age
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                          : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
                      }`}
                    >
                      {age === 'all' ? 'All Ages' : `${age} yrs`}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-indigo-600 font-semibold mt-4">
              Showing {filteredQuizzes.length} of {quizzes.length} quizzes
            </p>
          </motion.div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/90 rounded-2xl h-64 animate-pulse shadow-lg"
                />
              ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto shadow-xl border border-indigo-200">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl mb-6"
                >
                  🔍
                </motion.div>
                <h2 className="text-3xl font-bold text-indigo-900 mb-3">No Quizzes Found</h2>
                <p className="text-indigo-700 text-lg mb-8">
                  Try adjusting your filters or check back soon for more quizzes!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedDifficulty('all')
                    setSelectedAgeGroup('all')
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredQuizzes.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-indigo-200 hover:shadow-2xl transition-all duration-300 h-full">
                    <QuizCard quiz={q} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Stats Banner (if quizzes exist) */}
        {!loading && quizzes.length > 0 && (
          <motion.section
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl p-8 m-6 bg-gradient-to-r from-[#4237C7] to-[#9AA6FA] text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                    Challenge Yourself Today
                  </h2>
                  <p className="text-white/90 max-w-2xl">
                    Pick any quiz, answer the questions, earn points, and track your progress towards mastery.
                  </p>
                </div>

                <div className="w-full md:w-auto">
                  <div className="bg-white/10 rounded-lg p-4 text-sm backdrop-blur-sm">
                    <div className="text-xl font-semibold">{quizzes.length}</div>
                    <div className="text-white/80 text-xs">Quizzes Available</div>
                  </div>
                </div>
              </div>

              <motion.div
                className="pointer-events-none absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-white/6 blur-3xl"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              />
            </div>
          </motion.section>
        )}
      </motion.main>

      <CustomFooter />
    </div>
  )
}
