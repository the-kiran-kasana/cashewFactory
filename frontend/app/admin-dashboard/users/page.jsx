"use client";

import TopBar from "../../components/navbar/TopBar";
import User from "../../components/ui/user";

export default function UsersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <User title="User Management" />
    </div>
  );
}
