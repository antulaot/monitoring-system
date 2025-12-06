import { PT, Lokasi } from "../entities/MasterData";

export interface MasterRepository {
  // PT
  getPTs(): Promise<PT[]>;
  createPT(data: { nama: string; alamat: string }): Promise<void>;
  deletePT(id: number): Promise<void>;

  // Lokasi
  getLokasi(): Promise<Lokasi[]>;
  createLokasi(data: { nama: string; ptId: number }): Promise<void>;
  deleteLokasi(id: number): Promise<void>;
}