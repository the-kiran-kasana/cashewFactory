"use client";

import { useState } from "react";
import TopBar from "../../components/navbar/TopBar";
import MenuGrid from "../../components/cards/MenuGrid";
import { InventoryProvider } from "../../components/inventory/InventoryContext";
import Stock from "../../components/ui/Stock";
import Vendor from "../../components/ui/vendor";
import PurchaseManagement from "../../components/ui/purchase_management";
import ProductionStore from "../../components/ui/Production_Store";
import FinishingGood from "../../components/ui/Finishing_good";
import OrderOfDelivery from "../../components/ui/Order_of_delivery";
import setting from "../../components/ui/setting";
import user from "../../components/ui/user";

const SECTIONS = {
  Stock: { title: "Stock", Component: Stock },
  production: { title: "Production Store", Component: ProductionStore },
  "finished-goods": { title: "Finished Goods", Component: FinishingGood },
  "purchase-order": { title: "Purchase Management", Component: PurchaseManagement },
  "out-for-delivery": { title: "Out for Delivery", Component: OrderOfDelivery },
  vendor: { title: "Vendors", Component: Vendor },
  user: { title: "User", Component: user },
  settings: { title: "Settings", Component: setting },
};

export default function DashboardPage() {
  const [activeKey, setActiveKey] = useState(null);
  const active = activeKey ? SECTIONS[activeKey] : null;
  const Section = active?.Component;

  return (
    <InventoryProvider>
      <div className="flex min-h-screen flex-col bg-[#F5FFFA]">
        <TopBar />

        {active ? (
          <Section title={active.title} onBack={() => setActiveKey(null)} />
        ) : (
          <main className="flex flex-1 px-4 py-4 md:px-8 md:py-6">
            <section className="flex w-full flex-1 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 md:p-14">
              <div className="m-auto w-full max-w-[1500px]">
                <MenuGrid onSelect={(key) => setActiveKey(key)} />
              </div>
            </section>
          </main>
        )}

        <footer className="px-6 pb-4 text-center text-xs text-slate-500">
          © 2024 Cashive Nut Store. All rights reserved.
        </footer>
      </div>
    </InventoryProvider>
  );
}
