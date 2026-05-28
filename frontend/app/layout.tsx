import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./components/auth/AuthContext";

export const metadata: Metadata = {
  title: "Cashive Nut Store",
  description: "Factory management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
