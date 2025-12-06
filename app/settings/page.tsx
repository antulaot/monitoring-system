import { SupabaseMasterRepo } from "@/infrastructure/supabase/SupabaseMasterRepo";
import MasterLists from "../components/MasterList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // 1. Proteksi Halaman (Hanya Login)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ambil Data
  const repo = new SupabaseMasterRepo();
  const listPT = await repo.getPTs();
  const listLokasi = await repo.getLokasi();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Master Data</h1>
        <p className="text-sm text-slate-500">Kelola daftar Perusahaan dan Lokasi Gudang</p>
      </div>

      {/* Render Client Component */}
      <MasterLists listPT={listPT} listLokasi={listLokasi} />
    </div>
  );
}