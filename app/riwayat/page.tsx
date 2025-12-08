import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";
import { GetRiwayatLog } from "@/core/use-cases/GetRiwayatLog";
import { createClient } from "@/utils/supabase/server";
import TabelRiwayat from "../components/TabelRiwayat";
import ExportButton from "@/app/components/ExportButton"; // <-- Import Baru

export const dynamic = 'force-dynamic';

export default async function RiwayatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Ambil Data
  const repo = new SupabaseBarangRepo();
  const useCase = new GetRiwayatLog(repo);
  const dataRiwayat = await useCase.execute();

  return (
    <div className="space-y-6">
      
      {/* HEADER: Judul & Tombol Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h1>
          <p className="text-sm text-slate-500">Log aktivitas keluar masuk barang (Audit Trail)</p>
        </div>

        {/* Pasang Tombol Export */}
        <div className="flex gap-2">
           <ExportButton data={dataRiwayat} fileName="Riwayat-Transaksi" />
        </div>
      </div>

      <TabelRiwayat data={dataRiwayat} />
    </div>
  );
}