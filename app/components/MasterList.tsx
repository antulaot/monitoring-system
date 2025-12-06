"use client";

import { PT, Lokasi } from "@/core/entities/MasterData";
import { Trash2, Building2, MapPin, Plus } from "lucide-react";
import { deletePTAction, deleteLokasiAction } from "../settings/actions";
import { useState } from "react";
import AddMasterModal from "./AddMasterModal"; // Kita buat setelah ini

interface Props {
  listPT: PT[];
  listLokasi: Lokasi[];
}

export default function MasterLists({ listPT, listLokasi }: Props) {
  // State untuk membuka modal (tipe: 'pt' | 'lokasi' | null)
  const [modalType, setModalType] = useState<'pt' | 'lokasi' | null>(null);

  const handleDeletePT = async (id: number) => {
    if (confirm("Hapus PT ini? Semua lokasi dan stok terkait akan ikut terhapus!")) {
      await deletePTAction(id);
    }
  };

  const handleDeleteLokasi = async (id: number) => {
    if (confirm("Hapus Lokasi ini?")) {
      await deleteLokasiAction(id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* --- KOLOM 1: DAFTAR PT --- */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Daftar Perusahaan (PT)
          </h3>
          <button 
            onClick={() => setModalType('pt')}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        
        <div className="space-y-3">
          {listPT.map(pt => (
            <div key={pt.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50">
              <div>
                <div className="font-bold text-slate-800 text-sm">{pt.nama}</div>
                <div className="text-xs text-slate-500">{pt.alamat || '-'}</div>
              </div>
              <button onClick={() => handleDeletePT(pt.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- KOLOM 2: DAFTAR LOKASI --- */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-orange-600" /> Daftar Lokasi Gudang
          </h3>
          <button 
            onClick={() => setModalType('lokasi')}
            className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 flex items-center gap-1"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>

        <div className="space-y-3">
          {listLokasi.map(lok => (
            <div key={lok.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50">
              <div>
                <div className="font-bold text-slate-800 text-sm">{lok.nama}</div>
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">
                  {lok.namaPt}
                </div>
              </div>
              <button onClick={() => handleDeleteLokasi(lok.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL (Reusable) */}
      {modalType && (
        <AddMasterModal 
          type={modalType} 
          listPT={listPT} 
          onClose={() => setModalType(null)} 
        />
      )}

    </div>
  );
}