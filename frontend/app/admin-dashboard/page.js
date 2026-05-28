"use client";

import TopBar from "../components/navbar/TopBar";
import MenuGrid from "../components/cards/MenuGrid";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />

      <main className="flex flex-1 px-4 py-4 md:px-8 md:py-6">
        <section className="flex w-full flex-1 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 md:p-14">
          <div className="m-auto w-full max-w-[1500px]">
            <MenuGrid />
          </div>
        </section>
      </main>

      <footer className="px-6 pb-4 text-center text-xs text-slate-500">
        © 2024 Cashive Nut Store. All rights reserved.
      </footer>
    </div>
  );
}
