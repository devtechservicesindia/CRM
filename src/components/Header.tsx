'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Monitor your game parlour in real time.' },
  '/customers': { title: 'Player Registry', subtitle: 'Manage and track all registered players.' },
  '/stations': { title: 'Floor Overview', subtitle: 'Live hardware status and availability.' },
  '/analytics': { title: 'Analytics', subtitle: 'Deep insights into revenue and usage.' },
  '/messages': { title: 'Messages', subtitle: 'Customer communications and support.' },
};

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();
  const [search, setSearch]   = useState('');
  const [user, setUser]       = useState<{ name: string; email: string } | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('gp_crm_auth');
    if (auth) setUser(JSON.parse(auth));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gp_crm_auth');
    router.push('/login');
  };

  const page = PAGE_TITLES[pathname] ?? { title: 'GP CRM', subtitle: '' };

  return (
    <header className="fixed top-0 left-[240px] right-0 z-40 h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">

      {/* Page title */}
      <div>
        <h2 className="font-manrope font-black text-gray-900 text-xl leading-none tracking-tight">{page.title}</h2>
        <p className="text-gray-400 text-xs mt-0.5 font-medium">{page.subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search task…"
            className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38]/40 outline-none transition-all w-56 placeholder:text-gray-400"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">⌘F</kbd>
        </div>

        {/* Mail */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all text-gray-500">
          <span className="material-symbols-outlined text-[20px]">mail_outline</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all text-gray-500 relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1a5c38] ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
              <p className="font-manrope font-bold text-sm text-gray-800 mb-3">Notifications</p>
              {[
                { msg: 'Station PC-3 is now occupied', time: '2m ago', icon: 'desktop_windows' },
                { msg: 'New customer registered', time: '15m ago', icon: 'person_add' },
                { msg: 'Rahul Kumar checked out', time: '1h ago', icon: 'logout' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-xl bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#1a5c38] text-[16px]">{n.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{n.msg}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* User profile */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 pr-3 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#1a5c38] flex items-center justify-center text-white font-bold font-manrope text-sm shadow-sm">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="text-left hidden xl:block">
            <p className="font-manrope font-bold text-sm text-gray-800 leading-none">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{user?.email || 'admin@gpcrm.com'}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
