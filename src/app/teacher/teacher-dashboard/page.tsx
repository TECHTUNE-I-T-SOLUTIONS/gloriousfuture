"use client"

import { useEffect, useState } from "react"
import { DashboardPageIntro, DashboardStatStrip } from "@/components/dashboard/primitives"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  BarChart3,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"

import TeacherSidebar from "@/components/teacher/TeacherSidebar"
import TeacherHeader from "@/components/teacher/TeacherHeader"
import TeacherDashboardCard from "@/components/teacher/TeacherDashboardCard"
import TeacherAssignments from "./Assignments/page"
import ProgrammingCourses from "./ProgrammingCourses/page"
import TeacherTimetable from "./Timetable/page"
import TeacherExamResults from "./ExamResults/page"
import TeacherMessages from "./Messages/page"
import TeacherCBTExams from "./CBTExams/page"
import TeacherTestsQuizzes from "./TestsQuizzes/page"
import TeacherProfile from "./Profile/page"
import TeacherFinalResults from "./FinalResults/page"
import Teacherblog from "./Teacherblog/page"
import Teacheralert from "./Teacheralert/page"
import TeacherNotifications from "./notifications/page"
import TeacherSchoolFees from "./SchoolFees/page"
import TeacherPayments from "./Payments/page"
import TeacherAITools from "./AI/page"
import CustomAlert from "@/components/CustomAlert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TeacherDashboard() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<{ full_name: string; profile_picture: string; uin: string } | null>(null)
  const [activePage, setActivePage] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState({
    totalAssignments: 0,
    pendingGrades: 0,
    upcomingExams: 0,
    unreadMessages: 0,
  })
  const [recentActivity, setRecentActivity] = useState<{ id: string; title: string; time: string; kind: string }[]>([])

  useEffect(() => {
    const fetchSessionAndTeacherDetails = async () => {
      let attempts = 0
      const maxAttempts = 5
      const retryDelay = 1000

      while (attempts < maxAttempts) {
        try {
          const sessionRes = await fetch("/api/auth/session", { credentials: "include" })

          if (sessionRes.ok) {
            const sessionData = await sessionRes.json()
            console.log("Session Data:", sessionData)

            if (sessionData?.session?.uin) {
              const teacherRes = await fetch(`/api/teacher/details?uin=${sessionData.session.uin}`)

              if (teacherRes.ok) {
                const teacherData = await teacherRes.json()
                console.log("Teacher Data:", teacherData)

                if (teacherData.success) {
                  setTeacher({
                    full_name: teacherData.name || "Teacher",
                    profile_picture: teacherData.profile_picture || "/default-profile.png",
                    uin: teacherData.uin || "N/A",
                  })

                  // Fetch dashboard statistics
                  try {
                    // Fetch real counts from APIs
                    const [assignRes, testsRes, cbtRes, notifRes, messagesRes] = await Promise.all([
                      fetch('/api/teacher/assignments', { credentials: 'include' }),
                      fetch('/api/teacher/tests-quizzes', { credentials: 'include' }),
                      fetch('/api/teacher/cbt-exams', { credentials: 'include' }),
                      fetch('/api/notifications', { credentials: 'include', cache: 'no-store' }),
                      fetch('/api/teacher/messages', { credentials: 'include' }),
                    ])

                    const assignmentsJson = assignRes.ok ? await assignRes.json() : null
                    const testsJson = testsRes.ok ? await testsRes.json() : null
                    const cbtJson = cbtRes.ok ? await cbtRes.json() : null
                    const notifsJson = notifRes.ok ? await notifRes.json() : null
                    const messagesJson = messagesRes.ok ? await messagesRes.json() : null

                    const totalAssignments = Array.isArray(assignmentsJson?.assignments) ? assignmentsJson.assignments.length : Array.isArray(assignmentsJson) ? assignmentsJson.length : 0
                    // pendingGrades is repurposed to show total tests (tests & quizzes)
                    const totalTests = Array.isArray(testsJson) ? testsJson.length : 0
                    const upcomingExams = Array.isArray(cbtJson) ? cbtJson.length : 0
                    const notificationsCount = typeof notifsJson?.unread_count === 'number' ? notifsJson.unread_count : 0

                    setDashboardStats({
                      totalAssignments: totalAssignments,
                      pendingGrades: totalTests,
                      upcomingExams: upcomingExams,
                      unreadMessages: notificationsCount,
                    })

                    // populate recent activity list
                    const recent: { id: string; title: string; time: string; kind: string }[] = []

                    if (Array.isArray(assignmentsJson?.assignments)) {
                      assignmentsJson.assignments.slice(-5).reverse().forEach((a: Record<string, unknown>) => {
                        const id = getStr(a, 'id')
                        const title = getStr(a, 'title')
                        const time = getStr(a, 'due_date') || getStr(a, 'created_at')
                        recent.push({ id, title: `Assignment: ${title}`, time, kind: 'assignment' })
                      })
                    }

                    if (Array.isArray(cbtJson)) {
                      cbtJson.slice(-5).reverse().forEach((e: Record<string, unknown>) => {
                        const id = getStr(e, 'id')
                        const title = getStr(e, 'exam_title') || getStr(e, 'title') || 'Exam'
                        const time = getStr(e, 'created_at')
                        recent.push({ id, title: `Exam: ${title}`, time, kind: 'exam' })
                      })
                    }

                    const recentMessages = Array.isArray(messagesJson) ? messagesJson : []
                    if (Array.isArray(recentMessages)) {
                      recentMessages.slice(-5).reverse().forEach((m: Record<string, unknown>) => {
                        const id = getStr(m, 'id')
                        const msg = getStr(m, 'message')
                        const time = getStr(m, 'created_at') || getStr(m, 'sent_at')
                        recent.push({ id, title: `Message: ${msg.slice(0, 60) || 'New message'}`, time, kind: 'message' })
                      })
                    }

                    // sort by time desc and keep top 5
                    recent.sort((a, b) => (new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()))
                    setRecentActivity(recent.slice(0, 5))
                  } catch (error) {
                    console.error("Error fetching dashboard stats:", error)
                  }
                  setLoading(false)
                  return
                }
              }
            }
          } else if (sessionRes.status === 401) {
            setAlertMessage("Your session has expired. Please log in again.")
            setTimeout(() => {
              router.replace("/teacher")
            }, 2000)
            return
          }

          console.warn("Retrying authentication check...")
          attempts++
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
        } catch (error) {
          console.error("Error fetching session:", error)
        }
      }

      console.error("Max authentication retries reached. Redirecting...")
      setAlertMessage("Failed to authenticate. Please log in again.")
      setTimeout(() => {
        router.replace("/teacher")
      }, 2000)
    }

    fetchSessionAndTeacherDetails()
    // listen for header events to open pages inside the dashboard
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail
        if (detail && typeof detail.page === 'string') setActivePage(detail.page)
      } catch {}
    }
    window.addEventListener('teacher-set-active-page', handler)
    return () => window.removeEventListener('teacher-set-active-page', handler)
  }, [router])

  

  const formatRelativeTime = (iso: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      const diff = Date.now() - d.getTime()
      const minutes = Math.round(diff / 60000)
      if (minutes < 1) return 'just now'
      if (minutes < 60) return `${minutes}m ago`
      const hours = Math.round(minutes / 60)
      if (hours < 24) return `${hours}h ago`
      const days = Math.round(hours / 24)
      return `${days}d ago`
    } catch {
      return iso
    }
  }

  const getStr = (obj: unknown, key: string) => {
    try {
      const v = (obj as Record<string, unknown>)[key]
      if (typeof v === 'string') return v
      if (typeof v === 'number') return String(v)
      return ''
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-black">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const renderDashboardOverview = () => (
    <div className="space-y-8" data-dashboard>
      {/* Welcome Section */}
      <DashboardPageIntro
  title={`Welcome back, ${teacher?.full_name}`}
  description={`Here's what's happening in your classroom today`}
/>
<DashboardStatStrip
  items={[
   { label: "Total Assignments", value: dashboardStats.totalAssignments, detail: "+2 from last week" },
   { label: "Total Tests", value: dashboardStats.pendingGrades, detail: "Requires attention" },
   { label: "Upcoming Exams", value: dashboardStats.upcomingExams, detail: "Next 7 days" },
   { label: "Notifications", value: dashboardStats.unreadMessages, detail: "Unread messages" },
  ]} />
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription className="text-black">Your latest classroom activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <div className="text-sm text-gray-500">No recent activity</div>
            )}
            {recentActivity.map((r) => (
              <div key={r.id} className="flex items-center space-x-4 p-3 rounded-lg bg-background border border-border">
                {r.kind === 'assignment' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {r.kind === 'exam' && <PlusCircle className="h-5 w-5 text-blue-500" />}
                {r.kind === 'message' && <MessageSquare className="h-5 w-5 text-purple-500" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-black">{formatRelativeTime(r.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPage = () => {
    switch (activePage) {
      case "notifications":
        return <TeacherNotifications />
      case "school-fees":
        return <TeacherSchoolFees />
      case "payments":
        return <TeacherPayments />
      case "assignments":
        return <TeacherAssignments />
      case "programming-courses":
        return <ProgrammingCourses />
      case "timetable":
        return <TeacherTimetable />
      case "exam-results":
        return <TeacherExamResults />
      case "messages":
        return <TeacherMessages />
      case "cbt-exams":
        return <TeacherCBTExams />
      case "tests":
        return <TeacherTestsQuizzes />
      case "final-results":
        return <TeacherFinalResults />
      case "profile":
        return <TeacherProfile />
      case "ai-tools":
        return <TeacherAITools />
      case "create-blog":
        return <Teacherblog />
      case "create-alert":
        return <Teacheralert />
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <>
      {alertMessage && <CustomAlert message={alertMessage} type="error" onClose={() => setAlertMessage(null)} />}

      <div className="flex bg-background min-h-screen">
        {/* Header */}
        <div className="fixed top-0 left-0 w-full z-50 animate-slide-in-top" data-dashboard>
          <TeacherHeader text="Teacher Dashboard" setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* Sidebar (responsive)
            TeacherSidebar itself handles a mobile overlay and slide-in; for desktop we keep a fixed sidebar width.
        */}
        <TeacherSidebar
          setActivePage={setActivePage}
          activePage={activePage}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
  <div className={`transition-all duration-300 flex-1 p-6 pt-[72px] ${isSidebarOpen ? "md:ml-[280px]" : "md:ml-[70px]"}`}>
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </div>
      </div>
    </>
  )
}
