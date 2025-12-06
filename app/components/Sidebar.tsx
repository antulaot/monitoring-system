"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// 1. Tambahkan import 'History'
import { LayoutDashboard, Package, Settings, X, History } from "lucide-react"; 

// 2. Ubah icon menjadi Element JSX (<Icon />), bukan referensi nama
const menuItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: <LayoutDashboard size={20} /> 
  },
  { 
    name: "Data Barang", 
    href: "/data-barang", 
    icon: <Package size={20} /> 
  },
  { 
    name: "Riwayat", 
    href: "/riwayat", 
    icon: <History size={20} /> 
  },
  { 
    name: "Pengaturan", 
    href: "/settings", 
    icon: <Settings size={20} /> 
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* 1. OVERLAY GELAP (KHUSUS MOBILE) */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 2. SIDEBAR UTAMA */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r bg-white text-slate-800 shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-xl font-bold text-blue-600">AgriMonitor</h1>
          
          {/* Tombol Close (Hanya muncul di Mobile) */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                // Di Mobile: Klik menu -> Tutup Sidebar. Di Desktop: Biarkan terbuka.
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* 3. Panggil langsung variabel item.icon */}
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4 text-xs text-slate-400 text-center">
          v1.0.0
        </div>
      </aside>
    </>
  );
}