'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types';

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartFilter, setChartFilter] = useState<'7' | '30'>('7');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r => r.json()).then(d => { setStats(d); setIsLoading(false); });
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1a5c38]/20 border-t-[#1a5c38] rounded-full animate-spin" />
      </div>
    );
  }

  const revenueChange = Math.round((stats.totalRevenue - stats.totalRevenuePrevMonth) / stats.totalRevenuePrevMonth * 100);
  const chartData = stats.revenueData;
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      sub: `vs last month (${formatCurrency(stats.totalRevenuePrevMonth)})`,
      badge: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
      badgeColor: revenueChange >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
      icon: 'payments',
      highlight: true,
    },
    {
      label: 'Active Players',
      value: stats.activePlayers,
      sub: `of ${stats.totalCustomers} total customers`,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700',
      icon: 'group',
      highlight: false,
    },
    {
      label: 'PC Occupancy',
      value: `${stats.pcOccupancy}%`,
      sub: 'Current session load',
      badge: 'Live',
      badgeColor: 'bg-blue-50 text-blue-700',
      icon: 'desktop_windows',
      highlight: false,
    },
    {
      label: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      sub: 'New membership conversions',
      badge: 'Increased from last month',
      badgeColor: 'bg-emerald-50 text-emerald-700',
      icon: 'trending_up',
      highlight: false,
    },
  ];

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 relative overflow-hidden ${
              kpi.highlight
                ? 'bg-[#1a5c38] text-white shadow-xl shadow-[#1a5c38]/25'
                : 'bg-white border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
            }`}
          >
            {/* Arrow button */}
            <button className={`absolute top-4 right-4 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${kpi.highlight ? 'border-white/30 text-white hover:bg-white/20' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>

            <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${kpi.highlight ? 'text-white/70' : 'text-gray-400'}`}>
              {kpi.label}
            </p>
            <h3 className={`text-3xl font-manrope font-black mb-4 ${kpi.highlight ? 'text-white' : 'text-gray-900'}`}>
              {kpi.value}
            </h3>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              kpi.highlight ? 'bg-white/20 text-white' : kpi.badgeColor
            }`}>
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              {kpi.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Middle Row: Chart + Upcoming + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Revenue Chart col-span-2 */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-manrope font-black text-gray-900 text-base">Revenue Analytics</h4>
              <p className="text-xs text-gray-400 mt-0.5">Weekly intake analysis</p>
            </div>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setChartFilter('7')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartFilter === '7' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>7 Days</button>
              <button onClick={() => setChartFilter('30')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartFilter === '30' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>30 Days</button>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-between h-44 gap-3 px-2">
            {chartData.map((d, i) => {
              const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
              const isMax = d.revenue === maxRevenue;
              return (
                <div key={i} className="flex flex-col items-center flex-1 relative group cursor-pointer">
                  {/* Tooltip */}
                  <div className="hidden group-hover:flex absolute -top-10 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#2e9e5b]">paid</span>
                    {formatCurrency(d.revenue)}
                  </div>
                  {/* % badge on max */}
                  {isMax && (
                    <span className="absolute -top-7 text-[10px] font-black text-[#1a5c38]">
                      {Math.round(h)}%
                    </span>
                  )}
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${
                        isMax
                          ? 'bg-[#1a5c38] shadow-[0_-4px_16px_rgba(26,92,56,0.35)]'
                          : 'bg-[#c7e8d4] group-hover:bg-[#1a5c38]/50'
                      }`}
                      style={{ height: `${Math.max(h, 6)}%` }}
                    />
                  </div>
                  <span className={`mt-2 text-[10px] font-bold ${isMax ? 'text-[#1a5c38]' : 'text-gray-400 group-hover:text-gray-700'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-gray-50 flex gap-5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1a5c38]" /><span className="text-xs text-gray-500 font-medium">Peak Day</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#c7e8d4]" /><span className="text-xs text-gray-500 font-medium">Regular Days</span></div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <h4 className="font-manrope font-black text-gray-900 text-base">Live Feed</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            </div>
            <button className="text-xs font-bold text-[#1a5c38] hover:underline">View All</button>
          </div>
          <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
            {stats.recentActivity.map(event => (
              <div key={event.id} className="flex gap-3 group">
                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  event.type === 'alert' ? 'bg-red-50' : event.type === 'tournament' ? 'bg-[#e8f5ee]' : 'bg-gray-100'
                }`}>
                  {event.customerAvatar ? (
                    <img src={event.customerAvatar} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className={`material-symbols-outlined text-[16px] ${event.type === 'alert' ? 'text-red-500' : 'text-[#1a5c38]'}`}>
                      {event.type === 'tournament' ? 'emoji_events' : event.type === 'alert' ? 'warning' : event.type === 'redemption' ? 'redeem' : 'shopping_bag'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{event.description}</p>
                  <span className="text-[10px] text-gray-300 mt-1 block">{timeAgo(event.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Tournament Banner */}
        <div className="bg-[#1a5c38] rounded-2xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Now
            </span>
            <h4 className="font-manrope font-black text-white text-xl mb-1.5">Weekend Tournament</h4>
            <p className="text-white/60 text-sm mb-5">Prize pool: ₹50,000 · Registration closes in 4 hrs</p>
            <button className="bg-white text-[#1a5c38] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#e8f5ee] transition-all active:scale-95 flex items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[18px]">emoji_events</span>
              Manage Event
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700 translate-x-4 translate-y-4">
            <span className="material-symbols-outlined text-[180px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
          </div>
        </div>

        {/* Station Status Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex items-center gap-6">
          <div className="flex-1">
            <h4 className="font-manrope font-black text-gray-900 text-base mb-1">Station Status</h4>
            <p className="text-xs text-gray-400 mb-5">Real-time hardware inventory</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Available', val: stats.stations.available, color: 'text-emerald-600', dot: 'bg-emerald-500' },
                { label: 'Occupied', val: stats.stations.occupied, color: 'text-blue-600', dot: 'bg-blue-500' },
                { label: 'Reserved', val: stats.stations.reserved, color: 'text-amber-600', dot: 'bg-amber-500' },
                { label: 'Maintenance', val: stats.stations.maintenance, color: 'text-red-500', dot: 'bg-red-500' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                  <div>
                    <p className={`text-xl font-black font-manrope ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Circular gauge */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#f0f2f5" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#1a5c38" strokeWidth="3"
                  strokeDasharray={`${(stats.pcOccupancy / 100) * 94.25} 94.25`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-black text-gray-900 font-manrope">{stats.pcOccupancy}%</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Load</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
