"use client";

import TopBar from "../../components/navbar/TopBar";
import Setting from "../../components/ui/setting";

export default function SettingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <Setting title="Settings" />
    </div>
  );
}
