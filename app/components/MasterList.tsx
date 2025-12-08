"use client";

import { PT, Lokasi } from "@/core/entities/MasterData";
import { Trash2, Building2, MapPin, Plus, Filter } from "lucide-react"; // Tambah Icon Filter
import { deletePTAction, deleteLokasiAction } from "../settings/actions";
import { useState } from "react";
import AddMasterModal from "./AddMasterModal";

interface Props {
  listPT: PT[];
  listLokasi: Lokasi[];
}

export default function MasterLists({ listPT, listLokasi }: Props) {
  const [modalType, setModalType] = useState<'pt' | 'lokasi' | null>(null);
  
  // 1. STATE UNTUK FILTER
  const [filterPtId, setFilterPtId] = useState<string>(""); // Default "" artinya Semua

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

  // 2. LOGIKA FILTERING
  const filteredLokasi = listLokasi.filter((lok) => {
    if (!filterPtId) return true; // Tampilkan semua jika tidak ada filter
    return lok.ptId === Number(filterPtId);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* --- KOLOM 1: DAFTAR PT (KIRI) --- */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-blue-600" size={20} /> 
            <span>Daftar Perusahaan (PT)</span>
          </h3>
          <button 
            onClick={() => setModalType('pt')}
            className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 transition shadow-sm"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2">
          {listPT.length === 0 ? (
             <p className="text-sm text-slate-400 italic text-center py-4">Belum ada data PT.</p>
          ) : (
            listPT.map(pt => (
              <div key={pt.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50 hover:bg-white hover:border-blue-200 transition group">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{pt.nama}</div>
                  <div className="text-xs text-slate-500">{pt.alamat || '-'}</div>
                </div>
                <button onClick={() => handleDeletePT(pt.id)} className="text-slate-300 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- KOLOM 2: DAFTAR LOKASI (KANAN) --- */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-orange-600" size={20} /> 
            <span>Daftar Lokasi Gudang</span>
          </h3>
          <button 
            onClick={() => setModalType('lokasi')}
            className="text-xs bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-1 transition shadow-sm"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>

        {/* 3. INPUT FILTER PT */}
        <div className="mb-4 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
          <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1">
            <Filter size={12} /> Filter berdasarkan PT
          </label>
          <select 
            value={filterPtId}
            onChange={(e) => setFilterPtId(e.target.value)}
            className="w-full text-sm border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer bg-white"
          >
            <option value="">-- Tampilkan Semua --</option>
            {listPT.map(pt => (
              <option key={pt.id} value={pt.id}>{pt.nama}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-2">
          {filteredLokasi.length === 0 ? (
             <p className="text-sm text-slate-400 italic text-center py-8 bg-slate-50 rounded-lg border border-dashed">
               {filterPtId ? "Tidak ada gudang di PT ini." : "Belum ada data lokasi."}
             </p>
          ) : (
            filteredLokasi.map(lok => (
              <div key={lok.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50 hover:bg-white hover:border-orange-200 transition group">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{lok.nama}</div>
                  <div className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1">
                    <Building2 size={10} />
                    {lok.namaPt}
                  </div>
                </div>
                <button onClick={() => handleDeleteLokasi(lok.id)} className="text-slate-300 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalType && (
        <AddMasterModal 
          type={modalType} 
          listPT={listPT} 

          defaultPtId={filterPtId}
          onClose={() => setModalType(null)} 
        />
      )}

    </div>
  );
}