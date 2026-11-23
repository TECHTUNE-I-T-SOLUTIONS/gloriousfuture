"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { ChevronDown, LogOut, Menu, Settings, UserRound } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import NotificationsDropdown from "../NotificationsDropdown";

export default function TeacherHeader({
 text,
 setIsSidebarOpen,
}: {
 text: string;
 setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
 const router = useRouter();
 const [teacherName, setTeacherName] = useState("Loading…");
 const [profilePicture, setProfilePicture] = useState("/default-profile.png");
 const [uin, setUIN] = useState("N/A");
 const [showDropdown, setShowDropdown] = useState(false);
 const [showLogoutModal, setShowLogoutModal] = useState(false);

 useEffect(() => {
  let active = true;

  const fetchDetails = async () => {
   try {
    const sessionRes = await fetch("/api/auth/session", { credentials: "include" });
    if (!sessionRes.ok) throw new Error("Unauthorized session");
    const sessionData = await sessionRes.json();
    const sessionUin = sessionData?.session?.uin;
    if (!sessionUin) throw new Error("Session missing UIN");

    const teacherRes = await fetch(`/api/teacher/details?uin=${sessionUin}`, { credentials: "include" });
    if (!teacherRes.ok) throw new Error("Failed to fetch teacher details");
    const teacherData = await teacherRes.json();
    if (!active || !teacherData.success) return;

    setTeacherName(teacherData.name || "Teacher");
    setUIN(teacherData.uin || "N/A");
    setProfilePicture(teacherData.profile_picture || "/default-profile.png");
   } catch (error) {
    console.error("Error fetching teacher details:", error);
   }
  };

  fetchDetails();
  const onVisibility = () => {
   if (document.visibilityState === "visible") fetchDetails();
  };
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
   active = false;
   document.removeEventListener("visibilitychange", onVisibility);
  };
 }, []);

 useEffect(() => {
  if (!showDropdown) return;
  const onKeyDown = (event: KeyboardEvent) => {
   if (event.key === "Escape") setShowDropdown(false);
  };
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
 }, [showDropdown]);

 return (
  <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center border-b border-brand-line bg-white/95 backdrop-blur md:h-20">
   <div className="flex w-full items-center justify-between gap-3 px-4 sm:px-6">
    <div className="flex min-w-0 items-center gap-3">
     <button
      type="button"
      aria-label="Toggle navigation"
      aria-expanded={undefined}
      onClick={() => setIsSidebarOpen((open) => !open)}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-line text-brand-ink transition-colors hover:bg-brand-mist md:hidden"
     >
      <Menu aria-hidden="true" className="h-5 w-5" />
     </button>
     <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Glorious Future Academy home">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-ink">
       <Image src="/apple-touch-icon.png" alt="" width={30} height={30} className="rounded-lg bg-white p-0.5" />
      </span>
      <span className="min-w-0">
       <span className="block truncate font-display text-base leading-tight text-brand-ink sm:text-lg">Glorious Future Academy</span>
       <span className="hidden truncate text-xs text-brand-ink/55 sm:block">{text}</span>
      </span>
     </Link>
    </div>

    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
     <NotificationsDropdown />
     <div className="relative">
      <button
       type="button"
       onClick={() => setShowDropdown((open) => !open)}
       aria-expanded={showDropdown}
       aria-haspopup="menu"
       className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-colors hover:border-brand-line hover:bg-brand-mist"
      >
       <span className="hidden text-right lg:block">
        <span className="block max-w-[160px] truncate text-sm font-semibold text-brand-ink">{teacherName}</span>
        <span className="block text-[11px] text-brand-ink/50">{uin}</span>
       </span>
       <Image
        src={profilePicture || "/default-profile.png"}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-full border border-brand-line object-cover"
       />
       <ChevronDown aria-hidden="true" className={`h-4 w-4 text-brand-ink/50 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
      </button>

      {showDropdown && (
       <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-brand-line bg-white p-2 shadow-xl">
        <div className="border-b border-brand-line px-3 py-3">
         <p className="truncate text-sm font-semibold text-brand-ink">{teacherName}</p>
         <p className="truncate text-xs text-brand-ink/55">{uin}</p>
        </div>
        <div className="py-2">
         <button
          type="button"
          role="menuitem"
          onClick={() => {
           setShowDropdown(false);
           router.push("/teacher/teacher-dashboard/Profile");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-brand-ink hover:bg-brand-mist"
         >
          <UserRound aria-hidden="true" className="h-4 w-4 text-brand-indigo" />
          Profile settings
         </button>
         <button
          type="button"
          role="menuitem"
          onClick={() => {
           setShowDropdown(false);
           router.push("/teacher/preferences");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-brand-ink hover:bg-brand-mist"
         >
          <Settings aria-hidden="true" className="h-4 w-4 text-brand-indigo" />
          Preferences
         </button>
        </div>
        <button
         type="button"
         role="menuitem"
         onClick={() => {
          setShowDropdown(false);
          setShowLogoutModal(true);
         }}
         className="flex w-full items-center gap-3 border-t border-brand-line px-3 py-2.5 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
        >
         <LogOut aria-hidden="true" className="h-4 w-4" />
         Sign out
        </button>
       </div>
      )}
     </div>
    </div>
   </div>

   {showDropdown && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}

   <ConfirmModal
    open={showLogoutModal}
    title="Sign out"
    description="Are you sure you want to sign out of your account?"
    confirmText="Sign out"
    cancelText="Cancel"
    onCancel={() => setShowLogoutModal(false)}
    onConfirm={async () => {
     try {
      const response = await fetch("/api/teacher/logout", { method: "POST", credentials: "include" });
      if (!response.ok) throw new Error("Logout failed");
     } catch (error) {
      console.error("Error during logout", error);
     } finally {
      setShowLogoutModal(false);
      router.push("/teacher");
     }
    }}
   />
  </header>
 );
}
