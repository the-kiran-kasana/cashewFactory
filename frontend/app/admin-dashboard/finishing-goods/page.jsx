"use client";

import TopBar from "../../components/navbar/TopBar";
import FinishingGood from "../../components/ui/Finishing_good";

export default function FinishingGoodsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <FinishingGood title="Finished Goods" />
    </div>
  );
}
