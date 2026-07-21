export default function DriverCTA() {
  return (
    <section id="drivers" className="bg-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Drive with FlexRide
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Earn money on your own schedule. Be your own boss and enjoy
              competitive earnings, bonuses, and incentives.
            </p>

            <div className="mt-10 space-y-6">
              {[
                {
                  stat: "Earn up to",
                  value: "$2,500/mo",
                  desc: "Flexible full-time earnings potential",
                },
                {
                  stat: "Over",
                  value: "10,000+",
                  desc: "Active drivers across the platform",
                },
                {
                  stat: "Get",
                  value: "Same-day",
                  desc: "Payouts to your wallet",
                },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{item.stat}</p>
                    <p className="text-xl font-bold text-white">{item.value}</p>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#download"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-dark transition-colors hover:bg-brand-dark"
            >
              Start Driving Today
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative h-80 w-72">
              <div className="absolute -top-4 -right-4 h-full w-full rounded-3xl border-2 border-zinc-700" />
              <div className="relative flex h-full w-full flex-col justify-between rounded-3xl bg-zinc-900 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75H17.25m-3.75 3h3m-6 0h3M21 9.75v6a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-6m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Online</p>
                    <p className="text-sm text-green-400">Accepting rides</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Today</span>
                    <span className="font-bold text-white">$84.50</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full w-3/4 rounded-full bg-brand" />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>3 trips completed</span>
                    <span>4.9 ★ rating</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-brand/10 p-3">
                  <span className="text-sm text-zinc-400">Next ride request</span>
                  <span className="text-sm font-bold text-brand">~2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
