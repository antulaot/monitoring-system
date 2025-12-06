"use client";

import { useState } from "react";
import { 
  X, ArrowUpCircle, ArrowDownCircle, MapPin, Tag, Hash, Save, Calendar 
} from "lucide-react";
import { transaksiStokAction } from "../data-barang/actions";
import { SelectOption } from "@/core/repositories/BarangRepository";

interface Props {
  barangId: number;
  barangNama: string;
  lokasiOptions?: SelectOption[];
  kategoriOptions?: SelectOption[];
  onClose: () => void;
}

export default function TransactionModal({ 
  barangId, 
  barangNama, 
  lokasiOptions = [], 
  kategoriOptions = [], 
  onClose 
}: Props) {
  const [tipe, setTipe] = useState<'masuk' | 'keluar'>('masuk');
  const [isLoading, setIsLoading] = useState(false);

  // Default tanggal hari ini (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("barangId", barangId.toString());
    formData.append("tipe", tipe);

    const result = await transaksiStokAction(formData);
    
    setIsLoading(false);
    if (result.success) {
      alert("Transaksi Berhasil!");
      onClose();
    } else {
      alert("Gagal: " + result.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-md border border-slate-200">
          
          <div className="flex justify-between items-center p-5 border-b bg-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Atur Stok</h3>
              <p className="text-xs text-slate-600 font-medium">{barangNama}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition shadow-sm border border-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* TABS Masuk/Keluar */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => setTipe('masuk')}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition shadow-sm ${
                  tipe === 'masuk' 
                    ? 'bg-white text-green-700 ring-1 ring-green-200' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50 shadow-none'
                }`}
              >
                <ArrowDownCircle size={18} /> Barang Masuk
              </button>
              <button
                type="button"
                onClick={() => setTipe('keluar')}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition shadow-sm ${
                  tipe === 'keluar' 
                    ? 'bg-white text-orange-700 ring-1 ring-orange-200' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300/50 shadow-none'
                }`}
              >
                <ArrowUpCircle size={18} /> Barang Keluar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              
              {/* --- INPUT TANGGAL (BARU) --- */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Tanggal Transaksi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Calendar size={18} />
                  </div>
                  <input 
                    name="tanggal" 
                    type="date" 
                    required 
                    defaultValue={today} // Otomatis hari ini
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Lokasi Gudang</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <MapPin size={18} />
                  </div>
                  <select 
                    name="lokasiId" 
                    required 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm appearance-none font-medium cursor-pointer"
                  >
                    <option value="">-- Pilih Lokasi --</option>
                    {lokasiOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Status Barang</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Tag size={18} />
                  </div>
                  <select 
                    name="kategoriId" 
                    required 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm appearance-none font-medium cursor-pointer"
                  >
                    {kategoriOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">
                  Jumlah ({tipe === 'masuk' ? 'Diterima' : 'Dikeluarkan'})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Hash size={18} />
                  </div>
                  <input 
                    name="jumlah" 
                    type="number" 
                    min="1" 
                    step="0.01" 
                    required 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm placeholder:text-slate-400 font-medium"
                    placeholder="0"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3.5 rounded-lg font-bold text-white transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 ${
                  tipe === 'masuk' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isLoading ? "Memproses..." : "Simpan Transaksi"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}