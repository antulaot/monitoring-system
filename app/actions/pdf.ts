"use server";

import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";

export async function getAllDataForPdf(lokasiId?: number, kategoriId?: number) {
  const repo = new SupabaseBarangRepo();
  
  // Kita gunakan getAllRiwayat yang sudah ada (karena ini return semua data tanpa paginasi)
  // Pastikan repo.getAllRiwayat Anda sudah support filter objek {lokasiId, kategoriId}
  const data = await repo.getAllRiwayat({ lokasiId, kategoriId });

  // Kita perlu mengambil nama PT juga. 
  // Jika getAllRiwayat belum return namaPt (seperti revisi Excel sebelumnya), 
  // pastikan Anda sudah update Reponya sesuai panduan Excel sebelumnya.
  return data;
}