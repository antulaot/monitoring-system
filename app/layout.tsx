import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Opsional, sesuaikan font Anda
import "./globals.css";
import AppShell from "./components/AppShell"; // Import AppShell
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Sistem Monitoring Pupuk",
    template: "%s | AgriMonitor",
  },
  description: "Dashboard Monitoring Gudang",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Cek User di Server (Global)
  // Kita cek user di sini supaya bisa dikirim ke Navbar di seluruh halaman
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Bungkus semua halaman dengan AppShell */}
        <AppShell isLoggedIn={isLoggedIn}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}