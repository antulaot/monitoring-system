import { BarangRepository, DashboardFilterParams } from "../repositories/BarangRepository";
import { DashboardStats, GrafikItem } from "../entities/DashboardStats";

export class GetDashboardData {
  constructor(private repo: BarangRepository) {}

  async execute(filters?: DashboardFilterParams): Promise<DashboardStats> {
    // 1. Ambil SEMUA data riwayat (sudah terfilter Lokasi/Kategori oleh Repo)
    const dataMentah = await this.repo.getAllRiwayat(filters);

    // 2. Tentukan Tahun Berjalan (Saat ini)
    const currentYear = new Date().getFullYear(); 
    
    // Wadah 12 Bulan
    const bulanNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const grafikData: GrafikItem[] = bulanNames.map(bulan => ({
      name: bulan,
      masuk: 0,
      keluar: 0
    }));

    let totalMasuk = 0;
    let totalKeluar = 0;
    let saldoAwal = 0; // Variabel Penampung Saldo Awal

    // 3. LOOPING & PEMISAHAN DATA
    dataMentah.forEach(item => {
      const date = new Date(item.tanggal);
      const year = date.getFullYear();

      // KASUS A: Transaksi Tahun-tahun Sebelumnya (Menjadi Saldo Awal)
      if (year < currentYear) {
        if (item.tipe === 'masuk') {
          saldoAwal += item.jumlah;
        } else {
          saldoAwal -= item.jumlah;
        }
      }
      
      // KASUS B: Transaksi Tahun Ini (Masuk ke Grafik)
      else if (year === currentYear) {
        const bulanIndex = date.getMonth();
        
        if (item.tipe === 'masuk') {
          grafikData[bulanIndex].masuk += item.jumlah;
          totalMasuk += item.jumlah;
        } else {
          grafikData[bulanIndex].keluar += item.jumlah;
          totalKeluar += item.jumlah;
        }
      }
    });

    return {
      grafikData,
      totalTransaksi: dataMentah.filter(d => new Date(d.tanggal).getFullYear() === currentYear).length,
      totalMasuk,
      totalKeluar,
      saldoAwal // <--- Kirim hasil perhitungan
    };
  }
}