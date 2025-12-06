"use client";

import { Barang } from "@/core/entities/Barang";
import { SelectOption } from "@/core/repositories/BarangRepository";
import { useState, Fragment } from "react";
import { ChevronDown, ChevronRight, MapPin, Box, Package } from "lucide-react";
import TransactionModal from "./TransactionModal";

interface Props {
  data: Barang[];
  isAdmin: boolean;
  lokasiOptions?: SelectOption[];
  kategoriOptions?: SelectOption[];
}

export default function TabelBarang({ 
  data, 
  isAdmin, 
  lokasiOptions = [], 
  kategoriOptions = [] 
}: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // --- HELPER: FORMAT ANGKA INDONESIA ---
  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID'); 
    // Contoh: 1500 -> 1.500
  };

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-slate-500 bg-white rounded border">Data kosong.</div>;
  }

  // --- KOMPONEN RINCIAN STOK ---
  const StokDetailList = ({ item }: { item: Barang }) => (
    <div className="mt-3 pt-3 border-t border-dashed">
      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
        <MapPin size={14} /> Rincian Lokasi Stok
      </h4>
      {item.listStok && item.listStok.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {item.listStok.map((stok) => (
            <div key={stok.id} className="flex justify-between items-center p-2 border rounded bg-slate-50 text-xs">
              <div>
                <div className="font-semibold text-slate-800">{stok.namaLokasi}</div>
                <div className="text-[10px] text-slate-500">{stok.namaPt}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold flex items-center justify-end gap-1 ${
                  stok.namaKategori === 'Rusak' || stok.namaKategori === 'Expired' 
                  ? 'text-red-600' : 'text-green-600'
                }`}>
                  {/* UPDATE: Pakai Format Number */}
                  <span>{formatNumber(stok.jumlah)}</span>
                  
                  <span className="text-[10px] font-normal text-slate-500 uppercase">
                    {item.satuan}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">{stok.namaKategori}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic text-xs">Belum ada data stok.</p>
      )}
    </div>
  );

  return (
    <>
      {/* TAMPILAN DESKTOP (TABEL) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Nama Barang</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Kode</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Total Stok</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item) => (
              <Fragment key={item.id}>
                <tr className="hover:bg-slate-50 cursor-pointer transition">
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2" onClick={() => toggleExpand(item.id)}>
                    {expandedId === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs" onClick={() => toggleExpand(item.id)}>{item.kode || '-'}</td>
                  
                  {/* UPDATE: Total Stok dengan Format */}
                  <td className="px-6 py-4 text-right font-bold text-blue-600" onClick={() => toggleExpand(item.id)}>
                    {formatNumber(item.totalStok)} <span className="text-slate-400 font-normal text-xs">{item.satuan}</span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {isAdmin && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setSelectedBarang(item);
                        }}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-medium flex items-center gap-1 mx-auto"
                      >
                        <Box size={14} /> Atur Stok
                      </button>
                    )}
                  </td>
                </tr>
                {expandedId === item.id && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="bg-white border rounded-lg p-4 shadow-sm">
                         <StokDetailList item={item} />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* TAMPILAN MOBILE (KARTU) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div 
              className="flex justify-between items-start mb-3 cursor-pointer"
              onClick={() => toggleExpand(item.id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{item.nama}</h3>
                  <p className="text-xs text-slate-500 font-mono">{item.kode || '-'}</p>
                </div>
              </div>
              <div className="text-right">
                {/* UPDATE: Total Stok Mobile dengan Format */}
                <p className="text-lg font-bold text-blue-600">{formatNumber(item.totalStok)}</p>
                <p className="text-[10px] text-slate-400">{item.satuan}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <button 
                onClick={() => toggleExpand(item.id)}
                className="text-xs text-slate-500 flex items-center gap-1 hover:text-blue-600"
              >
                {expandedId === item.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                Rincian Stok
              </button>

              {isAdmin && (
                <button 
                  onClick={() => setSelectedBarang(item)}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 shadow-sm active:scale-95 transition"
                >
                  <Box size={14} /> Atur Stok
                </button>
              )}
            </div>

            {expandedId === item.id && (
              <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                <StokDetailList item={item} />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedBarang && (
        <TransactionModal 
          barangId={selectedBarang.id}
          barangNama={selectedBarang.nama}
          lokasiOptions={lokasiOptions}
          kategoriOptions={kategoriOptions}
          onClose={() => setSelectedBarang(null)}
        />
      )}
    </>
  );
}