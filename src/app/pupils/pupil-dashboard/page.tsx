"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedHeader from "@/components/AnimatedHeader";
import DashboardCard from "@/components/DashboardCard";
import Assignments from "./Assignments/page";
import Timetable from "./Timetable/page";
import ExamResults from "./ExamResults/page";
import Messages from "./Messages/page";
import CBTExams from "./CBTExams/page";
import TestsQuizzes from "./TestsQuizzes/page";

export default function PupilDashboard() {
  const [pupil, setPupil] = useState<{ full_name: string; profile_picture: string; uin: string } | null>(null);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const fetchPupilDetails = async () => {
      try {
        const res = await fetch("/api/pupils/details?email=pupil@example.com"); // Replace with actual email logic
        if (res.ok) {
          const data = await res.json();
          setPupil(data);
        }
      } catch (error) {
        console.error("Error fetching pupil details:", error);
      }
    };

    fetchPupilDetails();
  }, []);

  // Function to dynamically load the selected page
  const renderPage = () => {
    switch (activePage) {
      case "assignments":
        return <Assignments />;
      case "timetable":
        return <Timetable />;
      case "exam-results":
        return <ExamResults />;
      case "messages":
        return <Messages />;
      case "cbt-exams":
        return <CBTExams />;
      case "tests":
        return <TestsQuizzes />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <DashboardCard title="Assignments" onClick={() => setActivePage("assignments")} />
            <DashboardCard title="Timetable" onClick={() => setActivePage("timetable")} />
            <DashboardCard title="Exam Results" onClick={() => setActivePage("exam-results")} />
            <DashboardCard title="Messages" onClick={() => setActivePage("messages")} />
            <DashboardCard title="CBT Exams" onClick={() => setActivePage("cbt-exams")} />
            <DashboardCard title="Tests & Quizzes" onClick={() => setActivePage("tests")} />
          </div>
        );
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Animated Header - Fixed at Top */}
      <div className="fixed top-0 left-0 w-full z-50">
        <AnimatedHeader
          text="Welcome to Your Dashboard"
          pupilName={pupil ? pupil.full_name : "Pupil"}
          profilePicture={pupil ? pupil.profile_picture : "/default-profile.png"}
        />
      </div>

      {/* Sidebar - Positioned Below Header */}
      <div className="fixed h-full left-0 w-[250px] z-40">
        <Sidebar setActivePage={setActivePage} />
      </div>

      {/* Main Content - Adds Padding to Prevent Overlap */}
      <div className="ml-[250px] flex-1 p-8 pt-[120px]">
        {pupil && (
          <p className="text-lg text-gray-600 text-center mt-2">
            UIN: <span className="font-semibold">{pupil.uin}</span>
          </p>
        )}

        {/* Dynamic Content Section */}
        {renderPage()}
      </div>
    </div>
  );
}
