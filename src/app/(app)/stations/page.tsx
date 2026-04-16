'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function StationsPage() {
  const { stations, fetchStations, isLoadingStations } = useApp();
  const [filterZone, setFilterZone] = useState<string>('All');
  
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const filteredStations = useMemo(() => {
    if (filterZone === 'All') return stations;
    return stations.filter(s => s.zone === filterZone);
  }, [stations, filterZone]);

  const stats = useMemo(() => {
    const total = stations.length;
    const occupied = stations.filter(s => s.status === 'occupied').length;
    const available = stations.filter(s => s.status === 'available').length;
    const offline = stations.filter(s => s.status === 'maintenance').length;
    return { total, occupied, available, offline };
  }, [stations]);

  const STATUS_COLORS = {
    available: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    occupied: 'bg-gradient-to-br from-primary to-primary/80 text-white border-primary shadow-[0_8px_25px_rgba(33,52,226,0.3)]',
    maintenance: 'bg-error-container text-error border-error/20',
    reserved: 'bg-secondary/10 text-secondary border-secondary/20',
  };

  const TYPE_ICONS = {
    'RTX 4090': 'computer',
    'PS5 Pro': 'videogame_asset',
    'Sim Racing': 'sports_esports',
    'VR': 'view_in_ar',
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="font-manrope text-2xl font-black text-gray-900 tracking-tight">Floor Overview</h3>
          <p className="text-gray-400 text-sm mt-0.5">Live tracking of all hardware assets and their current utilization.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-[#1a5c38] p-6 rounded-2xl shadow-xl shadow-[#1a5c38]/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4" />
          <p className="font-bold text-xs text-white/70 uppercase tracking-widest mb-2">Occupied</p>
          <div className="flex items-end justify-between">
            <h4 className="font-manrope text-4xl font-black text-white">{stats.occupied}</h4>
            <span className="material-symbols-outlined text-white/80 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_play</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <p className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">Available</p>
          <div className="flex items-end justify-between">
            <h4 className="font-manrope text-4xl font-black text-emerald-600">{stats.available}</h4>
            <span className="material-symbols-outlined text-emerald-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <p className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">Maintenance</p>
          <div className="flex items-end justify-between">
            <h4 className="font-manrope text-4xl font-black text-red-500">{stats.offline}</h4>
            <span className="material-symbols-outlined text-red-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <p className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">Total Capacity</p>
          <div className="flex items-end justify-between">
            <h4 className="font-manrope text-4xl font-black text-gray-900">{stats.total}</h4>
            <span className="material-symbols-outlined text-gray-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>dns</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
            {['All', 'A', 'B', 'C'].map(zone => (
              <button 
                key={zone} 
                onClick={() => setFilterZone(zone)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filterZone === zone ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {zone === 'All' ? 'Whole Floor' : `Zone ${zone}`}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Free</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1a5c38]" /> Busy</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> Config</span>
          </div>
        </div>

        {isLoadingStations ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-[#1a5c38]/20 border-t-[#1a5c38] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredStations.map(station => {
              const isOccupied = station.status === 'occupied';
              const isMaintenance = station.status === 'maintenance';
              return (
                <div key={station.id} className={`border rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isOccupied ? 'bg-[#1a5c38] border-transparent text-white shadow-xl shadow-[#1a5c38]/25' :
                  isMaintenance ? 'bg-red-50 border-red-200' :
                  'bg-white border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
                }`}>
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h5 className={`font-extrabold font-manrope text-xl ${isOccupied ? 'text-white' : 'text-gray-900'}`}>{station.name}</h5>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${isOccupied ? 'text-white/60' : 'text-gray-400'}`}>{station.type}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOccupied ? 'bg-white/20' : isMaintenance ? 'bg-red-100' : 'bg-[#e8f5ee]'}`}>
                      <span className={`material-symbols-outlined text-xl ${isOccupied ? 'text-white' : isMaintenance ? 'text-red-500' : 'text-[#1a5c38]'}`}>{TYPE_ICONS[station.type as keyof typeof TYPE_ICONS] || 'desktop_windows'}</span>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-xl ${isOccupied ? 'bg-white/15' : 'bg-gray-50'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isOccupied ? 'text-white/60' : 'text-gray-400'}`}>Status</p>
                    <p className={`font-bold text-sm flex items-center gap-2 ${isOccupied ? 'text-white' : isMaintenance ? 'text-red-600' : 'text-emerald-600'}`}>
                      <span className="material-symbols-outlined text-sm">
                        {station.status === 'available' ? 'check_circle' : station.status === 'occupied' ? 'person' : station.status === 'maintenance' ? 'build' : 'event'}
                      </span>
                      {station.status.toUpperCase()}
                    </p>
                    {isOccupied && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/60 mb-1">Active Player</p>
                        <p className="font-extrabold text-sm text-white truncate flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                          {station.currentCustomer || 'Unknown Customer'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className={`absolute top-3.5 right-12 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isOccupied ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    Z-{station.zone}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
