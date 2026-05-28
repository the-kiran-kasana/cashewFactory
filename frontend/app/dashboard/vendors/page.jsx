"use client";

import TopBar from "../../components/navbar/TopBar";
import Vendor from "../../components/ui/vendor";

export default function VendorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <Vendor title="Vendors" />
    </div>
  );
}
