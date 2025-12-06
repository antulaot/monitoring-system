"use client";

import { createPTAction, createLokasiAction } from "../settings/actions";
import { PT } from "@/core/entities/MasterData";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  type: 'pt' | 'lokasi';
  listPT: PT[]; // Butuh list PT untuk dropdown lokasi
  onClose: () => void;
}

export default function AddMasterModal({ type, listPT, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    if (type === 'pt') {
      await createPTAction(formData);
    } else {
      await createLokasiAction(formData);
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-slate-50">
          <h3 className="font-bold text-slate-800">
            {type === 'pt' ? 'Tambah Perusahaan' : 'Tambah Lokasi'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Input Nama (Selalu Ada) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama {type === 'pt' ? 'PT' : 'Gudang'}</label>
            <input name="nama" type="text" required className="w-full border p-2 rounded-lg bg-slate-50" placeholder="Masukkan nama..." />
          </div>

          {/* Input Khusus PT: Alamat */}
          {type === 'pt' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat</label>
              <textarea name="alamat" rows={2} className="w-full border p-2 rounded-lg bg-slate-50" placeholder="Alamat kantor..."></textarea>
            </div>
          )}

          {/* Input Khusus Lokasi: Pilih PT */}
          {type === 'lokasi' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Milik PT</label>
              <select name="ptId" required className="w-full border p-2 rounded-lg bg-slate-50">
                {listPT.map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.nama}</option>
                ))}
              </select>
            </div>
          )}

          <button disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </div>
  );
}