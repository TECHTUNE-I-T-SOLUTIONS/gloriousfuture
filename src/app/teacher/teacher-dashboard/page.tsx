"use client"

import { useEffect, useState } from "react"
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
import TeacherTimetable from "./Timetable/page"
import TeacherExamResults from "./ExamResults/page"
import TeacherMessages from "./Messages/page"
import TeacherCBTExams from "./CBTExams/page"
import TeacherTestsQuizzes from "./TestsQuizzes/page"
import TeacherProfile from "./Profile/page"
import Teacherblog from "./Teacherblog/page"
import Teacheralert from "./Teacheralert/page"
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
                  await fetchDashboardStats()
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
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      // These would be actual API calls in a real implementation
      setDashboardStats({
        totalAssignments: 12,
        pendingGrades: 8,
        upcomingExams: 3,
        unreadMessages: 5,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const renderDashboardOverview = () => (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="gradient-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {teacher?.full_name}! 👋</h1>
            <p className="text-muted-foreground text-lg">Here&apos;s what&apos;s happening in your classroom today</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-full bg-gradient-primary animate-float"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardStats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Pending Grades</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardStats.pendingGrades}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Upcoming Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardStats.upcomingExams}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardStats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.unreadMessages > 0 && (
                <Badge variant="accent" className="text-xs">
                  New
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TeacherDashboardCard
          title="Assignments"
          icon={<BookOpen className="h-6 w-6" />}
          onClick={() => setActivePage("assignments")}
        />
        <TeacherDashboardCard
          title="CBT Exams"
          icon={<FileText className="h-6 w-6" />}
          onClick={() => setActivePage("cbt-exams")}
        />
        <TeacherDashboardCard
          title="Exam Results"
          icon={<BarChart3 className="h-6 w-6" />}
          onClick={() => setActivePage("exam-results")}
        />
        <TeacherDashboardCard
          title="Timetable"
          icon={<Calendar className="h-6 w-6" />}
          onClick={() => setActivePage("timetable")}
        />
        <TeacherDashboardCard
          title="Messages"
          icon={<MessageSquare className="h-6 w-6" />}
          onClick={() => setActivePage("messages")}
        />
        <TeacherDashboardCard
          title="Tests & Quizzes"
          icon={<CheckCircle className="h-6 w-6" />}
          onClick={() => setActivePage("tests")}
        />
      </div>

      {/* Recent Activity */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription className="text-muted-foreground">Your latest classroom activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-background border border-border">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Assignment &quot;Math Quiz 1&quot; graded</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-background border border-border">
              <PlusCircle className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New CBT exam created</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-background border border-border">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">3 new messages received</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPage = () => {
    switch (activePage) {
      case "assignments":
        return <TeacherAssignments />
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
      case "profile":
        return <TeacherProfile />
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
        <div className="fixed top-0 left-0 w-full z-50 animate-slide-in-top">
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
  <div className={`transition-all duration-300 flex-1 p-6 pt-[120px] ${isSidebarOpen ? "md:ml-[280px]" : "md:ml-[70px]"}`}>
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </div>
      </div>
    </>
  )
}
