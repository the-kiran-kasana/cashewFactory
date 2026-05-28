import { redirect } from "next/navigation";

// Root "/" always goes to login; the admin-dashboard layout's AuthGuard
// will redirect authenticated users straight through to /admin-dashboard.
export default function Home() {
  redirect("/login");
}
