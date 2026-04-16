'use client';

import { useEffect, useState } from 'react';
import { AnalyticsData } from '@/types';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [chartView, setChartView] = useState<'hourly' | 'daily'>('hourly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setIsLoading(false); });
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1a5c38]/20 border-t-[#1a5c38] rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = chartView === 'hourly' ? data.hourlyRevenue : data.dailyRevenue.slice(-14);
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  const handleExport = () => {
    const rows = [
      ['Cluster', 'Percentage', 'Description'],
      ['Whales', `${data.customerClusters.whales}%`, 'Daily visitors spending >₹10,000/month'],
      ['Grinders', `${data.customerClusters.grinders}%`, 'Weekend regulars, consistent loyalty'],
      ['Casuals', `${data.customerClusters.casuals}%`, 'Ad-hoc visits, event based'],
      [],
      ['Device', 'Occupancy'],
      ['RTX 4090 Stations', `${data.deviceAllocation.rtx4090}%`],
      ['PS5 Pro Booths', `${data.deviceAllocation.ps5Pro}%`],
      ['Sim Racing Rigs', `${data.deviceAllocation.simRacing}%`],
      ['VR Stations', `${data.deviceAllocation.vr}%`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'gp-crm-analytics.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {/* Big Revenue Card */}
        <div className="md:col-span-2 bg-[#1a5c38] rounded-2xl p-7 flex flex-col justify-between shadow-xl shadow-[#1a5c38]/25 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative z-10">
            <p className="text-white/60 text-[11px] uppercase tracking-widest font-bold mb-1">Total Revenue · All Time</p>
            <h3 className="font-manrope text-white text-5xl font-black tracking-tight">₹{(data.totalRevenue / 1000).toFixed(0)}K</h3>
          </div>
          <div className="flex items-center gap-3 mt-6 relative z-10">
            <span className="px-2.5 py-1 bg-white/20 text-white rounded-lg text-xs font-bold backdrop-blur-sm">+12.4%</span>
            <p className="text-white/60 text-xs font-medium">Since last month</p>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-[#e8f5ee] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a5c38] text-[20px]">group</span>
              </div>
              <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">-2%</span>
            </div>
            <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold mb-1">Retention Rate</p>
            <h3 className="font-manrope text-gray-900 text-3xl font-black">{data.retentionRate}%</h3>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-[#1a5c38] rounded-full transition-all duration-700" style={{ width: `${data.retentionRate}%` }} />
          </div>
        </div>

        {/* Avg Session */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-[#e8f5ee] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a5c38] text-[20px]">timer</span>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">+18%</span>
            </div>
            <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold mb-1">Avg. Session</p>
            <h3 className="font-manrope text-gray-900 text-3xl font-black">{data.avgSession}h</h3>
          </div>
          <div className="flex gap-1 mt-4 h-8 items-end">
            {[50, 100, 67, 80, 33, 50].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-sm ${i % 2 === 0 ? 'bg-[#c7e8d4]' : 'bg-[#1a5c38]'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">

          {/* Revenue Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-manrope font-black text-gray-900 text-base">Revenue Pulse</h4>
                <p className="text-gray-400 text-xs mt-0.5">Revenue intake analysed by time period</p>
              </div>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setChartView('hourly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartView === 'hourly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Hourly</button>
                <button onClick={() => setChartView('daily')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartView === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Daily</button>
              </div>
            </div>
            <div className="relative h-52 w-full flex items-end gap-1.5 px-1">
              {chartData.map((d, i) => {
                const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
                const isMax = d.revenue === maxRevenue;
                return (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center group relative cursor-pointer">
                    {isMax && (
                      <div className="absolute -top-9 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span className="text-[#2e9e5b] material-symbols-outlined text-[12px]">paid</span>
                        ₹{(d.revenue / 1000).toFixed(1)}k
                      </div>
                    )}
                    {isMax && <span className="absolute -top-6 text-[10px] font-black text-[#1a5c38]">{Math.round(h)}%</span>}
                    <div className="w-full relative flex flex-col justify-end" style={{ height: '208px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-700 ${isMax ? 'bg-[#1a5c38] shadow-[0_-4px_16px_rgba(26,92,56,0.35)]' : 'bg-[#c7e8d4] group-hover:bg-[#1a5c38]/50'}`}
                        style={{ height: `${Math.max(h, 5)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${isMax ? 'text-[#1a5c38]' : 'text-gray-400 group-hover:text-gray-700'} transition-colors`}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Popular Game Tiers */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <h5 className="font-manrope font-black text-gray-900 mb-5 text-sm">Popular Game Tiers</h5>
              <div className="space-y-3">
                {[
                  { label: 'Cyberpunk 2077', tag: 'AAA', pct: '42%', detail: 'High Demand', bg: 'bg-[#1a5c38]' },
                  { label: 'Hades II', tag: 'IND', pct: '28%', detail: 'Rising', bg: 'bg-[#22753f]' },
                  { label: 'Gran Turismo 7', tag: 'SIM', pct: '18%', detail: 'Stable', bg: 'bg-[#2e9e5b]' },
                ].map(g => (
                  <div key={g.label} className="bg-gray-50 p-4 rounded-xl flex justify-between items-center hover:bg-[#e8f5ee] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${g.bg} flex items-center justify-center text-white font-black text-[11px]`}>{g.tag}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#1a5c38] transition-colors">{g.label}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{g.detail}</p>
                      </div>
                    </div>
                    <span className="text-[#1a5c38] font-black text-sm">{g.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Allocation */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <h5 className="font-manrope font-black text-gray-900 mb-5 text-sm">Device Allocation</h5>
              <div className="space-y-5">
                {[
                  { label: 'RTX 4090 Stations', pct: data.deviceAllocation.rtx4090, color: 'bg-[#1a5c38]' },
                  { label: 'PS5 Pro Booths', pct: data.deviceAllocation.ps5Pro, color: 'bg-[#22753f]' },
                  { label: 'Sim Racing Rigs', pct: data.deviceAllocation.simRacing, color: 'bg-[#2e9e5b]' },
                  { label: 'VR Stations', pct: data.deviceAllocation.vr, color: 'bg-[#5ec893]' },
                ].map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-600">{d.label}</span>
                      <span className="text-xs font-black text-gray-900">{d.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full transition-all duration-700`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-5">

          {/* Customer Clusters */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <h4 className="font-manrope font-black text-gray-900 text-base mb-5">Customer Clusters</h4>
            <div className="space-y-5">
              {[
                { pct: `${data.customerClusters.whales}%`, type: 'Whales', desc: 'Daily visitors, spending >₹10k/mo', ring: 'border-[#1a5c38]', text: 'text-[#1a5c38]', bg: 'bg-[#e8f5ee]' },
                { pct: `${data.customerClusters.grinders}%`, type: 'Grinders', desc: 'Weekend regulars, consistent loyalty', ring: 'border-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
                { pct: `${data.customerClusters.casuals}%`, type: 'Casuals', desc: 'Ad-hoc visits, event based', ring: 'border-blue-400', text: 'text-blue-700', bg: 'bg-blue-50' },
              ].map(c => (
                <div key={c.type} className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-full border-4 ${c.ring} ${c.bg} flex-shrink-0 flex items-center justify-center`}>
                    <span className={`text-xs font-black ${c.text}`}>{c.pct}</span>
                  </div>
                  <div>
                    <p className={`text-sm font-black uppercase tracking-tight ${c.text}`}>{c.type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleExport} className="w-full mt-6 py-2.5 bg-[#1a5c38] hover:bg-[#22753f] text-white rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-[#1a5c38]/20">
              <span className="material-symbols-outlined text-lg">download</span>
              Export Segment Data
            </button>
          </div>

          {/* Real-time Insights */}
          <div className="bg-[#1a5c38] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <h4 className="font-manrope font-bold uppercase text-xs tracking-widest">Real-time Insights</h4>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" /> Alert
                </p>
                <p className="text-xs font-medium text-white/90 leading-relaxed">22% spike in VR usage between 11 PM–1 AM. Consider a late-night promotion.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Efficiency
                </p>
                <p className="text-xs font-medium text-white/90 leading-relaxed">Zone B cooling optimized by 4% using session-based power scheduling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Health */}
      <div className="mt-5 bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center gap-10">
        {/* Circular gauge */}
        <div className="w-40 h-40 flex-shrink-0 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="#f0f2f5" strokeWidth="10" />
            <circle
              cx="80" cy="80" r="68" fill="none"
              stroke="#1a5c38" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 68}`}
              strokeDashoffset={2 * Math.PI * 68 * (1 - data.ecosystemScore / 100)}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-900 font-manrope">{data.ecosystemScore}%</span>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Utility</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-manrope text-2xl font-black text-gray-900 mb-2 tracking-tight">Ecosystem Health Score</h3>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed mb-5">Your parlour is operating at optimal peak efficiency. High conversion in food & beverage clusters offsets the hardware maintenance cycles scheduled for next Tuesday.</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Hardware Status: Optimal', dot: 'bg-emerald-500' },
              { label: 'Network Latency: 4ms', dot: 'bg-[#1a5c38]' },
              { label: 'Staff Efficiency: 98%', dot: 'bg-[#1a5c38]' },
            ].map(b => (
              <div key={b.label} className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${b.dot} shadow-[0_0_6px_rgba(34,197,94,0.5)]`} />
                <span className="text-xs font-bold text-gray-700">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
