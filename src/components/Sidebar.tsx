"use client";

import type { LucideIcon } from "lucide-react";
import { Bell, BookOpen, CalendarDays, ClipboardList, FileText, GraduationCap, Home, Laptop, LogOut, PanelLeftClose, User, Wallet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { DashboardBrand, DashboardNavButton, useDashboardViewport } from "@/components/dashboard/primitives";

type SidebarProps = {
 setActivePage: (page: string) => void;
 onToggle?: (isOpen: boolean) => void;
};

type NavItem = { id: string; icon: LucideIcon; label: string };

export default function Sidebar({ setActivePage, onToggle }: SidebarProps) {
 const router = useRouter();
 const viewport = useDashboardViewport();
 const [isOpen, setIsOpen] = useState(true);
 const [activePage, setActivePageState] = useState("dashboard");
 const [showLogoutModal, setShowLogoutModal] = useState(false);
 const [isPupilSession, setIsPupilSession] = useState(false);
 const isMobile = viewport === "mobile";
 const compact = !isMobile && !isOpen;

 useEffect(() => {
  setIsOpen(!isMobile);
 }, [isMobile]);

 useEffect(() => {
  onToggle?.(isOpen);
 }, [isOpen, onToggle]);

 useEffect(() => {
  const toggleHandler = (event: Event) => {
   const detail = (event as CustomEvent<{ toggle?: boolean }>).detail;
   setIsOpen((open) => (detail?.toggle ? !open : true));
  };
  const pageHandler = (event: Event) => {
   const page = (event as CustomEvent<{ page?: string }>).detail?.page;
   if (typeof page !== "string") return;
   setActivePageState(page);
   setActivePage(page);
   if (isMobile) setIsOpen(false);
  };

  window.addEventListener("pupil-sidebar-toggle", toggleHandler as EventListener);
  window.addEventListener("pupil-set-active-page", pageHandler as EventListener);
  return () => {
   window.removeEventListener("pupil-sidebar-toggle", toggleHandler as EventListener);
   window.removeEventListener("pupil-set-active-page", pageHandler as EventListener);
  };
 }, [isMobile, setActivePage]);

 useEffect(() => {
  try {
   const sessionCookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("session="));
   if (!sessionCookie) return;
   let raw = decodeURIComponent(sessionCookie.slice("session=".length));
   try {
    raw = JSON.parse(raw);
   } catch {
    // Cookie may be a plain UIN string.
   }
   const uin = typeof raw === "string" ? raw : (raw as { uin?: unknown })?.uin;
   if (typeof uin === "string" && uin.startsWith("GFA-P-")) setIsPupilSession(true);
  } catch (error) {
   console.warn("Could not determine session role from cookie", error);
  }
 }, []);

 const handlePageChange = (page: string) => {
  setActivePageState(page);
  setActivePage(page);
  if (isMobile) setIsOpen(false);
 };

 const menuItems: NavItem[] = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "assignments", icon: BookOpen, label: "Assignments" },
  { id: "programming-courses", icon: Laptop, label: "Programming" },
  { id: "timetable", icon: CalendarDays, label: "Timetable" },
  { id: "exam-results", icon: FileText, label: "Exam results" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "profile", icon: User, label: "Profile" },
  ...(isPupilSession
   ? []
   : [
      { id: "cbt-exams", icon: GraduationCap, label: "CBT exams" },
      { id: "tests", icon: ClipboardList, label: "Tests & quizzes" },
      { id: "payments", icon: Wallet, label: "Payments" },
     ]),
 ];

 return (
  <>
   {isMobile && isOpen && (
    <button
     type="button"
     aria-label="Close navigation"
     onClick={() => setIsOpen(false)}
     className="fixed inset-0 z-40 bg-brand-ink/60 backdrop-blur-sm md:hidden"
    />
   )}

   <aside
    aria-label="Pupil navigation"
    className={`fixed bottom-0 left-0 z-50 flex flex-col border-r border-white/10 bg-brand-ink transition-[width,transform] duration-300 ease-out ${
     isMobile
      ? `top-[72px] w-[280px] ${isOpen ? "translate-x-0" : "-translate-x-full"}`
      : `top-20 ${isOpen ? "w-[260px]" : "w-[70px]"}`
    }`}
   >
    <div className={`flex h-16 shrink-0 items-center border-b border-white/10 ${compact ? "justify-center px-2" : "justify-between px-4"}`}>
     <DashboardBrand compact={compact} role="Pupil workspace" />
     <button
      type="button"
      onClick={() => setIsOpen((open) => !open)}
      aria-label={isMobile ? "Close navigation" : isOpen ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isOpen}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
     >
      {isMobile || isOpen ? <X className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
     </button>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-5">
     {!compact && <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-white/40">Learning</p>}
     <div className="space-y-1">
      {menuItems.map((item) => (
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
    </nav>

    <div className="shrink-0 border-t border-white/10 p-3">
     <DashboardNavButton icon={LogOut} label="Sign out" compact={compact} danger onClick={() => setShowLogoutModal(true)} />
     {!compact && <p className="mt-3 px-3 text-[11px] text-white/35">Glorious Future Academy · Pupil portal</p>}
    </div>
   </aside>

   <ConfirmModal
    open={showLogoutModal}
    title="Confirm sign out"
    description="Are you sure you want to sign out of your account?"
    confirmText="Sign out"
    cancelText="Cancel"
    onCancel={() => setShowLogoutModal(false)}
    onConfirm={async () => {
     try {
      await fetch("/api/pupils/logout", { method: "POST", credentials: "include" });
     } catch (error) {
      console.error("Logout failed", error);
     } finally {
      setShowLogoutModal(false);
      router.push("/pupils");
     }
    }}
   />
  </>
 );
}
