"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar({ 
  isLoggedIn, 
  onMenuClick 
}: { 
  isLoggedIn: boolean; 
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      
      <div className="flex items-center gap-3">
        {/* HANYA TAMPILKAN TOMBOL MENU JIKA LOGIN */}
        {isLoggedIn && (
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <h2 className="text-lg font-semibold text-slate-800">
          {/* Ubah Judul jika Guest */}
          {isLoggedIn ? "Overview" : "Public Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="hidden sm:block text-right">
              <span className="block text-sm font-medium text-slate-700">Admin</span>
              <span className="block text-xs text-green-600">Online</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="rounded-full bg-red-50 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-red-600 hover:bg-red-100 transition">
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm hover:shadow-md"
          >
            Login Admin
          </Link>
        )}
      </div>
    </header>
  );
}