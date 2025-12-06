export interface GrafikItem {
  name: string;   // Nama Bulan (Jan, Feb, ...)
  masuk: number;  // Total Masuk
  keluar: number; // Total Keluar
}

export interface DashboardStats {
  grafikData: GrafikItem[];
  totalTransaksi: number;
  totalMasuk: number;
  totalKeluar: number;
  saldoAwal: number;
}