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
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
      <main className="w-full max-w-[1080px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.10)] min-h-[620px]">

        {/* Left: Branding Panel */}
        <section className="hidden md:flex flex-col justify-between p-12 bg-[#1a5c38] relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full" />

          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>videogame_asset</span>
              </div>
              <h1 className="font-manrope font-black text-white text-2xl tracking-tight">GP CRM</h1>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Game Parlour Platform
              </span>
              <h2 className="font-manrope text-4xl font-black text-white leading-tight tracking-tight mb-5">
                Manage Your<br />Parlour Smarter.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Precision customer tracking, real-time station management, and deep analytics for high-performance gaming environments.
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              { val: '50+', label: 'Stations' },
              { val: '2.4K', label: 'Players' },
              { val: '98%', label: 'Uptime' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm text-center">
                <p className="font-manrope font-black text-white text-2xl">{s.val}</p>
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="max-w-sm w-full mx-auto">

            {/* Mobile brand */}
            <div className="flex md:hidden items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-[#1a5c38] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>videogame_asset</span>
              </div>
              <span className="font-manrope font-black text-[#1a5c38] text-lg">GP CRM</span>
            </div>

            <div className="mb-8">
              <h3 className="font-manrope text-2xl font-black text-gray-900 tracking-tight mb-1">Welcome back 👋</h3>
              <p className="text-gray-400 text-sm">Sign in to your operator dashboard.</p>
            </div>

            {/* Demo credentials hint */}
            <div className="mb-6 p-3.5 bg-[#e8f5ee] border border-[#1a5c38]/20 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-[#1a5c38] text-[18px] mt-0.5">info</span>
              <div>
                <p className="text-[11px] font-bold text-[#1a5c38] uppercase tracking-widest mb-0.5">Demo Credentials</p>
                <p className="text-xs text-[#1a5c38]/80 font-medium">admin@gpcrm.com &nbsp;/&nbsp; admin123</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-[#1a5c38] transition-colors">mail</span>
                  <input
                    id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#1a5c38]/50 focus:ring-2 focus:ring-[#1a5c38]/10 transition-all"
                    placeholder="name@parlour.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" htmlFor="password">Password</label>
                  <button type="button" className="text-[11px] font-bold text-[#1a5c38] hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-[#1a5c38] transition-colors">lock</span>
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#1a5c38]/50 focus:ring-2 focus:ring-[#1a5c38]/10 transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <input
                  id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#1a5c38] cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">Remember me for 30 days</label>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading}
                className="w-full h-12 bg-[#1a5c38] hover:bg-[#22753f] text-white font-manrope font-bold text-sm rounded-xl shadow-lg shadow-[#1a5c38]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                ) : (
                  <>Sign In to Dashboard <span className="material-symbols-outlined text-xl">arrow_forward</span></>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-10 pt-6 border-t border-gray-100">
              Authorized personnel only.{' '}
              <span className="text-[#1a5c38] font-semibold cursor-pointer hover:underline">Contact System Admin</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
