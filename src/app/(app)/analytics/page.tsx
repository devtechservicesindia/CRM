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
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" /></div>;
  }

  const chartData = chartView === 'hourly' ? data.hourlyRevenue : data.dailyRevenue.slice(-14);
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const total = data.customerClusters.whales + data.customerClusters.grinders + data.customerClusters.casuals || 100;

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
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 bg-primary rounded-xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[180px] text-white">payments</span>
          </div>
          <div>
            <p className="text-on-primary-container text-xs uppercase tracking-widest font-bold mb-1">Total Revenue • All Time</p>
            <h3 className="font-manrope text-white text-5xl font-extrabold tracking-tighter">₹{(data.totalRevenue / 1000).toFixed(0)}K</h3>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <span className="px-2 py-1 bg-secondary rounded text-xs text-white font-bold">+12.4%</span>
            <p className="text-on-primary-container text-xs">Since last month</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_20px_40px_rgba(0,36,81,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-2 rounded-lg">group</span>
              <span className="text-xs text-error font-bold">-2%</span>
            </div>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold mb-1">Retention Rate</p>
            <h3 className="font-manrope text-primary text-3xl font-extrabold">{data.retentionRate}%</h3>
          </div>
          <div className="w-full h-1.5 bg-surface-container rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${data.retentionRate}%` }} />
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_20px_40px_rgba(0,36,81,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-2 rounded-lg">timer</span>
              <span className="text-xs text-on-tertiary-container font-bold">+18%</span>
            </div>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold mb-1">Avg. Session</p>
            <h3 className="font-manrope text-primary text-3xl font-extrabold">{data.avgSession}h</h3>
          </div>
          <div className="flex gap-1 mt-4 h-8 items-end">
            {[50, 100, 67, 80, 33, 50].map((h, i) => (
              <div key={i} className={`w-2 rounded-t-sm ${i % 2 === 0 ? 'bg-secondary-fixed' : 'bg-secondary'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Revenue Pulse Chart */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h4 className="font-manrope font-bold text-xl text-primary">Revenue Pulse</h4>
                <p className="text-on-surface-variant text-sm">Revenue intake by time period</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setChartView('hourly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartView === 'hourly' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>Hourly</button>
                <button onClick={() => setChartView('daily')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartView === 'daily' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>Daily</button>
              </div>
            </div>
            <div className="relative h-56 w-full flex items-end gap-2 px-2">
              {chartData.map((d, i) => {
                const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
                const isMax = d.revenue === maxRevenue;
                return (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center group relative cursor-pointer">
                    {isMax && <div className="absolute -top-10 bg-primary text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Peak: ₹{(d.revenue / 1000).toFixed(1)}k</div>}
                    <div className="w-full relative" style={{ height: '224px' }}>
                      <div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ${isMax ? 'bg-secondary shadow-[0_-4px_12px_rgba(13,80,213,0.25)]' : 'bg-secondary/20 group-hover:bg-secondary/40'}`} style={{ height: `${h}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold ${isMax ? 'text-primary' : 'text-outline group-hover:text-primary'} transition-colors`}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low rounded-xl p-6">
              <h5 className="font-manrope font-bold text-primary mb-6">Popular Game Tiers</h5>
              <div className="space-y-4">
                {[
                  { label: 'Cyberpunk 2077', tag: 'AAA', pct: '42%', detail: 'High Demand', bg: 'bg-[#002451]' },
                  { label: 'Hades II', tag: 'IND', pct: '28%', detail: 'Rising', bg: 'bg-secondary' },
                  { label: 'Gran Turismo 7', tag: 'SIM', pct: '18%', detail: 'Stable', bg: 'bg-on-tertiary-container' },
                ].map(g => (
                  <div key={g.label} className="bg-surface-container-lowest p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded ${g.bg} flex items-center justify-center text-white font-black text-xs`}>{g.tag}</div>
                      <div>
                        <p className="text-sm font-bold text-primary">{g.label}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold">{g.detail}</p>
                      </div>
                    </div>
                    <span className="text-secondary font-bold">{g.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-6">
              <h5 className="font-manrope font-bold text-primary mb-6">Device Allocation</h5>
              <div className="space-y-5">
                {[
                  { label: 'RTX 4090 Stations', pct: data.deviceAllocation.rtx4090, color: 'bg-secondary' },
                  { label: 'PS5 Pro Booths', pct: data.deviceAllocation.ps5Pro, color: 'bg-secondary/60' },
                  { label: 'Sim Racing Rigs', pct: data.deviceAllocation.simRacing, color: 'bg-tertiary-container' },
                  { label: 'VR Stations', pct: data.deviceAllocation.vr, color: 'bg-primary-fixed-dim' },
                ].map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-on-surface-variant">{d.label}</span>
                      <span className="text-xs font-bold text-primary">{d.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full transition-all duration-700`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
            <h4 className="font-manrope font-bold text-xl text-primary mb-6">Customer Clusters</h4>
            <div className="space-y-6">
              {[
                { pct: `${data.customerClusters.whales}%`, type: 'Whales', desc: 'Daily visitors, spending >₹10k/mo', border: 'border-secondary', r: 88, offset: 552.9 * (1 - data.customerClusters.whales / 100) },
                { pct: `${data.customerClusters.grinders}%`, type: 'Grinders', desc: 'Weekend regulars, consistent loyalty', border: 'border-secondary-fixed', r: 88, offset: 552.9 * (1 - data.customerClusters.grinders / 100) },
                { pct: `${data.customerClusters.casuals}%`, type: 'Casuals', desc: 'Ad-hoc visits, event based', border: 'border-tertiary-fixed', r: 88, offset: 552.9 * (1 - data.customerClusters.casuals / 100) },
              ].map(c => (
                <div key={c.type} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full border-4 ${c.border} flex-shrink-0 flex items-center justify-center`}>
                    <span className="text-xs font-bold text-primary">{c.pct}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-tight">{c.type}</p>
                    <p className="text-xs text-on-surface-variant">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleExport} className="w-full mt-8 py-3 bg-secondary text-white rounded-lg font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">download</span>
              Export Segment Data
            </button>
          </div>

          <div className="bg-primary rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h4 className="font-manrope font-bold uppercase text-xs tracking-widest">Real-time Insights</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-[10px] text-on-primary-container font-bold uppercase tracking-widest mb-1">Alert</p>
                <p className="text-xs font-medium leading-relaxed">22% spike in VR usage between 11 PM–1 AM. Consider late-night promotion.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-[10px] text-on-primary-container font-bold uppercase tracking-widest mb-1">Efficiency</p>
                <p className="text-xs font-medium leading-relaxed">Zone B cooling costs optimized by 4% using session-based power scheduling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Health */}
      <div className="mt-12 bg-surface-container-low rounded-2xl p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-48 h-48 flex-shrink-0 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
            <circle className="text-surface-container-highest" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
            <circle className="text-secondary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.9" strokeDashoffset={552.9 * (1 - data.ecosystemScore / 100)} strokeWidth="12" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-primary">{data.ecosystemScore}%</span>
            <span className="text-[10px] font-black uppercase text-outline">Utility</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-manrope text-4xl font-extrabold text-primary mb-2 tracking-tight">Ecosystem Health Score</h3>
          <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed mb-6">Your parlor is operating at optimal peak efficiency. High conversion in food & beverage clusters offsets the hardware maintenance cycles scheduled for next Tuesday.</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Hardware Status: Optimal', color: 'bg-green-500' },
              { label: 'Network Latency: 4ms', color: 'bg-secondary' },
              { label: 'Staff Efficiency: 98%', color: 'bg-secondary' },
            ].map(b => (
              <div key={b.label} className="bg-surface-container-lowest px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/20">
                <div className={`w-2 h-2 rounded-full ${b.color} shadow-[0_0_8px_rgba(34,197,94,0.6)]`} />
                <span className="text-xs font-bold text-primary">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
