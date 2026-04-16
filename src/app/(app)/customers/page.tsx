'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Customer } from '@/types';

type Level = 'Gold' | 'Silver' | 'Bronze' | 'Platinum' | '';

const LEVELS: Level[] = ['', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const BADGE: Record<string, string> = {
  Platinum: 'bg-purple-50 text-purple-700 border-purple-200',
  Gold: 'bg-amber-50 text-amber-700 border-amber-200',
  Silver: 'bg-gray-100 text-gray-600 border-gray-200',
  Bronze: 'bg-orange-50 text-orange-700 border-orange-200',
};

const PAGE_SIZE = 8;

interface FormData { name: string; email: string; phone: string; level: Level; totalSpent: string; }
const EMPTY_FORM: FormData = { name: '', email: '', phone: '', level: 'Bronze', totalSpent: '0' };

function CustomerModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: Customer | null; onSave: (data: FormData) => Promise<void>; }) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { name: initial.name, email: initial.email, phone: initial.phone, level: initial.level, totalSpent: String(initial.totalSpent) } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initial]);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } catch { }
    finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-manrope font-extrabold text-xl text-primary">{initial ? 'Edit Customer' : 'Add New Customer'}</h3>
            <p className="text-xs text-on-surface-variant mt-1">{initial ? 'Update customer details' : 'Register a new player to the system'}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {([
            { key: 'name', label: 'Full Name', type: 'text', icon: 'person', placeholder: 'e.g. Alex Rivera' },
            { key: 'email', label: 'Email Address', type: 'email', icon: 'mail', placeholder: 'e.g. alex@email.com' },
            { key: 'phone', label: 'Phone Number', type: 'tel', icon: 'phone', placeholder: '+91 98765 43210' },
          ] as const).map(field => (
            <div key={field.key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">{field.label}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">{field.icon}</span>
                <input
                  type={field.type} placeholder={field.placeholder} value={(form as any)[field.key]}
                  onChange={e => { setForm(f => ({ ...f, [field.key]: e.target.value })); setErrors(err => ({ ...err, [field.key]: '' })); }}
                  className={`w-full h-12 pl-10 pr-4 rounded-lg bg-surface-container-high border text-sm outline-none transition-all focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest ${errors[field.key] ? 'border-error' : 'border-transparent'}`}
                />
              </div>
              {errors[field.key] && <p className="text-error text-xs mt-1">{errors[field.key]}</p>}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Membership Level</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as Level }))} className="w-full h-12 px-3 rounded-lg bg-surface-container-high border-transparent text-sm outline-none focus:ring-2 focus:ring-secondary/20">
                {(['Bronze', 'Silver', 'Gold', 'Platinum'] as Level[]).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Total Spent (₹)</label>
              <input type="number" min="0" value={form.totalSpent} onChange={e => setForm(f => ({ ...f, totalSpent: e.target.value }))} className="w-full h-12 px-3 rounded-lg bg-surface-container-high border-transparent text-sm outline-none focus:ring-2 focus:ring-secondary/20" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 border border-outline-variant/30 rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 h-12 bg-gradient-to-r from-secondary to-secondary-container text-white rounded-lg font-bold text-sm shadow-lg shadow-secondary/20 hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">{initial ? 'save' : 'person_add'}</span>}
              {saving ? 'Saving...' : initial ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ open, customer, onClose, onConfirm }: { open: boolean; customer: Customer | null; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [deleting, setDeleting] = useState(false);
  if (!open || !customer) return null;
  const confirm = async () => { setDeleting(true); try { await onConfirm(); onClose(); } finally { setDeleting(false); } };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-error text-2xl">person_remove</span>
        </div>
        <h3 className="font-manrope font-bold text-xl text-primary mb-2">Remove Customer?</h3>
        <p className="text-sm text-on-surface-variant mb-6">This will permanently delete <strong>{customer.name}</strong> from the registry. This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-12 border border-outline-variant/30 rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
          <button onClick={confirm} disabled={deleting} className="flex-1 h-12 bg-error text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {deleting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
            {deleting ? 'Removing...' : 'Yes, Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ open, customer, onClose, onToggleStatus }: { open: boolean; customer: Customer | null; onClose: () => void; onToggleStatus: (status: boolean, stationId?: number) => Promise<void> }) {
  const { stations, fetchStations } = useApp();
  const [updating, setUpdating] = useState(false);
  const [showStationSelect, setShowStationSelect] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  
  useEffect(() => {
    if (open) {
      fetchStations();
      setShowStationSelect(false);
      setSelectedStation(null);
    }
  }, [open, fetchStations]);

  if (!open || !customer) return null;

  const confirmTimeIn = async () => {
    if (!selectedStation) return;
    setUpdating(true);
    try {
      await onToggleStatus(true, selectedStation);
      setShowStationSelect(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleOut = async () => {
    setUpdating(true);
    try {
      await onToggleStatus(false);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        
        <div className="flex items-center gap-6 mb-8 mt-2">
           <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden flex-shrink-0 relative border-4 border-surface">
             {customer.avatar ? <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" /> : <span className="font-extrabold text-primary font-manrope text-4xl">{customer.name[0]}</span>}
             {customer.isActive && <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
           </div>
           <div>
             <h2 className="font-manrope font-extrabold text-2xl text-primary">{customer.name}</h2>
             <p className="text-on-surface-variant mt-1 font-medium">{customer.email} • {customer.phone}</p>
             <div className="flex gap-2 mt-3">
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${BADGE[customer.level]}`}>{customer.level}</span>
               <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-surface-container-low border-outline-variant/30 text-on-surface-variant">ID: {customer.id}</span>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-container-lowest border border-surface-container p-4 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Total Spent</p>
            <p className="text-lg font-extrabold font-manrope text-primary">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container p-4 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Sessions</p>
            <p className="text-lg font-extrabold font-manrope text-primary">{customer.sessions}</p>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container p-4 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Avg Session</p>
            <p className="text-lg font-extrabold font-manrope text-primary">{customer.avgSession}h</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container rounded-xl p-6 mb-2">
          {showStationSelect ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="font-manrope font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">desktop_windows</span>
                Assign Hardware Station
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar mb-4 bg-surface-container-low/30 p-2 rounded-lg">
                {stations.filter(s => s.status === 'available').length === 0 ? (
                  <p className="text-xs text-on-surface-variant p-4 col-span-2 text-center italic">No stations currently available.</p>
                ) : stations.filter(s => s.status === 'available').map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setSelectedStation(s.id)}
                    className={`p-3 flex items-center gap-3 text-left border rounded-lg transition-all ${selectedStation === s.id ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm' : 'bg-surface-container-lowest border-surface-container hover:border-outline-variant/30 text-on-surface-variant'}`}
                  >
                    <span className="material-symbols-outlined text-emerald-500 text-xl font-light">computer</span>
                    <div>
                      <p className={`font-bold text-sm ${selectedStation === s.id ? 'text-emerald-800' : 'text-primary'}`}>{s.name}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest">{s.type}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                 <button onClick={() => setShowStationSelect(false)} className="flex-1 h-12 rounded-xl border border-outline-variant/30 font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
                 <button onClick={confirmTimeIn} disabled={!selectedStation || updating} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                   {updating ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">check_circle</span>}
                   {updating ? 'Assigning...' : 'Assign & Start Session'}
                 </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-manrope font-bold text-sm text-primary uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">timer</span>
                  Hardware Timing Control
                </h4>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${customer.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-container text-on-surface-variant'}`}>
                  {customer.isActive ? 'CURRENTLY PLAYING' : 'OFFLINE'}
                </span>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowStationSelect(true)}
                  disabled={customer.isActive || updating}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-20 rounded-xl font-bold transition-all ${customer.isActive ? 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed border-transparent' : 'bg-gradient-to-b from-emerald-50 to-emerald-100/50 text-emerald-700 border border-emerald-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95'}`}
                >
                  <span className="material-symbols-outlined text-2xl">login</span>
                  <span className="text-xs uppercase tracking-widest">Time In</span>
                </button>
                <button 
                  onClick={handleToggleOut}
                  disabled={!customer.isActive || updating}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-20 rounded-xl font-bold transition-all ${!customer.isActive ? 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed border-transparent' : 'bg-gradient-to-b from-error-container to-error-container/50 text-error border border-error/20 hover:shadow-md hover:-translate-y-0.5 active:scale-95'}`}
                >
                  <span className="material-symbols-outlined text-2xl">logout</span>
                  <span className="text-xs uppercase tracking-widest">Time Out</span>
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant/80 text-center mt-5 font-medium flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">history</span>
                Last seen: {new Date(customer.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { customers, stations, isLoadingCustomers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer, updateStation } = useApp();
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<Level>('');
  const [page, setPage] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleToggleStatus = async (status: boolean, stationId?: number) => {
    if (!viewCustomer) return;
    const updated = { ...viewCustomer, isActive: status, lastVisit: new Date().toISOString() };
    if (!status) {
      updated.sessions += 1;
      const boundStation = stations.find(s => s.currentCustomer === viewCustomer.name && s.status === 'occupied');
      if (boundStation) {
        await updateStation(boundStation.id, { status: 'available', currentCustomer: undefined });
      }
    } else if (stationId) {
      await updateStation(stationId, { status: 'occupied', currentCustomer: viewCustomer.name });
    }
    await updateCustomer(updated);
    setViewCustomer(updated);
  };

  const filtered = useMemo(() => customers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    const matchLevel = !filterLevel || c.level === filterLevel;
    return matchSearch && matchLevel;
  }), [customers, search, filterLevel]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSearch = (q: string) => { setSearch(q); setPage(0); };
  const handleFilterLevel = (l: Level) => { setFilterLevel(l); setPage(0); };

  const goldMembers = customers.filter(c => c.level === 'Gold' || c.level === 'Platinum').length;
  const activeToday = customers.filter(c => c.isActive).length;
  const avgSession = customers.length ? (customers.reduce((s, c) => s + c.avgSession, 0) / customers.length).toFixed(1) : '0';
  const newWeekly = 3;

  const formatLastVisit = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleAdd = async (data: FormData) => {
    await addCustomer({ name: data.name, email: data.email, phone: data.phone, level: data.level || 'Bronze', totalSpent: Number(data.totalSpent), avatar: '' });
  };
  const handleEdit = async (data: FormData) => {
    if (!editCustomer) return;
    await updateCustomer({ ...editCustomer, name: data.name, email: data.email, phone: data.phone, level: data.level || editCustomer.level, totalSpent: Number(data.totalSpent) });
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCustomer(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      <CustomerModal open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
      <CustomerModal open={!!editCustomer} onClose={() => setEditCustomer(null)} initial={editCustomer} onSave={handleEdit} />
      <DeleteModal open={!!deleteTarget} customer={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <ProfileModal open={!!viewCustomer} customer={viewCustomer} onClose={() => setViewCustomer(null)} onToggleStatus={handleToggleStatus} />

      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="font-manrope text-2xl font-black text-gray-900 tracking-tight">Player Registry</h3>
          <p className="text-gray-400 text-sm mt-0.5">{customers.length} total registered customers in your database.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#1a5c38] hover:bg-[#22753f] text-white px-5 py-2.5 rounded-xl font-manrope font-bold text-sm shadow-md shadow-[#1a5c38]/20 active:scale-95 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add New Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        {[
          { label: 'Active Today', value: activeToday, icon: 'person_check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Gold Members', value: goldMembers, icon: 'stars', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg. Session', value: `${avgSession}h`, icon: 'schedule', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'New Weekly', value: newWeekly, icon: 'trending_up', color: 'text-[#1a5c38]', bg: 'bg-[#e8f5ee]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <p className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="font-manrope text-4xl font-black text-gray-900">{s.value}</h4>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
              <input type="text" value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search by name, email, phone..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-[#1a5c38]/20 outline-none placeholder:text-gray-400" />
            </div>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
              {LEVELS.map(l => (
                <button key={l} onClick={() => handleFilterLevel(l)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterLevel === l ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {l || 'All'}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 flex-shrink-0">Showing {paginated.length} of {filtered.length} results</p>
        </div>

        {isLoadingCustomers ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#1a5c38]/20 border-t-[#1a5c38] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  {['Name', 'Phone', 'Total Spent', 'Last Visit', 'Level', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 font-manrope font-bold text-xs text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-400">No customers found matching your search.</td></tr>
                ) : paginated.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => setViewCustomer(c)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                          {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : <span className="font-bold text-[#1a5c38] font-manrope">{c.name[0]}</span>}
                          {c.isActive && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_6px_#10b981]" />}
                        </div>
                        <div className="group">
                          <p className="font-bold text-gray-800 group-hover:text-[#1a5c38] group-hover:underline transition-colors">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{c.phone}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-gray-400">{formatLastVisit(c.lastVisit)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${BADGE[c.level]}`}>{c.level}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditCustomer(c)} className="p-2 hover:bg-[#e8f5ee] rounded-lg text-[#1a5c38] transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-xl">delete_outline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">Page {page + 1} of {totalPages}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500 transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i : Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${page === p ? 'bg-[#1a5c38] text-white shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}>{p + 1}</button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500 transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
