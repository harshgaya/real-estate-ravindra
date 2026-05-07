"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendar,
  LuListTodo,
  LuClipboardList,
  LuBuilding2,
  LuBuilding,
  LuSettings,
  LuLogOut,
  LuBell,
  LuMenu,
  LuX,
  LuMessageSquare,
  LuStar,
  LuChartBar,
  LuDatabase,
  LuUserCog,
} from "react-icons/lu";

function buildNav(role) {
  const base = [
    { label: "Dashboard", href: "/admin", icon: LuLayoutDashboard },
    { label: "Leads", href: "/admin/leads", icon: LuUsers },
    { label: "Data", href: "/admin/data", icon: LuDatabase },
    { label: "Calendar", href: "/admin/calendar", icon: LuCalendar },
    { label: "Site Visits", href: "/admin/site-visits", icon: LuCalendar },
    { label: "Tasks", href: "/admin/tasks", icon: LuListTodo },
    { label: "Bookings", href: "/admin/bookings", icon: LuClipboardList },
  ];
  if (role === "agent") {
    return [...base, { label: "Team", href: "/admin/team", icon: LuUserCog }];
  }
  if (role === "manager") {
    return [
      ...base,
      { label: "Properties", href: "/admin/properties", icon: LuBuilding2 },
      { label: "Projects", href: "/admin/projects", icon: LuBuilding },
      { label: "Templates", href: "/admin/templates", icon: LuMessageSquare },
      { label: "Testimonials", href: "/admin/testimonials", icon: LuStar },
      { label: "Reports", href: "/admin/reports", icon: LuChartBar },
      { label: "Team", href: "/admin/team", icon: LuUserCog },
    ];
  }
  return [
    ...base,
    { label: "Properties", href: "/admin/properties", icon: LuBuilding2 },
    { label: "Projects", href: "/admin/projects", icon: LuBuilding },
    { label: "Templates", href: "/admin/templates", icon: LuMessageSquare },
    { label: "Testimonials", href: "/admin/testimonials", icon: LuStar },
    { label: "Users", href: "/admin/users", icon: LuUserCog },
    { label: "Reports", href: "/admin/reports", icon: LuChartBar },
    { label: "Settings", href: "/admin/settings", icon: LuSettings },
  ];
}

export default function AdminShell({ user, children }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[var(--color-bg-soft)]">{children}</div>
    );
  }
  return <Inner user={user}>{children}</Inner>;
}

function Inner({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const role = user?.role || "agent";
  const NAV = buildNav(role);

  const fetchNotifications = async () => {
    try {
      const r = await fetch("/api/admin/notifications");
      if (!r.ok) return;
      const d = await r.json();
      setUnread(d.unread || 0);
      setNotifs(d.items || []);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-notif-panel]")) {
        setNotifOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notifOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const subscribe = async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window))
          return;
        const reg = await navigator.serviceWorker
          .register("/sw.js")
          .catch(() => null);
        if (!reg) return;
        const keyRes = await fetch("/api/admin/push");
        const keyData = await keyRes.json();
        if (!keyData.publicKey) return;
        const existing = await reg.pushManager.getSubscription();
        if (existing) return;
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
        if (Notification.permission !== "granted") return;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
        });
        await fetch("/api/admin/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: sub.toJSON().keys,
            device: navigator.userAgent.slice(0, 100),
          }),
        });
      } catch {}
    };
    subscribe();
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const markAllRead = async () => {
    await fetch("/api/admin/notifications", { method: "PATCH" });
    fetchNotifications();
  };

  const toggleNotif = () => {
    if (!notifOpen) fetchNotifications();
    setNotifOpen(!notifOpen);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[var(--color-ink-900)] text-white z-50 transform transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-accent-500)] grid place-items-center text-[var(--color-ink-900)]">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 3 L21 10 L21 21 L15 21 L15 14 L9 14 L9 21 L3 21 L3 10 Z" />
              </svg>
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold">CRM</span>
              <span className="text-[9px] tracking-[0.22em] uppercase text-white/55 mt-0.5">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/70"
          >
            <LuX className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-sm transition-colors ${active ? "bg-white/10 text-white font-medium" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon className="text-base flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 p-3 border-t border-white/10">
          {user && (
            <div className="mb-3 px-3 py-2.5 rounded-lg bg-white/5">
              <p className="text-sm text-white truncate">
                {user.name || user.email}
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-white/55 mt-0.5">
                {user.role}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LuLogOut className="text-base" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="bg-white border-b border-[var(--color-ink-100)] sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[var(--color-ink-700)]"
            >
              <LuMenu className="text-2xl" />
            </button>
            <div className="flex-1" />
            <div className="relative" data-notif-panel>
              <button
                onClick={toggleNotif}
                className="relative w-10 h-10 grid place-items-center rounded-lg hover:bg-[var(--color-bg-soft)]"
              >
                <LuBell className="text-lg" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] rounded-full grid place-items-center font-medium">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[var(--color-ink-100)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <p className="text-sm font-semibold">Notifications</p>
                    {unread > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-[var(--color-brand-700)]"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="p-6 text-center text-sm text-[var(--color-ink-500)]">
                        No notifications
                      </div>
                    ) : (
                      notifs.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link || "#"}
                          onClick={() => setNotifOpen(false)}
                          className={`block px-4 py-3 hover:bg-[var(--color-bg-soft)] border-b border-[var(--color-ink-100)] last:border-b-0 ${
                            !n.isRead ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-700)] flex-shrink-0 mt-1.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"}`}
                              >
                                {n.title}
                              </p>
                              {n.body && (
                                <p className="text-xs text-[var(--color-ink-600)] mt-0.5 line-clamp-2">
                                  {n.body}
                                </p>
                              )}
                              <p className="text-[10px] text-[var(--color-ink-500)] mt-1 numeral">
                                {new Date(n.createdAt).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}
