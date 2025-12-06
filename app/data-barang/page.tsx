import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";
import { GetBarangList } from "@/core/use-cases/GetBarangList";
import { createClient } from "@/utils/supabase/server";
import TabelBarang from "../components/TabelBarang";
import AddBarangModal from "../components/AddBarangModal";

export const dynamic = 'force-dynamic';

export default async function DataBarangPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  // 1. Inisialisasi Repo
  const repo = new SupabaseBarangRepo();
  
  // 2. Ambil Data Barang
  const useCase = new GetBarangList(repo);
  const dataBarang = await useCase.execute();

  // 3. AMBIL DATA DROPDOWN (Lokasi & Kategori)
  // Kita panggil langsung method repo yang baru kita buat
  const lokasiOpts = await repo.getLokasiOptions();
  const kategoriOpts = await repo.getKategoriOptions();


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Master Barang</h1>
          <p className="text-sm text-slate-500">Daftar produk dan posisi stok di semua gudang</p>
        </div>
        
        {isAdmin && <AddBarangModal />} 
      </div>

      {/* 4. Kirim Data Dropdown ke Tabel */}
      <TabelBarang 
        data={dataBarang} 
        isAdmin={isAdmin} 
        lokasiOptions={lokasiOpts}
        kategoriOptions={kategoriOpts}
      />
    </div>
  );
}