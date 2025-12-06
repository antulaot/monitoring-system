"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SelectOption } from "@/core/repositories/BarangRepository";
import { Filter, MapPin, Tag } from "lucide-react"; // Import Ikon

interface Props {
  lokasiOptions: SelectOption[];
  kategoriOptions: SelectOption[];
}

export default function DashboardFilter({ lokasiOptions, kategoriOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentLokasi = searchParams.get("lokasiId") || "";
  const currentKategori = searchParams.get("kategoriId") || "";

  // Fungsi Generic untuk Update URL
  const updateFilter = (key: string, value: string) => {
    // 1. Ambil params yang ada sekarang (agar filter lain tidak hilang)
    const params = new URLSearchParams(searchParams.toString());
    
    // 2. Set atau Hapus params yang baru
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // 3. Push URL baru
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border shadow-sm">
      
      <div className="flex items-center gap-2 px-2 border-r border-slate-200">
        <Filter size={16} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter</span>
      </div>

      {/* DROPDOWN 1: LOKASI */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
          <MapPin size={14} />
        </div>
        <select 
          value={currentLokasi}
          onChange={(e) => updateFilter("lokasiId", e.target.value)}
          className="pl-8 pr-8 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-lg text-slate-700 font-medium outline-none cursor-pointer transition appearance-none min-w-[140px]"
        >
          <option value="">Semua Lokasi</option>
          {lokasiOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* DROPDOWN 2: KATEGORI (BARU) */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
          <Tag size={14} />
        </div>
        <select 
          value={currentKategori}
          onChange={(e) => updateFilter("kategoriId", e.target.value)}
          className="pl-8 pr-8 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-lg text-slate-700 font-medium outline-none cursor-pointer transition appearance-none min-w-[140px]"
        >
          <option value="">Semua Status</option>
          {kategoriOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

    </div>
  );
}