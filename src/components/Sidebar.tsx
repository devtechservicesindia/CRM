'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Customers', path: '/customers', icon: 'group' },
  { name: 'Analytics', path: '/analytics', icon: 'analytics' },
  { name: 'Messages', path: '/messages', icon: 'mail' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('gp_crm_auth');
    localStorage.removeItem('gp_crm_remember');
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#002451] shadow-2xl shadow-[#002451]/20 flex flex-col">
      {/* Brand */}
      <div className="px-8 py-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>videogame_asset</span>
          </div>
          <div>
            <h1 className="font-manrope font-black text-white text-xl tracking-tighter leading-none">GP CRM</h1>
            <p className="text-[9px] text-on-primary-container font-bold uppercase tracking-[0.2em] mt-0.5">The Neon Architect</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name} href={item.path}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-manrope text-sm font-semibold tracking-wide transition-all active:scale-95 ${
                isActive
                  ? 'bg-secondary/20 text-white border-l-4 border-secondary pl-3'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 flex-shrink-0 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-slate-400 hover:text-white py-3 px-4 rounded-lg font-manrope text-sm font-semibold tracking-wide transition-all hover:bg-white/5 active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
