export default function KycPage() {
  const supportQueues = [
    { label: "support ticketing", value: "128 open" },
    { label: "live support chat", value: "18 active" },
    { label: "dispute handling", value: "31 disputes" },
    { label: "call center panel", value: "9 waiting" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-white tracking-tight">KYC Approvals</h2>
        <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          42 Pending
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mock Approval Card */}
        <div className="bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-white/20 group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors">Oluwaseun Adebayo</h3>
              <p className="text-zinc-400 text-sm mt-1">NIN: <span className="font-mono text-zinc-300">23984719283</span> • <span className="text-emerald-400 font-medium">BVN Verified</span></p>
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Applied 2h ago</span>
          </div>
          
          <div className="mt-8 flex space-x-4 flex-1">
            <div className="flex-1 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden group/img cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-10 flex items-end justify-center pb-4">
                <span className="text-white text-xs font-bold uppercase tracking-wider">View Full</span>
              </div>
              <span className="text-zinc-500 font-medium z-0">Driver's License PDF</span>
            </div>
            <div className="flex-1 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 h-40 relative overflow-hidden group/img cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-10 flex items-end justify-center pb-4">
                <span className="text-white text-xs font-bold uppercase tracking-wider">View Full</span>
              </div>
              <span className="text-zinc-500 font-medium z-0">Facial Scan Image</span>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-4">
            <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5">
              Approve Driver
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5">
              Reject
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl p-8">
          <h3 className="font-bold text-xl text-white">Customer Support System</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Manage KYC escalations, identity dispute reviews, live support chat, and call center panel assignments.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {supportQueues.map((queue) => (
              <div key={queue.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">{queue.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{queue.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500">
              Open support tickets
            </button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
              Resolve dispute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
