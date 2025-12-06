export interface TransaksiBarang {
  id: number;
  tanggal: string; // Atau Date, sesuaikan kebutuhan
  lokasi: string;
  jenis_transaksi: 'masuk' | 'keluar';
  jumlah: number;
}