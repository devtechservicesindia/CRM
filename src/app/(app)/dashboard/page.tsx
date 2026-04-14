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
        <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  const revenueChange = Math.round((stats.totalRevenue - stats.totalRevenuePrevMonth) / stats.totalRevenuePrevMonth * 100);
  const chartData = chartFilter === '7' ? stats.revenueData : stats.revenueData;
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <>
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${revenueChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {revenueChange >= 0 ? '+' : ''}{revenueChange}%
            </span>
          </div>
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-1">Total Revenue</p>
          <h3 className="text-3xl font-manrope font-extrabold text-primary">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-[10px] text-slate-400 mt-2">vs last month ({formatCurrency(stats.totalRevenuePrevMonth)})</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">Live</span>
          </div>
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-1">Active Players</p>
          <h3 className="text-3xl font-manrope font-extrabold text-primary">{stats.activePlayers}</h3>
          <p className="text-[10px] text-slate-400 mt-2">of {stats.totalCustomers} total customers</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">desktop_windows</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-bold text-slate-500">Live</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-1">PC Occupancy</p>
          <h3 className="text-3xl font-manrope font-extrabold text-primary">{stats.pcOccupancy}%</h3>
          <div className="w-full h-2 bg-secondary-fixed rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-secondary to-secondary-container rounded-full transition-all duration-700" style={{ width: `${stats.pcOccupancy}%` }} />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary-container">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-1">Monthly Growth</p>
          <h3 className="text-3xl font-manrope font-extrabold text-primary">{stats.monthlyGrowth}%</h3>
          <p className="text-[10px] text-slate-400 mt-2">New membership conversions</p>
        </div>
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-manrope font-bold text-lg text-primary">Revenue Trends</h4>
              <p className="text-sm text-slate-500">Weekly intake analysis</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setChartFilter('7')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartFilter === '7' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>7 Days</button>
              <button onClick={() => setChartFilter('30')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartFilter === '30' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>30 Days</button>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {chartData.map((d, i) => {
              const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
              const isMax = d.revenue === maxRevenue;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group cursor-pointer relative">
                  <div className="hidden group-hover:block absolute -top-10 bg-primary text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg">
                    {formatCurrency(d.revenue)}
                  </div>
                  <div className="w-full bg-surface-container-low rounded-t-lg relative flex flex-col justify-end overflow-hidden h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${isMax ? 'bg-secondary shadow-[0_-4px_15px_rgba(13,80,213,0.3)]' : 'bg-secondary-container group-hover:bg-secondary/70'}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className={`mt-3 text-[10px] font-bold transition-colors ${isMax ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-6">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /><span className="text-xs font-medium text-on-surface-variant">Peak Day</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary-container" /><span className="text-xs font-medium text-on-surface-variant">Regular Days</span></div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h4 className="font-manrope font-bold text-lg text-primary">Live Feed</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            </div>
            <button className="text-secondary text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-5 overflow-y-auto no-scrollbar max-h-80">
            {stats.recentActivity.map(event => (
              <div key={event.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${
                  event.type === 'alert' ? 'bg-error-container' :
                  event.type === 'tournament' ? 'bg-primary-fixed' :
                  'bg-slate-100'
                }`}>
                  {event.customerAvatar ? (
                    <img src={event.customerAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className={`material-symbols-outlined text-sm ${event.type === 'alert' ? 'text-error' : 'text-primary'}`}>
                      {event.type === 'tournament' ? 'confirmation_number' : event.type === 'alert' ? 'warning' : event.type === 'redemption' ? 'redeem' : 'shopping_bag'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">{event.title}</p>
                  <p className="text-xs text-slate-500 truncate">{event.description}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{timeAgo(event.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-primary p-8 rounded-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="font-manrope font-bold text-white text-xl mb-2">Weekend Tournament LIVE</h4>
            <p className="text-blue-200 text-sm mb-6 max-w-sm">Current prize pool has reached ₹50,000. Registration closing in 4 hours.</p>
            <button className="bg-gradient-to-r from-secondary to-secondary-container text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/40 hover:opacity-90 transition-all active:scale-95">
              Manage Event
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[200px] text-white">trophy</span>
          </div>
        </div>

        <div className="bg-surface-container p-8 rounded-xl flex items-center gap-8">
          <div className="flex-1">
            <h4 className="font-manrope font-bold text-primary text-lg mb-1">Station Status</h4>
            <p className="text-slate-500 text-sm mb-4">Real-time hardware inventory</p>
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.stations.available}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Available</p>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <p className="text-2xl font-bold text-secondary">{stats.stations.occupied}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Occupied</p>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <p className="text-2xl font-bold text-on-tertiary-container">{stats.stations.reserved}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Reserved</p>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <p className="text-2xl font-bold text-error">{stats.stations.maintenance}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Maintenance</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="w-24 h-24 rounded-full border-[8px] border-secondary-fixed flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-[8px] border-secondary border-b-transparent border-l-transparent rotate-45" />
              <p className="text-lg font-bold text-primary z-10">{stats.pcOccupancy}%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
