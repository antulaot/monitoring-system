import { BarangRepository } from "../repositories/BarangRepository";

export type TipeTransaksi = 'masuk' | 'keluar';

export interface TransaksiInput {
  barangId: number;
  lokasiId: number;
  kategoriId: number;
  jumlah: number;
  tipe: TipeTransaksi;
  tanggal?: Date; // <--- TAMBAHAN BARU
  keterangan?: string; // <--- TAMBAHAN BARU
}

export class TransactStok {
  constructor(private repo: BarangRepository) {}

  async execute(input: TransaksiInput) {
    if (input.jumlah <= 0) {
      throw new Error("Jumlah harus lebih dari 0");
    }
    return await this.repo.updateStok(input);
  }
}