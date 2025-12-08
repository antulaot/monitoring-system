// Definisi Rincian Stok (Inventaris)
export interface StokDetail {
  id: number;
  namaPt: string;        // Dari tabel master_pt
  namaLokasi: string;    // Dari tabel master_lokasi
  namaKategori: string;  // Dari tabel master_kategori
  jumlah: number;
}

// Definisi Utama Barang
export interface Barang {
  id: number;
  kode: string | null;
  nama: string;
  satuan: string;
  deskripsi: string | null;
  
  // List rincian untuk ditampilkan (misal di modal / accordion)
  listStok?: StokDetail[];
  
  // Total akumulasi untuk tampilan tabel depan
  totalStok: number; 
}
// Definisi Riwayat Barang
export interface RiwayatDetail {
  id: number;
  tanggal: string; // ISO String
  namaBarang: string;
  namaLokasi: string;
  namaPt: string;
  namaKategori: string;
  tipe: 'masuk' | 'keluar';
  jumlah: number;
  satuan: string;
  userEmail: string; // Siapa yang input
}
