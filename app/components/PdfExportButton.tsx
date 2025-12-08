"use client";

import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toPng } from "html-to-image"; // <--- LIBRARY PENGGANTI
import { getAllDataForPdf } from "../actions/pdfData";

interface Props {
  lokasiId?: number;
  kategoriId?: number;
  chartId: string;
  labelLokasi: string;
}

export default function PdfExportButton({ lokasiId, kategoriId, chartId, labelLokasi }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);

    try {
      // 1. AMBIL ELEMENT GRAFIK
      const chartElement = document.getElementById(chartId);
      if (!chartElement) throw new Error("Grafik tidak ditemukan");

      // 2. FOTO ELEMENT MENGGUNAKAN HTML-TO-IMAGE
      // pixelRatio: 2 atau 3 agar gambar tajam saat di-zoom di PDF
      const chartImage = await toPng(chartElement, { cacheBust: true, pixelRatio: 3 });

      // 3. AMBIL DATA LENGKAP
      const data = await getAllDataForPdf(lokasiId, kategoriId);

      // 4. BUAT PDF
      const doc = new jsPDF();

      // HEADER
      doc.setFontSize(18);
      doc.text("Laporan Stok & Transaksi", 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Filter: ${labelLokasi}`, 14, 28);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 33);

      // INSERT GAMBAR CHART
      // Hitung rasio aspek gambar agar tidak gepeng
      const imgProps = doc.getImageProperties(chartImage);
      const pdfWidth = 180;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      doc.addImage(chartImage, 'PNG', 15, 40, pdfWidth, pdfHeight);

      // TABEL DATA
      const startY = 40 + pdfHeight + 10;

      const tableRows = data.map((item: any) => [
        new Date(item.tanggal).toLocaleDateString("id-ID"),
        item.namaBarang,
        item.namaLokasi,
        item.tipe === 'masuk' ? 'MASUK' : 'KELUAR',
        item.jumlah.toLocaleString('id-ID'),
        item.satuan,
        item.userEmail || 'Admin'
      ]);

      autoTable(doc, {
        head: [['Tanggal', 'Barang', 'Lokasi', 'Tipe', 'Jml', 'Sat', 'Petugas']],
        body: tableRows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
        styles: { fontSize: 8 },
      });

      // DOWNLOAD
      doc.save(`Laporan-${labelLokasi}-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error("Gagal export PDF:", error);
      alert("Gagal membuat PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
      <span className="hidden sm:inline">Export PDF</span>
      <span className="sm:hidden">PDF</span>
    </button>
  );
}