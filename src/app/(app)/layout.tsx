'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('gp_crm_auth');
    if (!auth) {
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#1a5c38]/20 border-t-[#1a5c38] rounded-full animate-spin" />
          <p className="text-gray-400 font-medium text-sm">Loading GP CRM…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-900">
      <Sidebar />
      <Header />
      <main className="ml-[240px] pt-[72px] min-h-screen">
        <div className="p-8 page-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
