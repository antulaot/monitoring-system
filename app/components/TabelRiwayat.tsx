"use client";

import { RiwayatDetail } from "@/core/entities/Barang";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calendar, 
  MapPin, 
  Package,
  Tag 
} from "lucide-react";

export default function TabelRiwayat({ data }: { data: RiwayatDetail[] }) {
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const formatNumber = (num: number) => num.toLocaleString('id-ID');

  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-500 bg-white rounded border">Belum ada riwayat transaksi.</div>;
  }

  // --- HELPER COMPONENT: BADGE STATUS ---
  const StatusBadge = ({ tipe }: { tipe: 'masuk' | 'keluar' }) => {
    const isMasuk = tipe === 'masuk';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
        isMasuk 
          ? 'bg-green-50 text-green-700 border-green-200' 
          : 'bg-orange-50 text-orange-700 border-orange-200'
      }`}>
        {isMasuk ? <ArrowDownCircle size={10} /> : <ArrowUpCircle size={10} />}
        {tipe}
      </span>
    );
  };

  return (
    <>
      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Waktu</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Barang</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Lokasi & Aktivitas</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                {/* WAKTU */}
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                  {formatDate(item.tanggal)}
                </td>
                
                {/* BARANG */}
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{item.namaBarang}</div>
                  <div className="text-xs text-slate-400 font-mono">ID: #{item.id}</div>
                </td>

                {/* LOKASI & STATUS (Diperjelas Disini) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-700">{item.namaLokasi}</span>
                    {/* Badge Status Masuk/Keluar */}
                    <StatusBadge tipe={item.tipe} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Tag size={12} />
                    {item.namaKategori}
                  </div>
                </td>

                {/* JUMLAH */}
                <td className="px-6 py-4 text-right">
                  <div className={`font-bold text-base ${
                    item.tipe === 'masuk' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {item.tipe === 'masuk' ? '+' : '-'}{formatNumber(item.jumlah)}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">{item.satuan}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD LIST --- */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
            {/* Indikator Warna Kiri */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              item.tipe === 'masuk' ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            
            <div className="pl-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={14} />
                  {formatDate(item.tanggal)}
                </div>
                {/* Badge Status Mobile */}
                <StatusBadge tipe={item.tipe} />
              </div>

              <h4 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                <Package size={18} className="text-slate-400" />
                {item.namaBarang}
              </h4>

              <div className="flex justify-between items-end mt-3 pt-3 border-t border-dashed border-slate-100">
                <div className="text-sm text-slate-600">
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin size={14} /> {item.namaLokasi}
                  </div>
                  <div className="text-xs text-slate-400 pl-5">{item.namaKategori}</div>
                </div>
                
                <div className={`text-right ${
                  item.tipe === 'masuk' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  <div className="text-xl font-bold">
                    {formatNumber(item.jumlah)}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase">{item.satuan}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}