'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const mainNav = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Customers', path: '/customers', icon: 'group' },
  { name: 'Stations', path: '/stations', icon: 'desktop_windows' },
  { name: 'Analytics', path: '/analytics', icon: 'bar_chart_4_bars' },
  { name: 'Messages', path: '/messages', icon: 'chat_bubble' },
];

const generalNav = [
  { name: 'Settings', path: '/settings', icon: 'settings' },
  { name: 'Help', path: '/help', icon: 'help_outline' },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('gp_crm_auth');
    localStorage.removeItem('gp_crm_remember');
    router.push('/login');
  };

  const NavLink = ({ item }: { item: typeof mainNav[number] }) => {
    const isActive = pathname === item.path;
    return (
      <Link
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
          isActive
            ? 'bg-[#1a5c38] text-white shadow-md shadow-[#1a5c38]/30'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[20px] transition-all`}
          style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {item.icon}
        </span>
        <span className="font-manrope">{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-[240px] bg-white border-r border-gray-100 flex flex-col shadow-[2px_0_24px_rgba(0,0,0,0.04)]">

      {/* Brand */}
      <div className="px-6 pt-7 pb-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1a5c38] flex items-center justify-center shadow-md shadow-[#1a5c38]/30">
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              videogame_asset
            </span>
          </div>
          <span className="font-manrope font-black text-[#1a5c38] text-xl tracking-tight">GP CRM</span>
        </div>
      </div>

      {/* Menu section */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2">Menu</p>
        <nav className="space-y-0.5">
          {mainNav.map(item => <NavLink key={item.name} item={item} />)}
        </nav>
      </div>

      <div className="px-4 mt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2">General</p>
        <nav className="space-y-0.5">
          {generalNav.map(item => <NavLink key={item.name} item={item} />)}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-manrope">Logout</span>
          </button>
        </nav>
      </div>

      {/* Download card at bottom */}
      <div className="mt-auto px-4 pb-6">
        <div className="bg-[#1a5c38] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-5 translate-x-5" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-5 -translate-x-5" />
          <span className="material-symbols-outlined text-white/70 text-3xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
            phone_android
          </span>
          <p className="font-manrope font-black text-white text-base leading-tight mb-1">Get our App</p>
          <p className="text-white/60 text-[11px] mb-4">Manage on the go</p>
          <button className="w-full bg-white text-[#1a5c38] font-bold text-xs py-2 rounded-lg hover:bg-[#e8f5ee] transition-all">
            Download
          </button>
        </div>
      </div>
    </aside>
  );
}
