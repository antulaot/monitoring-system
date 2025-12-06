import { BarangRepository } from "../repositories/BarangRepository";
import { Barang } from "../entities/Barang";

export class CreateBarang {
  constructor(private repo: BarangRepository) {}

  async execute(input: { nama: string; kode: string; satuan: string; deskripsi: string }) {
    // Di sini bisa validasi bisnis logic, misal: Kode barang harus huruf besar
    const dataClean = {
      ...input,
      kode: input.kode.toUpperCase(),
      nama: input.nama, // Bisa tambah .trim()
      satuan: input.satuan,
      deskripsi: input.deskripsi
    };

    return await this.repo.create(dataClean);
  }
}