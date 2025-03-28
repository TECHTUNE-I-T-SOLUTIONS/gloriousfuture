"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";
import TeacherDashboardCard from "@/components/teacher/TeacherDashboardCard";
import TeacherAssignments from "./Assignments/page";
import TeacherTimetable from "./Timetable/page";
import TeacherExamResults from "./ExamResults/page";
import TeacherMessages from "./Messages/page";
import TeacherCBTExams from "./CBTExams/page";
import TeacherTestsQuizzes from "./TestsQuizzes/page";
import TeacherProfile from "./Profile/page";
import Teacherblog from "./Teacherblog/page";
import Teacheralert from "./Teacheralert/page";
import CustomAlert from "@/components/CustomAlert";

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<{ full_name: string; profile_picture: string; uin: string } | null>(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for custom alert

  useEffect(() => {
    const fetchSessionAndTeacherDetails = async () => {
      let attempts = 0;
      const maxAttempts = 5;
      const retryDelay = 1000;

      while (attempts < maxAttempts) {
        try {
          const sessionRes = await fetch("/api/auth/session", { credentials: "include" });

          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            console.log("Session Data:", sessionData);

            if (sessionData?.session?.uin) {
              const teacherRes = await fetch(`/api/teacher/details?uin=${sessionData.session.uin}`);

              if (teacherRes.ok) {
                const teacherData = await teacherRes.json();
                console.log("Teacher Data:", teacherData);

                if (teacherData.success) {
                  setTeacher({
                    full_name: teacherData.name || "Teacher",
                    profile_picture: teacherData.profile_picture || "/default-profile.png",
                    uin: teacherData.uin || "N/A",
                  });
                  setLoading(false);
                  return;
                }
              }
            }
          } else if (sessionRes.status === 401) {
            // Unauthorized, show alert and redirect
            setAlertMessage("Your session has expired. Please log in again.");
            setTimeout(() => {
              router.replace("/teacher");
            }, 2000); // Redirect after showing alert
            return;
          }

          console.warn("Retrying authentication check...");
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } catch (error) {
          console.error("Error fetching session:", error);
        }
      }

      console.error("Max authentication retries reached. Redirecting...");
      setAlertMessage("Failed to authenticate. Please log in again.");
      setTimeout(() => {
        router.replace("/teacher");
      }, 2000); // Redirect after showing alert
    };

    fetchSessionAndTeacherDetails();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking authentication...</div>;
  }

  const renderPage = () => {
    switch (activePage) {
      case "assignments":
        return <TeacherAssignments />;
      case "timetable":
        return <TeacherTimetable />;
      case "exam-results":
        return <TeacherExamResults />;
      case "messages":
        return <TeacherMessages />;
      case "cbt-exams":
        return <TeacherCBTExams />;
      case "tests":
        return <TeacherTestsQuizzes />;
      case "profile":
        return <TeacherProfile />;
      case "create-blog":
        return <Teacherblog />;
      case "create-alert":
        return <Teacheralert />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <TeacherDashboardCard title="Assignments" onClick={() => setActivePage("assignments")} />
            <TeacherDashboardCard title="Timetable" onClick={() => setActivePage("timetable")} />
            <TeacherDashboardCard title="Exam Results" onClick={() => setActivePage("exam-results")} />
            <TeacherDashboardCard title="Messages" onClick={() => setActivePage("messages")} />
            <TeacherDashboardCard title="CBT Exams" onClick={() => setActivePage("cbt-exams")} />
            <TeacherDashboardCard title="Tests & Quizzes" onClick={() => setActivePage("tests")} />
          </div>
        );
    }
  };

  return (
    <>
      {/* Display the custom alert if there is a message */}
      {alertMessage && <Teacheralert message={alertMessage} />}    

      <div className="flex bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="fixed top-0 left-0 w-full z-50">
          <TeacherHeader
            text="Welcome to Your Dashboard"
            teacherName={teacher ? teacher.full_name : "Teacher"}
            profilePicture={teacher ? teacher.profile_picture : "/default-profile.png"}
          />
        </div>

        {/* Sidebar */}
        <div
          className={`fixed h-full left-0 z-40 bg-white transition-all duration-300 shadow-md ${
            isSidebarOpen ? "w-[250px]" : "w-[70px]"
          }`}
        >
          <TeacherSidebar setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-300 flex-1 p-8 pt-[120px] ${
            isSidebarOpen ? "ml-[250px]" : "ml-[70px]"
          }`}
        >
          {renderPage()}
        </div>
      </div>
    </>
  );
}
