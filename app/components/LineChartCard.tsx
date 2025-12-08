"use client";

import { useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LabelList
} from "recharts";
import { 
  LineChart as IconLine, 
  BarChart3 as IconBar, 
  Activity as IconArea,
  AlignLeft as IconHorizontal 
} from "lucide-react";

interface Props {
  data: { name: string; masuk: number; keluar: number }[];
  isEditable: boolean;
}

type ChartType = 'line' | 'bar' | 'area' | 'horizontal';

export default function LineChartCard({ data, isEditable }: Props) {
  const [chartType, setChartType] = useState<ChartType>('line');

  const getButtonClass = (type: ChartType) => {
    const base = "flex-1 md:flex-none flex justify-center p-1.5 md:p-2 rounded-lg transition text-slate-500 hover:text-slate-800 hover:bg-slate-100";
    if (chartType === type) {
      return "flex-1 md:flex-none flex justify-center p-1.5 md:p-2 rounded-lg bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-200";
    }
    return base;
  };

  const formatValue = (value: any) => {
    const num = Number(value);
    if (num > 0) return num.toLocaleString('id-ID'); 
    return ""; 
  };

  // --- STYLE KONFIGURASI AGAR JELAS (HIGH CONTRAST) ---
  const axisStyle = {
    fontSize: 11,
    fill: '#334155', // Slate-700 (Gelap & Jelas)
    fontWeight: 600  // Semi-Bold
  };

  const tooltipStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #cbd5e1', // Slate-300
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    fontSize: '12px',
    color: '#0f172a' // Slate-900 (Hitam Pekat)
  };

  const renderChart = () => {
    const commonProps = {
      data: data,
      margin: { top: 20, right: 10, left: -20, bottom: 0 }
    };

    switch (chartType) {
      // 1. HORIZONTAL
      case 'horizontal':
        return (
          <BarChart 
            layout="vertical"
            {...commonProps}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={axisStyle} 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={30} 
              tick={axisStyle} 
            />
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#334155' }} />
            
            <Bar dataKey="masuk" name="Masuk" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30}>
              <LabelList dataKey="masuk" position="insideRight" fill="white" fontSize={11} fontWeight="bold" formatter={formatValue} />
            </Bar>
            <Bar dataKey="keluar" name="Keluar" fill="#f97316" radius={[0, 4, 4, 0]} barSize={30}>
              <LabelList dataKey="keluar" position="insideRight" fill="white" fontSize={11} fontWeight="bold" formatter={formatValue} />
            </Bar>
          </BarChart>
        );

      // 2. BAR TEGAK
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={axisStyle} />
            <YAxis axisLine={false} tickLine={false} tick={axisStyle} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            
            <Bar dataKey="masuk" name="Masuk" fill="#10b981" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="masuk" position="top" fill="#10b981" fontSize={11} fontWeight="bold" formatter={formatValue} />
            </Bar>
            <Bar dataKey="keluar" name="Keluar" fill="#f97316" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="keluar" position="top" fill="#f97316" fontSize={11} fontWeight="bold" formatter={formatValue} />
            </Bar>
          </BarChart>
        );
      
      // 3. AREA
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="gradMasuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradKeluar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={axisStyle} />
            <YAxis axisLine={false} tickLine={false} tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            <Area type="monotone" dataKey="masuk" name="Masuk" stroke="#10b981" fillOpacity={1} fill="url(#gradMasuk)" />
            <Area type="monotone" dataKey="keluar" name="Keluar" stroke="#f97316" fillOpacity={1} fill="url(#gradKeluar)" />
          </AreaChart>
        );

      // 4. LINE
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={axisStyle} />
            <YAxis axisLine={false} tickLine={false} tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            <Line type="monotone" dataKey="masuk" name="Masuk" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="keluar" name="Keluar" stroke="#f97316" strokeWidth={3} activeDot={{ r: 6 }} />
          </LineChart>
        );
    }
  };

  return (
    // PENTING: ID 'dashboard-chart-area' INI WAJIB ADA AGAR PDF EXPORT BISA SCREENSHOT GRAFIK
    <div id="dashboard-chart-area" className="bg-white p-4 md:p-6 rounded-xl shadow-sm border h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Tren Arus Barang</h3>
          <p className="text-xs md:text-sm text-slate-500">Statistik Masuk vs Keluar</p>
        </div>

        <div className="flex w-full md:w-auto bg-slate-50 p-1 rounded-xl border">
          <button onClick={() => setChartType('line')} className={getButtonClass('line')} title="Garis"><IconLine size={18} /></button>
          <button onClick={() => setChartType('bar')} className={getButtonClass('bar')} title="Batang Tegak"><IconBar size={18} /></button>
          <button onClick={() => setChartType('horizontal')} className={getButtonClass('horizontal')} title="Batang Samping"><IconHorizontal size={18} className="rotate-90" /></button>
          <button onClick={() => setChartType('area')} className={getButtonClass('area')} title="Area"><IconArea size={18} /></button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] md:min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}