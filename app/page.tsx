import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";
import { GetDashboardData } from "@/core/use-cases/GetDashboardData";
import LineChartCard from "./components/LineChartCard";
import DashboardTable from "./components/DashboardTable";
import DashboardFilter from "./components/DashboardFilter";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return {
    title: user ? "Dashboard Admin" : "Dashboard View Only",
  };
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ lokasiId?: string; kategoriId?: string }> 
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // 1. Tunggu Params (Next.js 15 Async Params)
  const params = await searchParams;
  const filterLokasi = params.lokasiId ? Number(params.lokasiId) : undefined;
  const filterKategori = params.kategoriId ? Number(params.kategoriId) : undefined;

  const repo = new SupabaseBarangRepo();
  const useCase = new GetDashboardData(repo);

  const lokasiOpts = await repo.getLokasiOptions();
  const kategoriOpts = await repo.getKategoriOptions();

  // 2. Initial State (Tambahkan saldoAwal)
  let stats = { 
    grafikData: [], 
    totalTransaksi: 0, 
    totalMasuk: 0, 
    totalKeluar: 0,
    saldoAwal: 0 // <--- Default value untuk Saldo Awal
  };

  try {
    stats = await useCase.execute({ 
      lokasiId: filterLokasi, 
      kategoriId: filterKategori 
    });
  } catch (err) {
    console.error("Gagal load dashboard:", err);
  }

  const labelLokasi = filterLokasi ? lokasiOpts.find(l => l.id === filterLokasi)?.label : "Semua Lokasi";
  const labelKategori = filterKategori ? kategoriOpts.find(k => k.id === filterKategori)?.label : "Semua Status";

  // Helper Format Angka
  const formatNumber = (num: number) => num.toLocaleString('id-ID');

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
           <h2 className="text-xl font-bold text-slate-800">
             Laporan Dashboard
           </h2>
           <p className="text-sm text-slate-500 flex items-center gap-2">
             Tampilkan: <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{labelLokasi}</span> 
             & <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{labelKategori}</span>
           </p>
        </div>

        <DashboardFilter 
          lokasiOptions={lokasiOpts} 
          kategoriOptions={kategoriOpts} 
        />
      </div>

      {/* KARTU STATISTIK RINGKAS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 flex-shrink-0">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500">Total Transaksi</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {formatNumber(stats.totalTransaksi)}
            </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500">Total Masuk</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              +{formatNumber(stats.totalMasuk)}
            </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500">Total Keluar</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              -{formatNumber(stats.totalKeluar)}
            </p>
        </div>
      </div>

      {/* SPLIT VIEW: GRAFIK & TABEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full">
          <LineChartCard data={stats.grafikData} isEditable={isLoggedIn} />
        </div>
        <div className="lg:col-span-1 h-full">
          {/* UPDATE: Mengirim props 'saldoAwal' ke komponen tabel */}
          <DashboardTable 
            data={stats.grafikData} 
            saldoAwal={stats.saldoAwal} 
          />
        </div>
      </div>

    </div>
  );
}