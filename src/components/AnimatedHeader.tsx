"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";

interface AnimatedHeaderProps {
 text: string;
}

export default function AnimatedHeader({ text }: AnimatedHeaderProps) {
 const [pupilName, setPupilName] = useState("");
 const [profilePicture, setProfilePicture] = useState("/default-profile.png");
 const [uin, setUIN] = useState("");
 const [unreadCount, setUnreadCount] = useState(0);

 useEffect(() => {
  let active = true;
  fetch("/api/pupils/details?self=1", { credentials: "include" })
   .then((response) => response.json())
   .then((data) => {
    if (!active) return;
    setPupilName(data.full_name || "Student");
    setProfilePicture(data.profile_picture || "/default-profile.png");
    setUIN(data.uin || "");
   })
   .catch(() => {});
  return () => {
   active = false;
  };
 }, []);

 useEffect(() => {
  let mounted = true;
  const fetchCount = async () => {
   try {
    const response = await fetch("/api/notifications", { credentials: "include", cache: "no-store" });
    if (!mounted) return;
    if (!response.ok) {
     setUnreadCount(0);
     return;
    }
    const body = await response.json().catch(() => ({}));
    const count = Number(body?.unread_count ?? 0);
    setUnreadCount(Number.isNaN(count) || count < 0 ? 0 : count);
   } catch {
    // Notifications are optional; keep the last known count.
   }
  };

  fetchCount();
  const interval = setInterval(fetchCount, 15000);
  const onVisibility = () => {
   if (document.visibilityState === "visible") fetchCount();
  };
  const onMarkRead = (event: Event) => {
   const ids = (event as CustomEvent<{ ids?: unknown }>).detail?.ids;
   if (Array.isArray(ids)) setUnreadCount((count) => Math.max(0, count - ids.length));
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("notifications-mark-read", onMarkRead);
  return () => {
   mounted = false;
   clearInterval(interval);
   document.removeEventListener("visibilitychange", onVisibility);
   window.removeEventListener("notifications-mark-read", onMarkRead);
  };
 }, []);

 const openNotifications = () => {
  window.dispatchEvent(new CustomEvent("pupil-set-active-page", { detail: { page: "notifications" } }));
 };

 return (
  <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center border-b border-brand-line bg-white/95 backdrop-blur md:h-20">
   <div className="flex w-full items-center justify-between gap-3 px-4 sm:px-6">
    <div className="flex min-w-0 items-center gap-3">
     <button
      type="button"
      aria-label="Toggle navigation"
      onClick={() => window.dispatchEvent(new CustomEvent("pupil-sidebar-toggle", { detail: { toggle: true } }))}
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

    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
     <div className="hidden text-right lg:block">
      <p className="max-w-[160px] truncate text-sm font-semibold text-brand-ink">{pupilName || "Student"}</p>
      {uin && <p className="text-[11px] text-brand-ink/50">{uin}</p>}
     </div>
     <Image
      src={profilePicture || "/default-profile.png"}
      alt=""
      width={36}
      height={36}
      className="h-9 w-9 rounded-full border border-brand-line object-cover"
     />
     <button
      type="button"
      aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      onClick={openNotifications}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-line text-brand-ink transition-colors hover:bg-brand-mist"
     >
      <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
      {unreadCount > 0 && (
       <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-violet px-1 text-[10px] font-semibold text-white" role="status" aria-live="polite">
        {unreadCount > 9 ? "9+" : unreadCount}
       </span>
      )}
     </button>
    </div>
   </div>
  </header>
 );
}
