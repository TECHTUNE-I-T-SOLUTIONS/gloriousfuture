"use client"

import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { Draggable, DragDropContext, Droppable } from "@hello-pangea/dnd"
import CartoonQuiz from "../components/CartoonQuiz"
import CustomHeader from "../components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

// Custom Alert Component
const CustomAlert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 6000) // auto-dismiss after 6s
    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-xl"
    >
      <div className="flex items-start gap-4 bg-red-600/95 text-white px-4 py-3 rounded-lg shadow-lg ring-1 ring-black/10 transition-all duration-300">
        <span className="flex-shrink-0 mt-0.5">
          <svg
            className="h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-.993.883L9 7v4a1 1 0 001.993.117L11 11V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        <div className="flex-1 text-sm leading-snug">
          <strong className="block text-sm font-semibold">Notification</strong>
          <span className="block mt-0.5">{message}</span>
        </div>

        <div className="flex items-start">
          <button
            onClick={onClose}
            aria-label="Dismiss notification"
            className="ml-3 inline-flex p-1 rounded-md text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false)
  const [gameImages, setGameImages] = useState<string[]>([])
  const [init, setInit] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [flippedCards, setFlippedCards] = useState<boolean[]>(Array(9).fill(false))
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [showGoodJob, setShowGoodJob] = useState(false)
  const [showGreatJob, setShowGreatJob] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowMainContent(true), 6000)
    fetchGameImages()
  }, [])

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  // Local image data (kept as initial state so drag order persists)
  const initialImageList = [
    { id: "1", src: "/images/gallery/learning.jpg", title: "Learning in Action" },
    { id: "2", src: "/images/gallery/games.jpg", title: "Fun & Games" },
    { id: "3", src: "/images/gallery/computer-training.jpg", title: "Computer Training" },
    { id: "4", src: "/images/gallery/study.jpg", title: "Focused Study" },
    { id: "5", src: "/images/gallery/sports.jpg", title: "Sports & Athletics" },
    { id: "6", src: "/images/gallery/classroom.jpg", title: "Interactive Classroom" },
    { id: "7", src: "/images/gallery/library.jpg", title: "Library Sessions" },
    { id: "8", src: "/images/gallery/reading.jpg", title: "Reading Time" },
    { id: "9", src: "/images/gallery/writing.jpg", title: "Creative Writing" },
    { id: "10", src: "/images/gallery/music.jpg", title: "Music & Instrumental" },
    { id: "11", src: "/images/gallery/art.jpg", title: "Art & Drawing" },
    { id: "12", src: "/images/gallery/science-lab.jpg", title: "Science Lab Experiments" },
    { id: "13", src: "/images/gallery/coding-class.jpg", title: "Coding & Programming" },
    { id: "14", src: "/images/gallery/mathematics.jpg", title: "Mathematics Practice" },
    { id: "15", src: "/images/gallery/geography.jpg", title: "Exploring Geography" },
    { id: "16", src: "/images/gallery/history.jpg", title: "History Lessons" },
    { id: "17", src: "/images/gallery/chemistry.jpg", title: "Chemistry Experiments" },
    { id: "18", src: "/images/gallery/physics.jpg", title: "Physics in Action" },
    { id: "19", src: "/images/gallery/biology.jpg", title: "Biology & Nature Study" },
    { id: "20", src: "/images/gallery/group-study.jpg", title: "Collaborative Learning" },
  ]
  const [imageList, setImageList] = useState(initialImageList)
  
  // Testimonials for carousel
  const testimonials = [
    {
      quote: "Glorious Future Academy has been a wonderful place for my child — warm teachers and clear feedback that helps at home.",
      author: "Mrs. A.",
      role: "Parent",
    },
    {
      quote: "Teachers here have more time to teach and connect with pupils; the tools make admin simple and dependable.",
      author: "Mr. K.",
      role: "Teacher",
    },
    {
      quote: "I still remember the clubs and projects that inspired me — GFA gave me the confidence to explore.",
      author: "S. (Alumnus)",
      role: "Alumnus",
    },
  ]
  const [testiIndex, setTestiIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTestiIndex((i) => (i + 1) % testimonials.length), 4500)
    return () => clearInterval(t)
  }, [testimonials.length])

  const fetchGameImages = async (): Promise<void> => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Check your internet connection.")
      return
    }

    try {
      const response = await fetch("/api/game-images")

      if (!response.ok) {
        throw new Error("Failed to fetch game images")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setGameImages(data.images)
      setFlippedCards(Array(data.images.length).fill(false))
      setMatchedCards([])
      setSelectedCards([])
    } catch (error) {
      console.error("Error fetching game images:", error)
      setAlertMessage("Unable to load game images. Please try again later.")
    }
  }

  const toggleCard = (index: number): void => {
    if (selectedCards.length < 3 && !flippedCards[index]) {
      const newSelected = [...selectedCards, index]
      const newFlipped = [...flippedCards]
      newFlipped[index] = true
      setFlippedCards(newFlipped)
      setSelectedCards(newSelected)

      if (newSelected.length === 3) {
        setTimeout(() => checkMatch(newSelected), 1000)
      }
    }
  }

  const checkMatch = (selected: number[]): void => {
    const [a, b, c] = selected
    if (gameImages[a] === gameImages[b] && gameImages[b] === gameImages[c]) {
      setMatchedCards([...matchedCards, ...selected])
      setShowGoodJob(true)
      setTimeout(() => setShowGoodJob(false), 1000)
    } else {
      const resetFlipped = [...flippedCards]
      selected.forEach((i: number): void => {
        resetFlipped[i] = false
      })
      setFlippedCards(resetFlipped)
    }
    setSelectedCards([])

    if (matchedCards.length + 3 === gameImages.length) {
      setTimeout(() => {
        setShowGreatJob(true)
        setTimeout(() => {
          setShowGreatJob(false)
          fetchGameImages()
        }, 2000)
      }, 1000)
    }
  }

  const particlesOptions = useMemo(
    () => ({
      background: { color: "#4338ca" },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#e0e7ff" },
        links: {
          color: "#e0e7ff",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          outModes: { default: "out" as const },
          random: false,
          speed: 2,
          straight: false,
        },
        number: { density: { enable: true }, value: 100 },
        opacity: { value: 0.3 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }),
    [],
  )

  // Puzzle Game Component
  function PuzzleGame() {
    const galleryImages = [
      "/images/gallery/learning.jpg",
      "/images/gallery/games.jpg",
      "/images/gallery/computer-training.jpg",
      "/images/gallery/study.jpg",
      "/images/gallery/sports.jpg",
      "/images/gallery/classroom.jpg",
      "/images/gallery/library.jpg",
      "/images/gallery/reading.jpg",
      "/images/gallery/writing.jpg",
      "/images/gallery/music.jpg",
      "/images/gallery/art.jpg",
      "/images/gallery/science-lab.jpg",
      "/images/gallery/coding-class.jpg",
      "/images/gallery/mathematics.jpg",
      "/images/gallery/geography.jpg",
      "/images/gallery/history.jpg",
      "/images/gallery/chemistry.jpg",
      "/images/gallery/physics.jpg",
      "/images/gallery/biology.jpg",
      "/images/gallery/group-study.jpg",
    ]
    const [image, setImage] = useState(galleryImages[Math.floor(Math.random() * galleryImages.length)])
    const initialTiles = useMemo(() => {
      const arr = [...Array(8).keys()].map((i) => i + 1)
      arr.push(0)
      return arr
    }, [])

    function shuffle(arr: number[]): number[] {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
    const [tiles, setTiles] = useState<number[]>(() => shuffle(initialTiles))
    const [solved, setSolved] = useState(false)

    useEffect(() => {
      setSolved(tiles.join() === initialTiles.join())
    }, [tiles, initialTiles])

    function moveTile(idx: number) {
      const emptyIdx = tiles.indexOf(0)
      const row = Math.floor(idx / 3),
        col = idx % 3
      const emptyRow = Math.floor(emptyIdx / 3),
        emptyCol = emptyIdx % 3
      if (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
      ) {
        const newTiles = tiles.slice()
        ;[newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]]
        setTiles(newTiles)
      }
    }

    function resetPuzzle() {
      setTiles(shuffle(initialTiles))
      setSolved(false)
      setImage(galleryImages[Math.floor(Math.random() * galleryImages.length)])
    }

    return (
      <div className="mt-16 text-center mb-10">
        <h2 className="text-4xl font-bold text-indigo-200 mb-6">🧩 Puzzle Challenge</h2>
        <div className="inline-block bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-indigo-200">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-60 h-60 relative rounded-xl overflow-hidden">
            {tiles.map((tile, idx) =>
              tile !== 0 ? (
                <button
                  key={tile}
                  className="w-20 h-20 p-0 border-2 border-indigo-300 focus:outline-none hover:border-indigo-500 transition-colors"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "180px 180px",
                    backgroundPosition: `${(-(tile - 1) % 3) * 60}px ${-Math.floor((tile - 1) / 3) * 60}px`,
                  }}
                  onClick={() => !solved && moveTile(idx)}
                  aria-label={`Tile ${tile}`}
                />
              ) : (
                <div key={tile + "-" + idx} className="w-20 h-20 bg-indigo-100" />
              ),
            )}
          </div>
          {solved && <div className="mt-4 text-green-600 font-bold text-lg">🎉 Puzzle Solved! Amazing! 🎉</div>}
          <button
            onClick={resetPuzzle}
            className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg"
          >
            New Puzzle
          </button>
        </div>
        <div className="mt-4 text-indigo-200 text-sm">Arrange the tiles to form the complete image.</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-200 via-indigo-500 to-indigo-800 flex flex-col">
      {init && (
        <Particles id="particles-bg" options={particlesOptions} className="absolute top-0 left-0 w-full h-full z-0" />
      )}

      <CustomHeader />

      {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />}

      {/* Welcome Screen */}
      {!showMainContent ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-screen text-center text-indigo-200 z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/apple-touch-icon.png"
              alt="School Logo"
              width={120}
              height={120}
              priority
              className="z-10 rounded-2xl shadow-2xl"
            />
          </motion.div>
          <motion.h1
            className="text-5xl font-bold mt-6 text-indigo-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Glorious Future Academy
          </motion.h1>
          <motion.p
            className="text-2xl mt-4 text-indigo-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            Welcome to a brighter future of learning at Glorious Future Academy! 🎉
          </motion.p>
          <div className="mt-8 max-w-6xl mx-auto text-center text-indigo-100">
            <h3 className="text-2xl font-semibold mb-3">What we do</h3>
            <p className="text-lg text-indigo-200 mb-4">
              At Glorious Future Academy we combine warm, child-centered teaching with modern tools to support learning.
              We make it simple for teachers to create assessments, track student progress, and share clear feedback with
              families — all designed to showcase the strengths of our school and help each pupil thrive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <div className="font-semibold">Improve Learning</div>
                  <div className="text-sm text-indigo-300">Assessment and feedback that supports pupil progress</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧑‍🏫</span>
                <div className="text-left">
                  <div className="font-semibold">Support Teachers</div>
                  <div className="text-sm text-indigo-300">Tools that save time and free teachers to teach</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏫</span>
                <div className="text-left">
                  <div className="font-semibold">Showcase Our School</div>
                  <div className="text-sm text-indigo-300">Share achievements, events and the life of GFA with families</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 px-6 relative z-10">
          <section className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold text-indigo-100 drop-shadow-lg mb-4"
            >
              Welcome to Glorious Future Academy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-indigo-200 mt-4 max-w-3xl mx-auto"
            >
                  A place where learning is joyful, creative, and focused on the growth of every child.
            </motion.p>
          </section>

          <section className="max-w-7xl mx-auto mb-16 z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-indigo-200 text-center mb-8"
            >
              📸 Our School Moments
            </motion.h2>

            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return
                const src = result.source.index
                const dest = result.destination.index
                if (src === dest) return
                const next = Array.from(imageList)
                const [moved] = next.splice(src, 1)
                next.splice(dest, 0, moved)
                setImageList(next)
              }}
            >
              <Droppable droppableId="images">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {imageList.map((image, index) => (
                      <Draggable key={image.id} draggableId={String(image.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transform transition duration-300 ${snapshot.isDragging ? 'z-50 scale-105' : ''}`}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              whileHover={{ scale: 1.03 }}
                              className="bg-white/90 group backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-200 hover:shadow-2xl transition-all duration-300"
                            >
                              <div className="relative w-full h-56 overflow-hidden">
                                <Image
                                  src={image.src || "/placeholder.svg"}
                                  alt={image.title}
                                  width={600}
                                  height={360}
                                  className="object-cover w-full h-full transform transition duration-500 group-hover:scale-105 group-hover:filter-none filter grayscale contrast-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <div className="p-6 text-center">
                                <h2 className="text-xl font-semibold text-indigo-900">{image.title}</h2>
                                <p className="text-sm text-indigo-600 mt-2">Drag to reorder gallery</p>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          {/* Polished animated banner with CTA and stats */}
          <section className="mx-auto w-full max-w-6xl px-4">
            <motion.div
              className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-[#4237C7] to-[#9AA6FA] text-white shadow-2xl"
              initial={{ opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: [0, 1], y: [8, 0], scale: [0.995, 1] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <motion.h2
                    className="text-3xl md:text-4xl font-extrabold leading-tight"
                    initial={{ x: -8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    Nurturing curious minds. Supporting our teachers.
                  </motion.h2>

                  <motion.p
                    className="mt-3 text-white/90 max-w-2xl"
                    initial={{ x: -6, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    At Glorious Future Academy we use thoughtful digital tools to streamline routine tasks, provide
                    meaningful insights into pupil progress, and share clear, timely feedback with families — so our
                    teachers can focus on learning.
                  </motion.p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 bg-white text-[#4237C7] px-4 py-2 rounded-lg font-medium shadow-sm hover:translate-y-[-2px] transition-transform"
                    >
                      Request Demo
                    </a>
                    <a
                      href="#features"
                      className="inline-flex items-center gap-2 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                      Explore Features
                    </a>
                  </div>
                </div>

                <div className="w-full md:w-72">
                  <motion.div
                    className="bg-white/10 rounded-lg p-4 text-sm"
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/80">Our Community</div>
                        <div className="text-lg font-semibold mt-1">Glorious Future Academy</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/80">Average improvement</div>
                        <div className="text-lg font-semibold mt-1">+12%</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-white/80">A modern approach to assessments and school communications.</div>
                  </motion.div>
                </div>
              </div>

              {/* subtle floating accent */}
              <motion.div
                className="pointer-events-none absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-white/6 blur-3xl"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>

            {/* quick stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-lg text-white">
                <div className="text-sm text-white/80">Students</div>
                <div className="text-2xl font-bold">1,200+</div>
                <div className="text-xs text-white/80 mt-1">Active learners at Glorious Future Academy</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-white">
                <div className="text-sm text-white/80">Assessments</div>
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-xs text-white/80 mt-1">Assessments created and safely delivered</div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-white">
                <div className="text-sm text-white/80">Engagement</div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-xs text-white/80 mt-1">Average pupil engagement rate</div>
              </div>
            </div>

            {/* Testimonial carousel */}
            <div className="mt-6">
              <motion.div
                key={testiIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
                className="bg-white/6 p-6 rounded-xl text-white max-w-4xl mx-auto"
              >
                <p className="text-lg italic text-white/95">“{testimonials[testiIndex].quote}”</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{testimonials[testiIndex].author}</div>
                    <div className="text-xs text-white/80">{testimonials[testiIndex].role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestiIndex(i)}
                        aria-label={`Show testimonial ${i + 1}`}
                        className={`w-2 h-2 rounded-full ${i === testiIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="text-center mt-16 relative">
            {showGoodJob && (
              <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-xl py-3 rounded-xl z-10">
                🎉 Good Job! 🎉
              </div>
            )}
            {showGreatJob && (
              <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-xl py-3 rounded-xl z-10">
                🌟 Great Job! Restarting... 🌟
              </div>
            )}

            <h2 className="text-4xl font-bold text-indigo-200 mb-8">🎮 Memory Card Game</h2>
            <div className="inline-block bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-indigo-200">
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {gameImages.map((image, index) => (
                  <button
                    key={index}
                    className="bg-indigo-100 hover:bg-indigo-200 p-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    onClick={() => toggleCard(index)}
                  >
                    {flippedCards[index] || matchedCards.includes(index) ? (
                      <Image
                        src={image || "/placeholder.svg"}
                        alt="Memory"
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    ) : (
                      <span className="text-4xl">❓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="text-center mt-20">
            <h2 className="text-4xl font-bold text-indigo-200 mb-8">🌟 School Features & Activities</h2>

            <div className="relative overflow-hidden h-48 w-full max-w-5xl mx-auto text-xl font-semibold text-indigo-200 bg-indigo-800/50 backdrop-blur-sm rounded-2xl flex items-center">
              <motion.div
                className="absolute w-full text-center"
                animate={{ y: ["100%", "-100%"] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <p className="mb-6">🏅 Sports Competitions & Games</p>
                <p className="mb-6">💻 Computer Training & Coding Classes</p>
                <p className="mb-6">📚 Extra Lessons & Tutoring</p>
                <p className="mb-6">🎨 Arts, Music & Creativity Programs</p>
                <p className="mb-6">🔬 Science Club & Innovation Hub</p>
                <p className="mb-6">🚀 Space & Astronomy Club</p>
              </motion.div>
            </div>

            <h3 className="text-3xl font-bold text-indigo-200 mt-16 mb-8">🖥️ Our Website Features</h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
              }}
            >
              {[
                { icon: "🔒", title: "Secure Exams", desc: "High-level security measures to prevent cheating." },
                { icon: "📜", title: "Curriculum Viewing", desc: "Easily access the academic curriculum anytime." },
                {
                  icon: "📊",
                  title: "Results & Report Cards",
                  desc: "View and print results directly from your profile.",
                },
                { icon: "📝", title: "Assignments & Projects", desc: "Submit and track assignments online." },
                { icon: "📷", title: "Pupil Profile Access", desc: "Manage student profiles securely with ease." },
                { icon: "👨‍🏫", title: "Virtual Learning", desc: "Attend lessons online with interactive tools." },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-indigo-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-600 hover:bg-indigo-700/80 transition-all duration-300"
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-indigo-200 mb-3">{feature.title}</h4>
                  <p className="text-indigo-300">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <CartoonQuiz />
          <PuzzleGame />
        </motion.main>
      )}

      <CustomFooter />
    </div>
  )
}
