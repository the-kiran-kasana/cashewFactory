import Link from "next/link";
import MenuIcon from "./MenuIcon";

export default function MenuCard({ item, onSelect }) {
  const { title, description, href, palette, icon } = item;

  const inner = (
    <>
      <div className="flex items-center gap-10">
        <div
          className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl ${palette.iconBg} ${palette.iconText}`}
        >
          <MenuIcon name={icon} className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="mt-1.5 text-base text-slate-500">{description}</p>
        </div>
      </div>

      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${palette.arrowBg} ${palette.arrowText} transition group-hover:translate-x-0.5`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  );

  const classes = `group flex items-center justify-between gap-5 rounded-2xl border ${palette.cardBorder} ${palette.cardBg} px-7 py-7 text-left transition hover:-translate-y-0.5 hover:shadow-md`;

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={classes}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
