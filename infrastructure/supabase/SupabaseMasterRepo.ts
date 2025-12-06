import { MasterRepository } from "@/core/repositories/MasterRepository";
import { PT, Lokasi } from "@/core/entities/MasterData";
import { createClient } from "@/utils/supabase/server";

export class SupabaseMasterRepo implements MasterRepository {
  
  // --- BAGIAN PT ---
  async getPTs(): Promise<PT[]> {
    const supabase = await createClient();
    const { data } = await supabase.from('master_pt').select('*').order('id', { ascending: true });
    
    return data?.map((d: any) => ({
      id: d.id,
      nama: d.nama_pt,
      alamat: d.alamat
    })) || [];
  }

  async createPT(data: { nama: string; alamat: string }): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('master_pt').insert({
      nama_pt: data.nama,
      alamat: data.alamat
    });
    if (error) throw new Error(error.message);
  }

  async deletePT(id: number): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('master_pt').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  // --- BAGIAN LOKASI ---
  async getLokasi(): Promise<Lokasi[]> {
    const supabase = await createClient();
    // Join ke master_pt untuk ambil nama PT
    const { data } = await supabase
      .from('master_lokasi')
      .select('*, master_pt(nama_pt)')
      .order('id', { ascending: true });

    return data?.map((d: any) => ({
      id: d.id,
      nama: d.nama_lokasi,
      ptId: d.pt_id,
      namaPt: d.master_pt?.nama_pt || '-'
    })) || [];
  }

  async createLokasi(data: { nama: string; ptId: number }): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('master_lokasi').insert({
      nama_lokasi: data.nama,
      pt_id: data.ptId
    });
    if (error) throw new Error(error.message);
  }

  async deleteLokasi(id: number): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('master_lokasi').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}