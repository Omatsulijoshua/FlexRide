"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    revenue: "₦0",
    activeRides: "0",
    pendingKyc: "0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats');
        setStats({
          revenue: `₦${response.data.revenue || 0}`,
          activeRides: response.data.activeRides || 0,
          pendingKyc: response.data.pendingKyc || 0,
        });
      } catch (err: any) {
        console.error("Failed to fetch admin stats", err);
        setError(err.message || "Failed to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">Platform Overview</h2>
        <p className="text-zinc-400 font-medium">Real-time metrics and operational status for FlexRide.</p>
        {error && <p className="text-sm px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-medium shadow-lg shadow-red-500/5 max-w-fit mt-2 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> API Error: {error}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 rounded-[2rem] shadow-2xl border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-teal-500/10 hover:border-teal-500/30 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider group-hover:text-teal-300 transition-colors">Total Revenue</h3>
              <p className="text-5xl font-black text-white mt-4 tracking-tighter">
                {loading ? <span className="animate-pulse text-zinc-700">₦...</span> : stats.revenue}
              </p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-teal-400 relative z-10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>+18.2% from yesterday</span>
          </div>
        </div>

        {/* Active Rides Card */}
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 rounded-[2rem] shadow-2xl border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-violet-500/10 hover:border-violet-500/30 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider group-hover:text-violet-300 transition-colors">Active Rides</h3>
              <p className="text-5xl font-black text-white mt-4 tracking-tighter">
                {loading ? <span className="animate-pulse text-zinc-700">...</span> : stats.activeRides}
              </p>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-400 relative z-10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>+5.4% vs last hour</span>
          </div>
        </div>

        {/* Pending KYC Card */}
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 rounded-[2rem] shadow-2xl border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-orange-500/10 hover:border-orange-500/30 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider group-hover:text-orange-300 transition-colors">Pending KYC</h3>
              <p className="text-5xl font-black text-white mt-4 tracking-tighter">
                {loading ? <span className="animate-pulse text-zinc-700">...</span> : stats.pendingKyc}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-orange-400 relative z-10">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/> Requires attention</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-3xl h-[400px] flex flex-col relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-violet-500/[0.02] group-hover:from-teal-500/[0.05] group-hover:to-violet-500/[0.05] transition-colors duration-700" />
        
        <div className="relative z-10 flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
            <p className="text-zinc-400 text-sm mt-1">Daily income over the last 7 days</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors">7D</button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors">1M</button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors">YTD</button>
          </div>
        </div>

        <div className="flex-1 border-t border-dashed border-white/10 flex items-center justify-center relative">
          <p className="text-zinc-500 font-medium flex items-center gap-3">
            <svg className="w-5 h-5 text-teal-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            Live Chart Integration Pending
          </p>
          {/* Decorative Chart Lines */}
          <svg className="absolute bottom-0 w-full h-48 opacity-20" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path d="M0,200 L0,150 Q250,50 500,100 T1000,50 L1000,200 Z" fill="url(#gradient)" />
            <path d="M0,150 Q250,50 500,100 T1000,50" fill="none" stroke="#2dd4bf" strokeWidth="4" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
