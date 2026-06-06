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
    return null; // Return null to prevent flickering while checking auth
  }

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 backdrop-blur-2xl flex flex-col z-10 relative">
        <div className="p-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
            FlexRide OS
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10 m-4 rounded-xl bg-white/5 flex flex-col gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">JO</div>
            <div>
              <p className="text-sm font-medium text-white">Joshua Omatsuli</p>
              <p className="text-xs text-zinc-500">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_jwt_token');
              router.push('/login');
            }}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col z-10 relative h-full">
        <header className="h-20 bg-transparent border-b border-white/10 flex items-center px-10 backdrop-blur-md">
          <div className="flex-1 flex items-center">
            <div className="relative w-64">
              <input type="text" placeholder="Search the ecosystem..." className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
