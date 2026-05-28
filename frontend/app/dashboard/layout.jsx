import { InventoryProvider } from "../components/inventory/InventoryContext";
import AuthGuard from "../components/auth/AuthGuard";

// Wraps every /dashboard/* route in AuthGuard (redirects to /login if not
// authenticated) and InventoryProvider so any page can call useInventory().
export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <InventoryProvider>{children}</InventoryProvider>
    </AuthGuard>
  );
}
