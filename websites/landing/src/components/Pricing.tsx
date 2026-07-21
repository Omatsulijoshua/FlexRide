const tiers = [
  {
    name: "Bike",
    price: "$0.80",
    base: "per km",
    features: [
      "Fast for short trips",
      "Skip traffic",
      "Cashless payment",
      "Real-time tracking",
    ],
    popular: false,
  },
  {
    name: "Economy",
    price: "$1.50",
    base: "per km",
    features: [
      "Affordable everyday rides",
      "Up to 3 passengers",
      "Air conditioning",
      "Cashless payment",
      "Trip sharing",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$4.00",
    base: "per km",
    features: [
      "Luxury vehicles",
      "Professional drivers",
      "Extra legroom",
      "Priority support",
      "Free cancellation",
      "Complimentary water",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Transparent Pricing
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            No hidden fees. What you see is what you pay. Plus, enjoy
            promotional discounts and referral bonuses.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border-2 p-8 ${
                tier.popular
                  ? "border-brand shadow-xl shadow-brand/10"
                  : "border-zinc-200"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold uppercase tracking-wider text-dark">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-lg font-semibold ${tier.popular ? "text-brand" : "text-dark"}`}
              >
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-dark">{tier.price}</span>
                <span className="text-sm text-muted">{tier.base}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-dark">
                    <svg
                      className="h-4 w-4 shrink-0 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#download"
                className={`mt-8 flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
                  tier.popular
                    ? "bg-brand text-dark hover:bg-brand-dark"
                    : "border-2 border-dark text-dark hover:bg-dark hover:text-white"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-brand/10 px-6 py-3 text-sm text-dark">
            <span className="font-semibold">Promo Code:</span>
            <span className="font-mono font-black text-brand">FLEXRIDE20</span>
            <span className="text-muted">— Get 20% off your first ride</span>
          </div>
        </div>
      </div>
    </section>
  );
}
