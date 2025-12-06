"use client";

interface Props {
  data: { name: string; masuk: number; keluar: number }[];
  saldoAwal: number; // <--- Terima Props Baru
}

export default function DashboardTable({ data, saldoAwal }: Props) {
  
  const formatNumber = (num: number) => num.toLocaleString('id-ID');

  // --- LOGIKA SALDO BERJALAN (Updated) ---
  // Mulai dari Saldo Awal, bukan dari 0
  let currentSaldo = saldoAwal; 
  
  const dataWithSaldo = data.map((item) => {
    currentSaldo = currentSaldo + item.masuk - item.keluar;
    return { ...item, saldo: currentSaldo };
  });

  const totalMasuk = data.reduce((a, b) => a + b.masuk, 0);
  const totalKeluar = data.reduce((a, b) => a + b.keluar, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b bg-slate-50 flex-shrink-0 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Rincian Bulanan</h3>
          <p className="text-xs text-slate-500">Tahun {new Date().getFullYear()}</p>
        </div>
        {/* Tampilkan Saldo Awal di Header Tabel */}
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Saldo Awal</p>
          <p className="font-mono font-bold text-slate-700">{formatNumber(saldoAwal)}</p>
        </div>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-white sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Bulan</th>
              <th className="px-4 py-3 font-semibold text-green-600 text-right">In</th>
              <th className="px-4 py-3 font-semibold text-orange-600 text-right">Out</th>
              <th className="px-4 py-3 font-semibold text-blue-600 text-right">Sisa</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* OPTIONAL: Baris Saldo Awal (Jika ingin ditampilkan di body) */}
            {/* <tr className="bg-slate-50 italic text-slate-500">
              <td className="px-4 py-2" colSpan={3}>Saldo Awal Tahun Lalu</td>
              <td className="px-4 py-2 text-right font-mono">{formatNumber(saldoAwal)}</td>
            </tr> 
            */}

            {dataWithSaldo.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-800">{item.name}</td>
                <td className="px-4 py-2 text-right text-slate-600 font-mono">
                  {item.masuk > 0 ? <span className="text-green-600">+{formatNumber(item.masuk)}</span> : "-"}
                </td>
                <td className="px-4 py-2 text-right text-slate-600 font-mono">
                  {item.keluar > 0 ? <span className="text-orange-600">-{formatNumber(item.keluar)}</span> : "-"}
                </td>
                <td className="px-4 py-2 text-right font-bold text-blue-700 font-mono bg-blue-50/30">
                  {formatNumber(item.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
          
          <tfoot className="bg-slate-100 font-bold border-t text-xs sm:text-sm sticky bottom-0">
            <tr>
              <td className="px-4 py-3 text-slate-700">AKHIR</td>
              <td className="px-4 py-3 text-right text-green-700">{formatNumber(totalMasuk)}</td>
              <td className="px-4 py-3 text-right text-orange-700">{formatNumber(totalKeluar)}</td>
              {/* Saldo Akhir = Saldo Awal + Total Masuk - Total Keluar */}
              <td className="px-4 py-3 text-right text-blue-700">{formatNumber(currentSaldo)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}