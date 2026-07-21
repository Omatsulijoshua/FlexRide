const interstateFeatures = [
  {
    title: "Shared Travel",
    description: "Book affordable shared seats on popular inter-city routes with fixed departure schedules.",
  },
  {
    title: "Private Charters",
    description: "Rent the entire vehicle for your group — perfect for family trips or corporate travel.",
  },
  {
    title: "Seat Selection",
    description: "Choose your preferred seat when booking. Window, aisle, or front row — it's up to you.",
  },
  {
    title: "Luggage Pricing",
    description: "Transparent luggage pricing based on size and weight. No hidden fees at the terminal.",
  },
];

export default function Interstate() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Inter-State Travel
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Travel between cities with ease. Book shared or private trips with
            comfortable vehicles and reliable schedules.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="grid gap-6 sm:grid-cols-2">
            {interstateFeatures.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-dark">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-dark">Route Map</p>
                <p className="text-sm text-muted">Major cities connected</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { from: "Lagos", to: "Abuja", time: "8 hrs", price: "$25" },
                { from: "Lagos", to: "Port Harcourt", time: "6 hrs", price: "$20" },
                { from: "Abuja", to: "Kano", time: "5 hrs", price: "$18" },
              ].map((route) => (
                <div
                  key={`${route.from}-${route.to}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-dark">{route.from}</span>
                      <div className="my-1 flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                        <div className="h-0.5 w-8 bg-brand/50" />
                        <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                      </div>
                      <span className="text-sm font-semibold text-dark">{route.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand">{route.price}</p>
                    <p className="text-xs text-muted">{route.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
