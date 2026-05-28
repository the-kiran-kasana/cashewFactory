"use client";

import TopBar from "../../components/navbar/TopBar";
import Stock from "../../components/ui/Stock";

export default function StorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <Stock title="Stock" />
    </div>
  );
}
