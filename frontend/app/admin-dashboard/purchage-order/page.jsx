"use client";

import TopBar from "../../components/navbar/TopBar";
import PurchaseManagement from "../../components/ui/purchase_management";

export default function PurchaseOrderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <PurchaseManagement title="Purchase Management" />
    </div>
  );
}
