"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import Logo from "./Logo";

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Derive initials from the user's name (e.g. "Suresh Menon" → "SM")
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const roleBadge = {
    admin: "bg-rose-500/20 text-rose-300",
    manager: "bg-sky-500/20 text-sky-300",
    staff: "bg-emerald-500/20 text-emerald-300",
  }[user?.role] ?? "bg-slate-500/20 text-slate-300";

  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg shadow-slate-900/20 ring-1 ring-white/5">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-6 md:px-10">
        <Logo />

        <div className="flex items-center gap-3">
          {/* Welcome text */}
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-white">
              Welcome back, {user?.name ?? "User"}{" "}
              <span aria-hidden="true">👋</span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleBadge}`}
              >
                {user?.role ?? "—"}
              </span>
              <span className="text-[11px] text-slate-400">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Notification bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
          </button>

          {/* User avatar + logout */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition hover:bg-white/10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-semibold text-white shadow-md shadow-amber-500/30">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-slate-200 sm:inline">
              {user?.name ?? "User"}
            </span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-rose-500/20 hover:text-rose-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
