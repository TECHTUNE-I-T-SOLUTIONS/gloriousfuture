"use client";

import type { LucideIcon } from "lucide-react";
import {
 Bell,
 BookOpen,
 CalendarDays,
 ChevronRight,
 ClipboardCheck,
 FileText,
 GraduationCap,
 Home,
 Laptop,
 LogOut,
 Newspaper,
 PanelLeftClose,
 Sparkles,
 User,
 Wallet,
 X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { DashboardBrand, DashboardNavButton, useDashboardViewport } from "@/components/dashboard/primitives";

interface SidebarProps {
 setActivePage: (page: string) => void;
 isSidebarOpen: boolean;
 setIsSidebarOpen: (isOpen: boolean) => void;
 activePage?: string;
}

type NavItem = { id: string; icon: LucideIcon; label: string };

const workspaceItems: NavItem[] = [
 { id: "dashboard", icon: Home, label: "Dashboard" },
 { id: "assignments", icon: BookOpen, label: "Assignments" },
 { id: "programming-courses", icon: Laptop, label: "Programming courses" },
 { id: "timetable", icon: CalendarDays, label: "Timetable" },
 { id: "exam-results", icon: FileText, label: "Exam results" },
 { id: "cbt-exams", icon: ClipboardCheck, label: "CBT exams" },
 { id: "tests", icon: ClipboardCheck, label: "Tests & quizzes" },
 { id: "final-results", icon: GraduationCap, label: "Final results" },
];

const schoolItems: NavItem[] = [
 { id: "school-fees", icon: Wallet, label: "School fees" },
 { id: "payments", icon: Wallet, label: "Payments" },
 { id: "create-blog", icon: Newspaper, label: "Create blog" },
 { id: "create-alert", icon: Bell, label: "Create alert" },
 { id: "ai-tools", icon: Sparkles, label: "AI tools" },
 { id: "notifications", icon: Bell, label: "Notifications" },
 { id: "profile", icon: User, label: "Profile" },
];

export default function TeacherSidebar({ setActivePage, isSidebarOpen, setIsSidebarOpen, activePage = "dashboard" }: SidebarProps) {
 const router = useRouter();
 const viewport = useDashboardViewport();
 const [showLogoutModal, setShowLogoutModal] = useState(false);
 const isMobile = viewport === "mobile";
 const compact = !isMobile && !isSidebarOpen;

 const handlePageChange = (page: string) => {
  setActivePage(page);
  if (isMobile) setIsSidebarOpen(false);
 };

 const handleLogout = async () => {
  try {
   await fetch("/api/teacher/logout", { method: "POST", credentials: "include" });
  } catch (error) {
   console.error("Error logging out:", error);
  } finally {
   setShowLogoutModal(false);
   router.push("/teacher");
  }
 };

 const renderGroup = (label: string, items: NavItem[]) => (
  <div className="mb-6">
   {!compact && <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-white/40">{label}</p>}
   <div className="space-y-1">
    {items.map((item) => (
     <DashboardNavButton
      key={item.id}
      icon={item.icon}
      label={item.label}
      active={activePage === item.id}
      compact={compact}
      onClick={() => handlePageChange(item.id)}
     />
    ))}
   </div>
  </div>
 );

 return (
  <>
   {isMobile && isSidebarOpen && (
    <button
     type="button"
     aria-label="Close navigation"
     onClick={() => setIsSidebarOpen(false)}
     className="fixed inset-0 z-40 bg-brand-ink/60 backdrop-blur-sm md:hidden"
    />
   )}

   <aside
    aria-label="Staff navigation"
    className={`fixed bottom-0 left-0 z-50 flex flex-col border-r border-white/10 bg-brand-ink transition-[width,transform] duration-300 ease-out ${
     isMobile
      ? `top-[72px] w-[280px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
      : `top-20 ${isSidebarOpen ? "w-[280px]" : "w-[70px]"}`
    }`}
   >
    <div className={`flex h-16 shrink-0 items-center border-b border-white/10 ${compact ? "justify-center px-2" : "justify-between px-4"}`}>
     <DashboardBrand compact={compact} role="Staff workspace" />
     <button
      type="button"
      onClick={() => (isMobile ? setIsSidebarOpen(false) : setIsSidebarOpen(!isSidebarOpen))}
      aria-label={isMobile ? "Close navigation" : isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isSidebarOpen}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
     >
      {isMobile ? <X className="h-4 w-4" /> : isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
     </button>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-5">
     {renderGroup("Workspace", workspaceItems)}
     {renderGroup("School", schoolItems)}
    </nav>

    <div className="shrink-0 border-t border-white/10 p-3">
     <DashboardNavButton icon={LogOut} label="Sign out" compact={compact} danger onClick={() => setShowLogoutModal(true)} />
     {!compact && <p className="mt-3 px-3 text-[11px] text-white/35">Glorious Future Academy · Staff portal</p>}
    </div>
   </aside>

   <ConfirmModal
    open={showLogoutModal}
    title="Confirm sign out"
    description="Are you sure you want to sign out of your account?"
    confirmText="Sign out"
    cancelText="Cancel"
    onCancel={() => setShowLogoutModal(false)}
    onConfirm={handleLogout}
   />
  </>
 );
}
