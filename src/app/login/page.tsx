'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('gp_crm_auth')) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid credentials'); return; }
      localStorage.setItem('gp_crm_auth', JSON.stringify(data.user));
      if (remember) localStorage.setItem('gp_crm_remember', 'true');
      router.push('/dashboard');
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <main className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_40px_80px_rgba(0,36,81,0.12)] min-h-[640px]">
        {/* Left: Branding */}
        <section className="hidden md:flex flex-col justify-between p-12 bg-primary overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
              </div>
              <h1 className="font-manrope font-black text-white text-2xl tracking-tighter uppercase">GP CRM</h1>
            </div>
            <div className="mt-20">
              <h2 className="font-manrope text-4xl font-extrabold text-white leading-tight tracking-tight">
                The Architectural<br />Core of Gaming.
              </h2>
              <p className="mt-6 text-on-primary-container font-medium max-w-sm leading-relaxed">
                Precision analytics and customer management for high-performance gaming environments.
              </p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdKbppN3tBKUwVbXzCPKw-KVURsG-gCr3orR25W0J4CiKm_7MJrxAtBRtXCFvF7iRqZ4WlpyEXO335VUdAoTGXukwhehdKGwXExg9K7z23J0vPRY11l3fbBfJfL0MWrYvXTq55XoLeWI-Q_hDYdnS2f84zLb6aGONCnqv3VmbsREw1WBq1dxU-WeiPaRpZ1mCBzAZINsQomU899iQFsk4jB8-GIMQLXJjWNVMQCNBRV8pRXs4RrDMmy_gPaWIL8p0IMsST42ixXFuG" alt="" />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-on-primary-container font-semibold tracking-wider">TRUSTED BY 2,400+ OPERATORS</p>
          </div>
        </section>

        {/* Right: Form */}
        <section className="flex flex-col justify-center p-8 md:p-16 lg:p-20">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <p className="font-label text-secondary font-bold text-xs uppercase tracking-widest mb-2">Secure Access</p>
              <h3 className="font-manrope text-3xl font-bold text-on-surface tracking-tight">Operator Login</h3>
              <p className="text-on-surface-variant text-sm mt-2">Enter your credentials to manage your parlour.</p>
              <div className="mt-3 p-3 bg-secondary-fixed rounded-lg">
                <p className="text-xs text-on-secondary-fixed font-semibold">
                  Demo: <span className="font-bold">admin@gpcrm.com</span> / <span className="font-bold">admin123</span>
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-error-container rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-sm">error</span>
                  <p className="text-error text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="font-label font-bold text-[10px] uppercase tracking-[0.1em] text-on-surface-variant block ml-1" htmlFor="email">Work Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-secondary transition-colors">mail</span>
                  <input
                    id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-surface-container-high border-none rounded-lg text-sm text-on-surface placeholder:text-outline/60 transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 outline-none"
                    placeholder="name@parlour.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label font-bold text-[10px] uppercase tracking-[0.1em] text-on-surface-variant" htmlFor="password">Password</label>
                  <button type="button" className="font-label font-semibold text-[10px] uppercase tracking-[0.1em] text-secondary hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-secondary transition-colors">lock</span>
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 bg-surface-container-high border-none rounded-lg text-sm text-on-surface placeholder:text-outline/60 transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <input
                  id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer">Remember this device for 30 days</label>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-secondary to-secondary-container text-white font-manrope font-bold text-base rounded-lg shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isLoading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <>Sign In to Dashboard<span className="material-symbols-outlined text-xl">arrow_forward</span></>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-on-surface-variant mt-12 pt-8 border-t border-outline-variant/10">
              Authorized personnel only. Need help?{' '}
              <span className="text-secondary font-semibold cursor-pointer hover:underline">Contact System Admin</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
