import { InventoryProvider } from "../../components/inventory/InventoryContext";

// Wraps every /dashboard/* route in the InventoryProvider so any page (current
// or future) can call useInventory() safely — including during the build-time
// prerender pass. Without this, individual routes throw
// "useInventory must be used inside InventoryProvider".
export default function DashboardLayout({ children }) {
  return <InventoryProvider>{children}</InventoryProvider>;
}
