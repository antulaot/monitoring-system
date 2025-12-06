"use server";

import { SupabaseBarangRepo } from "@/infrastructure/supabase/SupabaseBarangRepo";
import { CreateBarang } from "@/core/use-cases/CreateBarang";
import { revalidatePath } from "next/cache";
import { TransactStok } from "@/core/use-cases/TransactStok";

export async function createBarangAction(formData: FormData) {
  // 1. Ambil data dari form HTML
  const nama = formData.get("nama") as string;
  const kode = formData.get("kode") as string;
  const satuan = formData.get("satuan") as string;
  const deskripsi = formData.get("deskripsi") as string;

  // 2. Inisialisasi Clean Architecture
  const repo = new SupabaseBarangRepo();
  const useCase = new CreateBarang(repo);

  try {
    // 3. Eksekusi Use Case
    await useCase.execute({ nama, kode, satuan, deskripsi });
    
    // 4. Refresh halaman agar data baru langsung muncul
    revalidatePath("/data-barang");
    
    return { success: true, message: "Berhasil menyimpan barang!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function transaksiStokAction(formData: FormData) {
  // 1. Ambil Data Form
  const barangId = Number(formData.get("barangId"));
  const lokasiId = Number(formData.get("lokasiId"));
  const kategoriId = Number(formData.get("kategoriId"));
  const jumlah = Number(formData.get("jumlah"));
  const tipe = formData.get("tipe") as 'masuk' | 'keluar';
  
  // 2. AMBIL TANGGAL DARI INPUT BARU
  const tanggalString = formData.get("tanggal") as string; 

  const repo = new SupabaseBarangRepo();
  const useCase = new TransactStok(repo);

  try {
    await useCase.execute({ 
      barangId, 
      lokasiId, 
      kategoriId, 
      jumlah, 
      tipe,
      // 3. Konversi string ke Date Object (jika ada)
      tanggal: tanggalString ? new Date(tanggalString) : undefined 
    });
    
    // Refresh semua halaman terkait
    revalidatePath("/data-barang");
    revalidatePath("/");
    revalidatePath("/riwayat");
    
    return { success: true, message: `Berhasil ${tipe} stok!` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}