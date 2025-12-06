"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Logic resize layar (tetap sama)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. KONDISI RENDER SIDEBAR */}
      {/* Hanya tampilkan Sidebar JIKA user sudah login */}
      {isLoggedIn && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* 2. ATUR MARGIN KONTEN */}
      {/* Jika Login & Sidebar Buka -> Margin 64. Jika Tidak Login -> Margin 0 */}
      <div 
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          isLoggedIn && isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        
        <Navbar 
          isLoggedIn={isLoggedIn} 
          // Tombol menu hanya berfungsi jika Login (karena sidebar cuma ada kalau login)
          onMenuClick={() => {
            if (isLoggedIn) setIsSidebarOpen(!isSidebarOpen);
          }} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}