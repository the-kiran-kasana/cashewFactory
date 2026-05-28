"use client";

import TopBar from "../../components/navbar/TopBar";
import ProductionStore from "../../components/ui/Production_Store";

export default function ProductionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <ProductionStore title="Production Store" />
    </div>
  );
}
