export default function FinancePage() {
  const metrics = [
    { label: "Gross revenue", value: "NGN 8.4M" },
    { label: "Net revenue", value: "NGN 1.68M" },
    { label: "commission", value: "20%" },
    { label: "driver payout", value: "NGN 6.72M" },
    { label: "withdrawal management", value: "42 pending" },
    { label: "refund management", value: "7 open" },
    { label: "tax management", value: "VAT ready" },
  ];

  const queues = [
    {
      title: "promo management",
      body: "Create promo codes, cap discount exposure, monitor redemptions, and pause risky campaigns.",
      action: "Manage promos",
    },
    {
      title: "driver payouts",
      body: "Approve payout batches, hold suspicious withdrawals, and export bank-transfer files.",
      action: "Review payouts",
    },
    {
      title: "withdrawal management",
      body: "Track pending withdrawal requests, failed bank transfers, and manual finance approvals.",
      action: "Open withdrawals",
    },
    {
      title: "refund management",
      body: "Process rider refunds, reverse duplicated wallet debits, and audit refund reasons.",
      action: "Review refunds",
    },
    {
      title: "tax management",
      body: "Monitor VAT exposure, commission tax records, and monthly finance reconciliation.",
      action: "View tax report",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-white tracking-tight">Finance & Ledger</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{metric.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {queues.map((queue) => (
          <section key={queue.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">{queue.title}</h3>
            <p className="mt-3 min-h-20 text-sm leading-6 text-zinc-500">{queue.body}</p>
            <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              {queue.action}
            </button>
          </section>
        ))}
      </div>
      
      <div className="bg-white/5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 bg-white/5">
          <h3 className="font-semibold text-zinc-300">Recent Transactions</h3>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="px-8 py-4 font-medium tracking-wider text-xs uppercase">Transaction ID</th>
              <th className="px-8 py-4 font-medium tracking-wider text-xs uppercase">Type</th>
              <th className="px-8 py-4 font-medium tracking-wider text-xs uppercase">Amount (NGN)</th>
              <th className="px-8 py-4 font-medium tracking-wider text-xs uppercase">Status</th>
              <th className="px-8 py-4 font-medium tracking-wider text-xs uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Mock Rows */}
            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
              <td className="px-8 py-5 font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">tx_98sf7sd</td>
              <td className="px-8 py-5">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold tracking-wide shadow-[0_0_10px_rgba(52,211,153,0.1)]">COMMISSION</span>
              </td>
              <td className="px-8 py-5 font-semibold text-emerald-400">+₦400.00</td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-zinc-300">Completed</span>
                </div>
              </td>
              <td className="px-8 py-5 text-zinc-500">Today, 14:32</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
              <td className="px-8 py-5 font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">tx_34ds8fs</td>
              <td className="px-8 py-5">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold tracking-wide shadow-[0_0_10px_rgba(99,102,241,0.1)]">DRIVER_PAYOUT</span>
              </td>
              <td className="px-8 py-5 font-semibold text-zinc-200">-₦15,000.00</td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)] animate-pulse"></div>
                  <span className="text-zinc-300">Pending</span>
                </div>
              </td>
              <td className="px-8 py-5 text-zinc-500">Today, 12:15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
