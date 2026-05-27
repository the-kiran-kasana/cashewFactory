export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-50 shadow-md shadow-amber-500/30 ring-1 ring-white/10">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M7 13c-2 0-4-1.5-4-4 0-3 2.5-5 5-5 1.6 0 2.8.7 3.7 1.7C12.6 4.7 14 4 15.5 4 18.5 4 21 6 21 9c0 2.5-2 4-4 4-1.4 0-2.4-.5-3.2-1.3-.4 1-.8 2-1.3 3-1 2.3-2.3 4.3-4.2 5.3-1.6.8-3.3-.4-3.3-2 0-1.2.5-2.3 1.2-3.3.6-.8 1.4-1.5 1.8-2.3.1-.2.2-.4 0-.4z" />
        </svg>
      </span>
      <div className="leading-tight">
        <div className="text-base font-bold tracking-wide text-white">
          CASHIVE
        </div>
        <div className="text-[10px] font-semibold tracking-[0.25em] text-amber-300/80">
          NUT STORE
        </div>
      </div>
    </div>
  );
}
