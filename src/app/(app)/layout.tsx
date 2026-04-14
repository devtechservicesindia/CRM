'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/analytics': 'Analytics',
    '/messages': 'Messages',
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-medium text-sm">Loading GP CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Sidebar />
      <Header title={pageTitles[pathname] || 'Dashboard'} />
      <main className="ml-64 pt-16 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
