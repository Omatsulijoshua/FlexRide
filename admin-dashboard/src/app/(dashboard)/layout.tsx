"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_jwt_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const links = [
    { name: 'Overview', href: '/' },
    { name: 'Live Operations', href: '/live-operations' },
    { name: 'Finance & Ledger', href: '/finance' },
    { name: 'KYC Approvals', href: '/kyc' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0B0F19] text-white relative overflow-hidden font-sans">
      {/* Animated Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none animate-pulse duration-[10000ms]" />
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B0F19]/60 border-r border-white/5 backdrop-blur-3xl flex flex-col z-20 relative shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-violet-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 tracking-tight">
              FlexRide OS
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="px-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Main Menu</div>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'text-teal-300 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-violet-500 rounded-r-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                )}
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-50 pointer-events-none" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/5 backdrop-blur-xl flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-full p-0.5 bg-gradient-to-br from-teal-400 to-violet-600">
                <div className="h-full w-full rounded-full bg-[#0B0F19] flex items-center justify-center font-bold text-white text-sm">
                  JO
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Joshua Omatsuli</p>
                <p className="text-xs text-teal-400 font-medium mt-0.5">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('admin_jwt_token');
                router.push('/login');
              }}
              className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col z-10 relative h-full">
        <header className="h-24 bg-transparent flex items-center justify-between px-10 relative z-20">
          <div className="flex-1 flex items-center max-w-xl">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-zinc-500 group-focus-within:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search drivers, riders, transactions..." 
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/[0.04] transition-all duration-300 shadow-inner" 
              />
            </div>
          </div>
          <div className="flex items-center space-x-6 ml-6">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors group">
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 border-2 border-[#0B0F19] z-10" />
              <svg className="w-6 h-6 group-hover:animate-swing" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-10 pt-4">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
