import { Barang, RiwayatDetail } from "../entities/Barang";

// 1. Definisikan Return Type untuk Pagination
export interface RiwayatPaginated {
  data: RiwayatDetail[];
  total: number;
}

export interface DashboardFilterParams {
  lokasiId?: number;
  kategoriId?: number;
}

export interface SelectOption {
  id: number;
  label: string;
}

export interface BarangRepository {
  getAll(search?: string): Promise<Barang[]>;
  getAllRiwayat(filters?: DashboardFilterParams): Promise<RiwayatDetail[]>;
  
  // 2. UPDATE method ini agar menerima page & limit, dan return RiwayatPaginated
  getRiwayatList(page: number, limit: number): Promise<RiwayatPaginated>;

  create(barang: Omit<Barang, 'id' | 'totalStok' | 'listStok'>): Promise<void>;
  updateStok(input: { 
    barangId: number; 
    lokasiId: number; 
    kategoriId: number; 
    jumlah: number; 
    tipe: 'masuk'|'keluar';
    tanggal?: Date; 
  }): Promise<void>;

  getLokasiOptions(): Promise<SelectOption[]>;
  getKategoriOptions(): Promise<SelectOption[]>;
}