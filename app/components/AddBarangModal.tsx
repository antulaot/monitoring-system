"use client";

import { useState } from "react";
import { createBarangAction } from "../data-barang/actions";
import { 
  X, Plus, Package, Barcode, Scale, FileText, Save 
} from "lucide-react";

export default function AddBarangModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createBarangAction(formData);

    setIsLoading(false);
    if (result.success) {
      alert("Barang berhasil ditambahkan!");
      setIsOpen(false);
    } else {
      alert("Gagal: " + result.message);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm active:scale-95"
      >
        <Plus size={18} />
        <span className="hidden sm:inline">Tambah Barang</span>
        <span className="sm:hidden">Barang</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            
            {/* BACKGROUND GELAP (Backdrop) - Tetap transparan hitam agar fokus */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* KONTEN MODAL - DIUBAH AGAR LEBIH KONTRAS */}
            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-lg border border-slate-200">
              
              {/* HEADER: Ubah jadi Solid (bg-slate-100) jangan transparan */}
              <div className="flex justify-between items-center p-5 border-b bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm border border-slate-100">
                    <Package size={20} />
                  </div>
                  <div>
                    {/* Teks lebih gelap (slate-900) */}
                    <h3 className="font-extrabold text-slate-900 text-lg">Tambah Barang</h3>
                    <p className="text-xs text-slate-600 font-medium">Input data master produk baru</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 rounded-full bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition shadow-sm border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM AREA */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Input Nama Barang */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Nama Barang</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Package size={18} />
                    </div>
                    {/* PERBAIKAN: Tambah bg-slate-50 agar input terlihat jelas */}
                    <input 
                      name="nama" 
                      type="text" 
                      required 
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm placeholder:text-slate-400 font-medium"
                      placeholder="Contoh: Pupuk Urea"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Grid 2 Kolom */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Kode Barang</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Barcode size={18} />
                      </div>
                      <input 
                        name="kode" 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm placeholder:text-slate-400 font-medium"
                        placeholder="P-001" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Satuan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Scale size={18} />
                      </div>
                      <select 
                        name="satuan" 
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm cursor-pointer appearance-none font-medium"
                      >
                        <option value="Ton">Ton</option>
                        <option value="Kg">Kg</option>
                        <option value="Sak">Sak</option>
                        <option value="Liter">Liter</option>
                        <option value="Pcs">Pcs</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 ml-1">Deskripsi</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-slate-500">
                      <FileText size={18} />
                    </div>
                    <textarea 
                      name="deskripsi" 
                      rows={3} 
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm placeholder:text-slate-400 resize-none font-medium"
                      placeholder="Catatan tambahan..."
                    ></textarea>
                  </div>
                </div>

                {/* Footer Tombol */}
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3.5 rounded-lg font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-[2] py-3.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Menyimpan...</span>
                    ) : (
                      <>
                        <Save size={18} /> Simpan Data
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}