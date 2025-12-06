import { Barang, RiwayatDetail } from "../entities/Barang";
import { TransaksiInput } from "../use-cases/TransactStok";

export interface DashboardFilterParams {
  lokasiId?: number;
  kategoriId?: number;
}
export interface RiwayatItem {
  id: number;
  tanggal: string;
  tipe: 'masuk' | 'keluar';
  jumlah: number;
}
export interface SelectOption {
  id: number;
  label: string;
}

export interface BarangRepository {
  getAll(): Promise<Barang[]>;
  getAllRiwayat(filters?: DashboardFilterParams): Promise<RiwayatItem[]>;
  getRiwayatList(): Promise<RiwayatDetail[]>;
  
  create(barang: Omit<Barang, 'id' | 'totalStok' | 'listStok'>): Promise<void>;

  updateStok(input: { barangId: number; lokasiId: number; kategoriId: number; jumlah: number; tipe: 'masuk'|'keluar' }): Promise<void>;
  getLokasiOptions(): Promise<SelectOption[]>;
  getKategoriOptions(): Promise<SelectOption[]>;
}