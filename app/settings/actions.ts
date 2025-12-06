"use server";

import { SupabaseMasterRepo } from "@/infrastructure/supabase/SupabaseMasterRepo";
import { revalidatePath } from "next/cache";

const repo = new SupabaseMasterRepo();

// --- ACTION PT ---
export async function createPTAction(formData: FormData) {
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;

  try {
    await repo.createPT({ nama, alamat });
    revalidatePath("/settings");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function deletePTAction(id: number) {
  try {
    await repo.deletePT(id);
    revalidatePath("/settings");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// --- ACTION LOKASI ---
export async function createLokasiAction(formData: FormData) {
  const nama = formData.get("nama") as string;
  const ptId = Number(formData.get("ptId"));

  try {
    await repo.createLokasi({ nama, ptId });
    revalidatePath("/settings");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function deleteLokasiAction(id: number) {
  try {
    await repo.deleteLokasi(id);
    revalidatePath("/settings");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}