export interface PT {
  id: number;
  nama: string;
  alamat: string | null;
}

export interface Lokasi {
  id: number;
  nama: string;
  ptId: number;
  namaPt: string; // Untuk tampilan
}