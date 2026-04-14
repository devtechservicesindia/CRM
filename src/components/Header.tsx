'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('gp_crm_auth');
    if (auth) setUser(JSON.parse(auth));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gp_crm_auth');
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-40 h-16 bg-white/90 backdrop-blur-md shadow-[0px_4px_24px_rgba(0,36,81,0.06)] flex items-center justify-between px-8">
      <h2 className="font-manrope font-bold text-lg text-secondary tracking-tight">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-surface-container-high border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all w-64"
          />
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        <div className="h-8 w-px bg-outline-variant/40" />

        <button onClick={handleLogout} className="flex items-center gap-2 hover:bg-surface-container-low p-2 rounded-lg transition-all">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-manrope text-sm">
            {user?.name?.[0] || 'A'}
          </div>
          <span className="text-sm font-bold font-manrope text-primary uppercase tracking-tighter hidden xl:block">
            {user?.name?.split(' ')[0] || 'Admin'}
          </span>
        </button>
      </div>
    </header>
  );
}
