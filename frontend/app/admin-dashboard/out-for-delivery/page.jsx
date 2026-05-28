"use client";

import TopBar from "../../components/navbar/TopBar";
import OrderOfDelivery from "../../components/ui/Order_of_delivery";

export default function OutForDeliveryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
      <TopBar />
      <OrderOfDelivery title="Out for Delivery" />
    </div>
  );
}
