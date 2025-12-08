import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";
import { GetRiwayatLog } from "@/core/use-cases/GetRiwayatLog";
import { createClient } from "@/utils/supabase/server";
import TabelRiwayat from "../components/TabelRiwayat";
import ExportButton from "@/app/components/ExportButton"; 
import PaginationControls from "@/app/components/PaginationControls"; // <-- Import Baru

export const dynamic = 'force-dynamic';

export default async function RiwayatPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Ambil Parameter Halaman (Default ke 1)
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const LIMIT = 10; // Jumlah data per halaman

  // 2. Setup Clean Architecture
  const repo = new SupabaseBarangRepo();
  const useCase = new GetRiwayatLog(repo);
  
  // 3. Eksekusi Use Case (Ambil data parsial & total)
  const { data, total } = await useCase.execute(currentPage, LIMIT);
  
  // 4. Hitung Total Halaman
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h1>
          <p className="text-sm text-slate-500">Log aktivitas keluar masuk barang (Audit Trail)</p>
        </div>

        {/* Tombol Export (Ingat: ini export yang tampil di layar saja, kalau mau semua pakai logic terpisah) */}
        <div className="flex gap-2">
           <ExportButton data={data} fileName="Riwayat-Transaksi" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Render Tabel */}
        <TabelRiwayat data={data} />
        
        {/* Render Kontrol Pagination */}
        <PaginationControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
        />
      </div>
    </div>
  );
}