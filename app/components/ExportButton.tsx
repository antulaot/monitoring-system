"use client";

import { Download } from "lucide-react";
import ExcelJS from "exceljs";

interface Props {
  data: any[]; // Data ini sekarang sudah mengandung 'namaPt'
  fileName?: string;
}

export default function ExportButton({ data, fileName = "Laporan-AgriMonitor" }: Props) {
  
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Transaksi");

    // 1. UPDATE KOLOM HEADER
    sheet.columns = [
      { header: "Tanggal", key: "tanggal", width: 12 },
      { header: "Jam", key: "jam", width: 8 },
      { header: "Nama Barang", key: "barang", width: 25 },
      
      // Sisipkan Kolom PT di sini
      { header: "Perusahaan (PT)", key: "pt", width: 20 }, 
      
      { header: "Lokasi Gudang", key: "lokasi", width: 20 },
      { header: "Kategori", key: "kategori", width: 15 },
      { header: "Tipe", key: "tipe", width: 10 },
      { header: "Jumlah", key: "jumlah", width: 15 },
      { header: "Satuan", key: "satuan", width: 10 },
      { header: "Petugas", key: "petugas", width: 15 },
    ];

    // 2. UPDATE DATA ROWS
    const rows = data.map((item) => ({
      tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      jam: new Date(item.tanggal).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
      barang: item.namaBarang,
      
      // Mapping Data PT
      pt: item.namaPt, 
      
      lokasi: item.namaLokasi,
      kategori: item.namaKategori,
      tipe: item.tipe === "masuk" ? "MASUK" : "KELUAR",
      jumlah: item.jumlah,
      satuan: item.satuan,
      petugas: item.userEmail || "Admin",
    }));

    sheet.addRows(rows);

    // Styling Header Bold
    sheet.getRow(1).font = { bold: true };
    
    // Download Logic
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm active:scale-95"
    >
      <Download size={18} />
      <span className="hidden sm:inline">Export Excel</span>
      <span className="sm:hidden">Excel</span>
    </button>
  );
}