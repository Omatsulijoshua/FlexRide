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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-bold text-white tracking-tight">Platform Overview</h2>
        {error && <p className="text-sm px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-medium shadow-lg shadow-red-500/5">API Error: {error}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 group">
          <h3 className="text-sm font-medium text-zinc-400 group-hover:text-indigo-300 transition-colors">Total Revenue Today</h3>
          <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mt-4">
            {loading ? "..." : stats.revenue}
          </p>
        </div>
        <div className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 group">
          <h3 className="text-sm font-medium text-zinc-400 group-hover:text-indigo-300 transition-colors">Active Rides</h3>
          <p className="text-5xl font-extrabold text-white mt-4">
            {loading ? "..." : stats.activeRides}
          </p>
        </div>
        <div className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 group">
          <h3 className="text-sm font-medium text-zinc-400 group-hover:text-indigo-300 transition-colors">Pending KYC</h3>
          <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mt-4">
            {loading ? "..." : stats.pendingKyc}
          </p>
        </div>
      </div>

      <div className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl h-96 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-colors duration-500"></div>
        <p className="text-zinc-500 font-medium relative z-10 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Revenue Chart Placeholder
        </p>
      </div>
    </div>
  );
}
