import { InventoryProvider } from "../components/inventory/InventoryContext";
import AuthGuard from "../components/auth/AuthGuard";

export default function AdminDashboardLayout({ children }) {
  return (
    <AuthGuard>
      <InventoryProvider>{children}</InventoryProvider>
    </AuthGuard>
  );
}
