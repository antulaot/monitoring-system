import { TransaksiRepository } from "@/core/repositories/TransaksiRepository";
import { TransaksiBarang } from "@/core/entities/TransaksiBarang";
import { createClient } from "@/utils/supabase/server"; // Import dari utils Anda yg sudah ada
import { BarangRepository, SelectOption, RiwayatItem, DashboardFilterParams } from "@/core/repositories/BarangRepository";
import { Barang, StokDetail, RiwayatDetail } from "@/core/entities/Barang";

export class SupabaseTransaksiRepo implements TransaksiRepository {
  async getAll(): Promise<TransaksiBarang[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('data_barang') // Nama tabel di DB
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    // Pastikan data dari DB sesuai dengan Entity kita
    return data as TransaksiBarang[];
  }
}

export class SupabaseBarangRepo implements BarangRepository {
  async getAll(): Promise<Barang[]> {
    const supabase = await createClient();

    // Query Nested Join 5 Tabel
    const { data, error } = await supabase
      .from('master_barang')
      .select(`
        *,
        inventaris (
          id,
          jumlah,
          master_kategori ( nama_kategori ),
          master_lokasi (
            nama_lokasi,
            master_pt ( nama_pt )
          )
        )
      `)
      .order('nama_barang', { ascending: true });

    // Jika error, catat di server log tapi kembalikan array kosong agar aplikasi tidak crash
    if (error) {
      console.error("[SupabaseBarangRepo] Error:", error.message);
      return [];
    }

    // Mapping Data
    return data.map((item: any) => {
      const invList = item.inventaris || [];

      // 1. Hitung Total
      const total = invList.reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0);

      // 2. Mapping Detail
      const details: StokDetail[] = invList.map((inv: any) => ({
        id: inv.id,
        namaPt: inv.master_lokasi?.master_pt?.nama_pt || '-',
        namaLokasi: inv.master_lokasi?.nama_lokasi || '-',
        namaKategori: inv.master_kategori?.nama_kategori || '-',
        jumlah: Number(inv.jumlah)
      }));

      return {
        id: item.id,
        kode: item.kode_barang,
        nama: item.nama_barang,
        satuan: item.satuan,
        deskripsi: item.deskripsi,
        listStok: details,
        totalStok: total
      };
    });
  }
  async create(barang: { nama: string; kode: string; satuan: string; deskripsi: string }): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('master_barang')
      .insert({
        nama_barang: barang.nama,
        kode_barang: barang.kode,
        satuan: barang.satuan,
        deskripsi: barang.deskripsi
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  async getLokasiOptions(): Promise<SelectOption[]> {
    const supabase = await createClient();
    const { data } = await supabase.from('master_lokasi').select('id, nama_lokasi');
    return data?.map((d: any) => ({ id: d.id, label: d.nama_lokasi })) || [];
  }

  // 2. Ambil Data Kategori untuk Dropdown
  async getKategoriOptions(): Promise<SelectOption[]> {
    const supabase = await createClient();
    const { data } = await supabase.from('master_kategori').select('id, nama_kategori');
    return data?.map((d: any) => ({ id: d.id, label: d.nama_kategori })) || [];
  }

  // 3. LOGIKA UPDATE STOK (JANTUNGNYA)
async updateStok(input: { 
    barangId: number; 
    lokasiId: number; 
    kategoriId: number; 
    jumlah: number; 
    tipe: 'masuk'|'keluar';
    tanggal?: Date; // <--- Pastikan parameter ini diterima
  }): Promise<void> {
    const supabase = await createClient();

    // LOGIKA TANGGAL: Pakai input user ATAU waktu sekarang
    const waktuTransaksi = input.tanggal ? input.tanggal.toISOString() : new Date().toISOString();

    // 1. CATAT RIWAYAT (LOGGING)
    const { error: errorLog } = await supabase
      .from('riwayat_transaksi')
      .insert({
        barang_id: input.barangId,
        lokasi_id: input.lokasiId,
        kategori_id: input.kategoriId,
        tipe_transaksi: input.tipe,
        jumlah: input.jumlah,
        created_at: waktuTransaksi // <--- KUNCI BACKDATE: Override waktu dibuat
      });

    if (errorLog) throw new Error("Gagal mencatat riwayat: " + errorLog.message);

    // 2. UPDATE STOK SAAT INI (INVENTARIS)
    // (Stok saat ini tetap diupdate seperti biasa, tidak peduli tanggalnya kapan)
    
    // A. Cek stok lama
    const { data: existing } = await supabase
      .from('inventaris')
      .select('id, jumlah')
      .match({ 
        barang_id: input.barangId, 
        lokasi_id: input.lokasiId, 
        kategori_id: input.kategoriId 
      })
      .single();

    if (existing) {
      // Update Data Ada
      let newJumlah = Number(existing.jumlah);
      
      if (input.tipe === 'masuk') {
        newJumlah += input.jumlah;
      } else {
        newJumlah -= input.jumlah;
        if (newJumlah < 0) throw new Error("Stok tidak mencukupi!");
      }

      const { error } = await supabase
        .from('inventaris')
        .update({ jumlah: newJumlah, updated_at: new Date() })
        .eq('id', existing.id);

      if (error) throw new Error(error.message);

    } else {
      // Insert Data Baru
      if (input.tipe === 'keluar') {
        throw new Error("Barang belum ada stoknya, tidak bisa dikurangi!");
      }

      const { error } = await supabase
        .from('inventaris')
        .insert({
          barang_id: input.barangId,
          lokasi_id: input.lokasiId,
          kategori_id: input.kategoriId,
          jumlah: input.jumlah
        });

      if (error) throw new Error(error.message);
    }
  }
// Terima parameter opsional
// ... kode sebelumnya ...

  // Method ini dipakai oleh Dashboard & PDF Export
  async getAllRiwayat(filters?: DashboardFilterParams): Promise<RiwayatDetail[]> {
    const supabase = await createClient();

    let query = supabase
      .from('riwayat_transaksi')
      .select(`
        id, created_at, tipe_transaksi, jumlah, user_id,
        master_barang ( nama_barang, satuan ),
        master_lokasi ( 
          nama_lokasi,
          master_pt ( nama_pt )
        ),
        master_kategori ( nama_kategori )
      `)
      .order('created_at', { ascending: true });

    // Filter Logic
    if (filters?.lokasiId) {
      query = query.eq('lokasi_id', filters.lokasiId);
    }
    if (filters?.kategoriId) {
      query = query.eq('kategori_id', filters.kategoriId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Gagal load riwayat:", error);
      return [];
    }

    // --- REVISI MAPPING DI SINI ---
    // Sebelumnya hanya return id, tanggal, tipe, jumlah.
    // Sekarang kita lengkapi agar PDF bisa membacanya.
    return data.map((d: any) => ({
      id: d.id,
      tanggal: d.created_at,
      tipe: d.tipe_transaksi,
      jumlah: Number(d.jumlah),
      
      // Data Tambahan untuk PDF:
      namaBarang: d.master_barang?.nama_barang || 'Dihapus',
      satuan: d.master_barang?.satuan || '',
      namaLokasi: d.master_lokasi?.nama_lokasi || 'Dihapus',
      namaPt: d.master_lokasi?.master_pt?.nama_pt || '-',
      namaKategori: d.master_kategori?.nama_kategori || '-',
      userEmail: 'Admin' // Atau ambil dari d.user_id jika ada relasi
    }));
  }

  // ... kode sesudahnya ...
async getRiwayatList(): Promise<RiwayatDetail[]> {
    const supabase = await createClient();

    // PERBAIKAN: Hapus semua komentar (--) di dalam string ini
    const { data, error } = await supabase
      .from('riwayat_transaksi')
      .select(`
        id, 
        created_at, 
        tipe_transaksi, 
        jumlah,
        user_id,
        master_barang ( nama_barang, satuan ),
        master_lokasi ( nama_lokasi ),
        
        master_kategori ( nama_kategori )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Gagal load riwayat:", error);
      return [];
    }

    // Mapping... (kode bawahnya tetap sama)
    return data.map((d: any) => ({
      id: d.id,
      tanggal: d.created_at,
      namaBarang: d.master_barang?.nama_barang || 'Barang Dihapus',
      satuan: d.master_barang?.satuan || '',
      namaLokasi: d.master_lokasi?.nama_lokasi || 'Lokasi Dihapus',
      namaPt: d.master_lokasi?.master_pt?.nama_pt || '-',
      namaKategori: d.master_kategori?.nama_kategori || '-',
      tipe: d.tipe_transaksi,
      jumlah: Number(d.jumlah),
      userEmail: 'Admin' 
    }));
  }
}