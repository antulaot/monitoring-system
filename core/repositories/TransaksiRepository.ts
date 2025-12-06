import { TransaksiBarang } from "../entities/TransaksiBarang";

export interface TransaksiRepository {
  getAll(): Promise<TransaksiBarang[]>;
  // Nanti bisa tambah: create(), delete(), update()
}