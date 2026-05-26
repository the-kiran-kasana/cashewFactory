import Logo from "./Logo";

export default function TopBar() {
  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg shadow-slate-900/20 ring-1 ring-white/5">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-6 md:px-10">
        <Logo />

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-white">
              Welcome back! <span aria-hidden="true">👋</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Manage your nut store efficiency
            </div>
          </div>

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

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-semibold text-white shadow-md shadow-amber-500/30">
              A
            </span>
            <span className="hidden text-sm font-medium text-slate-200 sm:inline">
              Admin
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-slate-400"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
