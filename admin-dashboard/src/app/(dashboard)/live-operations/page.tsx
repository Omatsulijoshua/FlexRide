export default function LiveOperationsPage() {
  const operationStats = [
    { label: "active rides", value: "318" },
    { label: "drivers", value: "845" },
    { label: "riders", value: "1,924" },
    { label: "ride monitoring", value: "24 flagged" },
  ];

  const forceActions = [
    { label: "cancel trip", description: "Cancel unsafe or duplicate trips from the command center." },
    { label: "reassign driver", description: "Move a ride to a better-positioned or higher-rated driver." },
    { label: "ban account", description: "Suspend riders or drivers during severe safety reviews." },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-white tracking-tight">Live Operations</h2>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-emerald-400 text-sm font-bold tracking-wide">System Online</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {operationStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="flex-1 bg-black/50 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-xl group">
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black/50 to-black">
          <div className="text-center z-10">
            <p className="text-indigo-300 font-bold text-xl tracking-widest uppercase">Global Tracking Array</p>
            <p className="text-zinc-500 text-sm mt-2 font-mono flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Connecting to WebSocket Layer (Port 3005)...
            </p>
          </div>
          {/* Decorative Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e511_1px,transparent_1px),linear-gradient(to_bottom,#4f46e511_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        
        {/* Mock Map Overlay */}
        <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl w-72 transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Active Drivers: <span className="text-indigo-400">845</span>
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-sm group/item">
              <span className="text-zinc-400 group-hover/item:text-zinc-200 transition-colors">Lagos Sector</span>
              <div className="flex items-center gap-3">
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[80%]"></div>
                </div>
                <span className="font-mono text-white">412</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm group/item">
              <span className="text-zinc-400 group-hover/item:text-zinc-200 transition-colors">Abuja Node</span>
              <div className="flex items-center gap-3">
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[45%]"></div>
                </div>
                <span className="font-mono text-white">201</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm group/item">
              <span className="text-zinc-400 group-hover/item:text-zinc-200 transition-colors">PH Grid</span>
              <div className="flex items-center gap-3">
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[25%]"></div>
                </div>
                <span className="font-mono text-white">132</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 w-96 rounded-2xl border border-white/10 bg-black/70 p-5 shadow-2xl backdrop-blur-xl">
          <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-300">Force Actions</h3>
          <div className="mt-4 space-y-3">
            {forceActions.map((action) => (
              <button
                key={action.label}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
              >
                <span className="block text-sm font-semibold text-white">{action.label}</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">{action.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
