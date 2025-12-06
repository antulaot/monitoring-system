import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";
import { GetRiwayatLog } from "@/core/use-cases/GetRiwayatLog";
import { createClient } from "@/utils/supabase/server";
import TabelRiwayat from "../components/TabelRiwayat";

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h1>
          <p className="text-sm text-slate-500">Log aktivitas keluar masuk barang (Audit Trail)</p>
        </div>
      </div>

      <TabelRiwayat data={dataRiwayat} />
    </div>
  );
}