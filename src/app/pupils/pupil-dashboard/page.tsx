"use client"

import React, { useEffect, useState } from "react"
import PupilContext, { PupilType } from "../pupil-context"
import Sidebar from "@/components/Sidebar"
import AnimatedHeader from "@/components/AnimatedHeader"
import DashboardCard from "@/components/DashboardCard"
import Assignments from "./Assignments/page"
import ProgrammingCourses from "@/components/ProgrammingCourses"
import ProgrammingLessons from "@/components/ProgrammingLessons"
import Timetable from "./Timetable/page"
import ExamResults from "./ExamResults/page"
import Messages from "./Messages/page"
import CBTExams from "./CBTExams/page"
import MainCBTExams from "./mainCBTExams/page"
import TestsQuizzes from "./TestsQuizzes/page"
import AlertsBlogs from "./AlertsBlogs/page"
import Profile from "./Profile/page"
import Payments from "./Payments/page"
import PupilDashboardNotifications from "./notifications/page"
import {
  FaBook,
  FaCalendarAlt,
  FaFileAlt,
  FaEnvelope,
  FaLaptopCode,
  FaClipboardList,
  FaUser,
  FaBell,
} from "react-icons/fa"
import { motion } from "framer-motion"

// use shared PupilContext from ../pupil-context
// ...existing code... (no local usePupil hook needed here)

function ResponsiveDashboard({
  renderPage,
  setActivePage,
}: { renderPage: () => React.ReactNode; setActivePage: (p: string) => void }) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(260)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarWidth(mobile ? 0 : 260)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  function handleSidebarToggle(isOpen: boolean) {
    if (!isMobile) {
      setSidebarWidth(isOpen ? 260 : 70)
    }
  }

  const contentMarginClass = isMobile ? "ml-0" : sidebarWidth === 260 ? "ml-[260px]" : "ml-[70px]"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <AnimatedHeader text="Welcome to Your Dashboard" />
      </div>

      {/* Sidebar */}
      <Sidebar setActivePage={setActivePage} onToggle={handleSidebarToggle} />

      {/* Main Content */}
      <motion.div
        className={`
          transition-all duration-300 ease-in-out
          pt-16 md:pt-20 p-4 md:p-6 lg:p-8
          ${contentMarginClass}
          min-h-screen
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto mt-10 sm:mt-10 md:mt-10">{renderPage()}</div>
      </motion.div>
    </div>
  )
}

export default function PupilDashboard() {
  const [pupil, setPupil] = useState<PupilType>(null)
  const [activePage, setActivePage] = useState("dashboard")
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  // Dashboard analytics state
  const [summary, setSummary] = useState({
    assignments: 0,
    cbtExams: 0,
    messages: 0,
    results: 0,
    tests: 0,
  })

  useEffect(() => {
    const fetchPupilDetails = async () => {
      try {
        const res = await fetch("/api/pupils/details?self=1", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setPupil(data)
        }
      } catch (error) {
        console.error("Error fetching pupil details:", error)
      }
    }
    fetchPupilDetails()
  }, [])

  useEffect(() => {
    // Fetch dashboard analytics
  async function fetchSummary() {
      try {
        const [assignmentsRes, cbtExamsRes, messagesRes, resultsRes, testsRes] = await Promise.all([
      fetch("/api/pupils/assignments", { credentials: "include" }),
      fetch("/api/pupils/cbt-exams", { credentials: "include" }),
      fetch("/api/messages", { credentials: "include" }),
      fetch("/api/exam-results", { credentials: "include" }),
      fetch("/api/tests-quizzes", { credentials: "include" }),
        ])
        const assignments = assignmentsRes.ok ? await assignmentsRes.json() : []
        const cbtExams = cbtExamsRes.ok ? await cbtExamsRes.json() : []
        const messages = messagesRes.ok ? await messagesRes.json() : []
        const results = resultsRes.ok ? await resultsRes.json() : []
        const tests = testsRes.ok ? await testsRes.json() : []
        setSummary({
          assignments: assignments.length,
          cbtExams: cbtExams.length,
          messages: messages.length,
          results: results.length,
          tests: tests.length,
        })
      } catch (err) {
        // fallback: do nothing
        console.error("Error fetching summary:", err)
      }
    }
    if (activePage === "dashboard") fetchSummary()
  }, [activePage])

  // Function to dynamically load the selected page
  const renderPage = () => {
    switch (activePage) {
      case "notifications":
        return <PupilDashboardNotifications />
      case "assignments":
        return <Assignments />
      case "programming-courses":
        return <ProgrammingCourses onStartLesson={(courseId) => {
          setSelectedCourseId(courseId)
          setActivePage("programming-lessons")
        }} />
      case "programming-lessons":
        return selectedCourseId ? (
          <ProgrammingLessons 
            courseId={selectedCourseId}
            onBack={() => setActivePage("programming-courses")}
          />
        ) : (
          <ProgrammingCourses onStartLesson={(courseId) => {
            setSelectedCourseId(courseId)
            setActivePage("programming-lessons")
          }} />
        )
      case "timetable":
        return <Timetable />
      case "exam-results":
        return <ExamResults />
      case "messages":
        return <Messages />
      case "cbt-exams":
        return <CBTExams />
      case "maincbtexams":
        return <MainCBTExams />
      case "tests":
        return <TestsQuizzes />
      case "profile":
        return <Profile />
      case "alerts-blogs":
        return <AlertsBlogs />
      case "payments":
        return <Payments />
      default:
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 mt-5 md:mt-5 sm:mt-20">Dashboard Overview</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                {[
                  {
                    icon: FaBook,
                    count: summary.assignments,
                    label: "Assignments",
                    color: "bg-gradient-to-br from-green-100 to-green-200",
                    textColor: "text-green-700",
                  },
                  {
                    icon: FaLaptopCode,
                    count: summary.cbtExams,
                    label: "CBT Exams",
                    color: "bg-gradient-to-br from-red-100 to-red-200",
                    textColor: "text-red-700",
                  },
                  {
                    icon: FaEnvelope,
                    count: summary.messages,
                    label: "Messages",
                    color: "bg-gradient-to-br from-blue-100 to-blue-200",
                    textColor: "text-blue-700",
                  },
                  {
                    icon: FaFileAlt,
                    count: summary.results,
                    label: "Results",
                    color: "bg-gradient-to-br from-purple-100 to-purple-200",
                    textColor: "text-purple-700",
                  },
                  {
                    icon: FaClipboardList,
                    count: summary.tests,
                    label: "Tests",
                    color: "bg-gradient-to-br from-orange-100 to-orange-200",
                    textColor: "text-orange-700",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className={`${item.color} rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/50 flex items-center justify-center ${item.textColor}`}
                      >
                        <item.icon className="text-lg md:text-xl" />
                      </div>
                      <div className="space-y-1">
                        <div className={`text-2xl md:text-3xl font-bold ${item.textColor}`}>{item.count}</div>
                        <div className="text-xs md:text-sm font-medium text-slate-600">{item.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-6">Quick Access</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    page: "assignments",
                    title: "Assignments",
                    icon: <FaBook />,
                    color: "bg-gradient-to-br from-green-100 to-green-200",
                  },
                  {
                    page: "timetable",
                    title: "Timetable",
                    icon: <FaCalendarAlt />,
                    color: "bg-gradient-to-br from-yellow-100 to-yellow-200",
                  },
                  {
                    page: "exam-results",
                    title: "Exam Results",
                    icon: <FaFileAlt />,
                    color: "bg-gradient-to-br from-purple-100 to-purple-200",
                  },
                  {
                    page: "messages",
                    title: "Messages",
                    icon: <FaEnvelope />,
                    color: "bg-gradient-to-br from-blue-100 to-blue-200",
                  },
                  {
                    page: "cbt-exams",
                    title: "CBT Exams",
                    icon: <FaLaptopCode />,
                    color: "bg-gradient-to-br from-red-100 to-red-200",
                  },
                  {
                    page: "tests",
                    title: "Tests & Quizzes",
                    icon: <FaClipboardList />,
                    color: "bg-gradient-to-br from-orange-100 to-orange-200",
                  },
                  {
                    page: "profile",
                    title: "Profile",
                    icon: <FaUser />,
                    color: "bg-gradient-to-br from-gray-100 to-gray-200",
                  },
                  {
                    page: "alerts-blogs",
                    title: "Alerts & Blogs",
                    icon: <FaBell />,
                    color: "bg-gradient-to-br from-pink-100 to-pink-200",
                  },
                  {
                    page: "payments",
                    title: "Payments",
                    icon: <FaFileAlt />,
                    color: "bg-gradient-to-br from-teal-100 to-teal-200",
                  },
                ].map((item, index) => (
                  <motion.button
                      key={item.page}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 * index }}
                      aria-label={`Open ${item.title}`}
                      onClick={() => {
                        setActivePage(item.page)
                        // dispatch event so Sidebar (which listens globally) updates its active state as well
                        window.dispatchEvent(new CustomEvent('pupil-set-active-page', { detail: { page: item.page } }))
                      }}
                      className="w-full"
                    >
                    <DashboardCard title={item.title} icon={item.icon} color={item.color} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )
    }
  }

  return (
    <PupilContext.Provider value={{ pupil }}>
      <ResponsiveDashboard renderPage={renderPage} setActivePage={setActivePage} />
    </PupilContext.Provider>
  )
}
