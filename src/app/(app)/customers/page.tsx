'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Customer } from '@/types';

type Level = 'Gold' | 'Silver' | 'Bronze' | 'Platinum' | '';

const LEVELS: Level[] = ['', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const BADGE: Record<string, string> = {
  Platinum: 'bg-purple-100 text-purple-700 border-purple-200',
  Gold: 'bg-on-tertiary-container/10 text-on-tertiary-container border-on-tertiary-container/20',
  Silver: 'bg-outline/10 text-outline border-outline/20',
  Bronze: 'bg-tertiary/10 text-tertiary border-tertiary/20',
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

export default function CustomersPage() {
  const { customers, isLoadingCustomers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<Level>('');
  const [page, setPage] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

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

      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="font-manrope text-3xl font-extrabold text-primary tracking-tight">Player Registry</h3>
          <p className="text-on-surface-variant mt-1">{customers.length} total registered customers in your database.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-secondary to-secondary-container text-white px-6 py-3 rounded-lg font-manrope font-bold text-sm shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add New Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Today', value: activeToday, icon: 'person_check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Gold Members', value: goldMembers, icon: 'stars', color: 'text-on-tertiary-container', bg: 'bg-tertiary-fixed/50' },
          { label: 'Avg. Session', value: `${avgSession}h`, icon: 'schedule', color: 'text-secondary', bg: 'bg-secondary-fixed/50' },
          { label: 'New Weekly', value: newWeekly, icon: 'trending_up', color: 'text-primary', bg: 'bg-primary-fixed/50' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
            <p className="font-manrope font-bold text-sm text-on-surface-variant/60 uppercase tracking-widest mb-2">{s.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="font-manrope text-4xl font-black text-primary">{s.value}</h4>
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)] overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low/30">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input type="text" value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search by name, email, phone..." className="pl-10 pr-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-sm w-64 focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div className="flex gap-2">
              {LEVELS.map(l => (
                <button key={l} onClick={() => handleFilterLevel(l)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterLevel === l ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'}`}>
                  {l || 'All'}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-on-surface-variant italic flex-shrink-0">Showing {paginated.length} of {filtered.length} results</p>
        </div>

        {isLoadingCustomers ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {['Name', 'Phone', 'Total Spent', 'Last Visit', 'Level', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-5 font-manrope font-bold text-xs text-primary uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant">No customers found matching your search.</td></tr>
                ) : paginated.map((c, idx) => (
                  <tr key={c.id} className={`hover:bg-surface-container-low/60 transition-colors ${idx !== 0 ? 'border-t border-surface-container-low' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden flex-shrink-0">
                          {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : <span className="font-bold text-primary font-manrope">{c.name[0]}</span>}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{c.name}</p>
                          <p className="text-xs text-on-surface-variant">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{c.phone}</td>
                    <td className="px-6 py-4 font-bold text-primary">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatLastVisit(c.lastVisit)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${BADGE[c.level]}`}>{c.level}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditCustomer(c)} className="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors" title="Delete">
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
          <div className="p-6 border-t border-surface-container flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">Page {page + 1} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg hover:bg-surface-container disabled:opacity-30 text-on-surface-variant transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i : Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${page === p ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'hover:bg-surface-container text-on-surface-variant'}`}>{p + 1}</button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg hover:bg-surface-container disabled:opacity-30 text-on-surface-variant transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
