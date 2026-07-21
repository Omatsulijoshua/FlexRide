const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Daily Commuter",
    content:
      "FlexRide has completely changed how I get around. The real-time tracking and affordable prices make it my go-to ride-hailing app. The drivers are always professional and friendly.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Adeyemi",
    role: "FlexRide Driver",
    content:
      "Driving with FlexRide has been incredible. The earnings are great, the dispatch system is fair, and I love the flexibility to work on my own schedule. Best decision I ever made.",
    rating: 5,
    avatar: "MA",
  },
  {
    name: "Grace Okonkwo",
    role: "Frequent Traveler",
    content:
      "The inter-state travel feature is a game-changer. I book Lagos to Abuja every month and the experience is seamless. Comfortable vehicles, on-time departures, and fair pricing.",
    rating: 5,
    avatar: "GO",
  },
  {
    name: "David Chen",
    role: "Business Professional",
    content:
      "As someone who travels for work constantly, FlexRide's luxury service is exactly what I need. Professional drivers, clean vehicles, and the in-app safety features give me peace of mind.",
    rating: 4,
    avatar: "DC",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < count ? "text-brand" : "text-zinc-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            What People Say
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Join thousands of happy riders and drivers who trust FlexRide
            every day.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-zinc-200 bg-white p-8"
            >
              <Stars count={t.rating} />
              <p className="mt-4 leading-relaxed text-muted">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-dark">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
