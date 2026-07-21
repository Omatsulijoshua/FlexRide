export default function AppDownload() {
  return (
    <section id="download" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-dark p-8 sm:p-12 lg:p-16">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Get the FlexRide App
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                Download the app today and enjoy your first ride with 20% off.
                Available on iOS and Android.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-dark transition-colors hover:bg-zinc-100"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.67-.79 1.75-1.32 2.74-1.35.1 1.04-.3 2.08-.93 2.83-.63.74-1.68 1.3-2.7 1.24-.11-1 .3-2.03.89-2.72z" />
                  </svg>
                  <div>
                    <p className="text-xs text-zinc-500">Download on the</p>
                    <p className="-mt-0.5 text-base font-bold">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-dark transition-colors hover:bg-zinc-100"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div>
                    <p className="text-xs text-zinc-500">Get it on</p>
                    <p className="-mt-0.5 text-base font-bold">Google Play</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-brand" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Free to download
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-brand" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  No account needed
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-brand" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  20% off first ride
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative h-64 w-48">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-brand to-brand-dark shadow-2xl" />
                <div className="absolute inset-1.5 rounded-[1.85rem] bg-dark" />
                <div className="absolute left-1/2 top-2 h-3 w-20 -translate-x-1/2 rounded-full bg-dark" />
                <div className="absolute inset-x-3 top-6 bottom-3 rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand">
                      <svg className="h-3 w-3 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-dark">FlexRide</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-brand" />
                    <span className="text-[8px] text-muted">Where to?</span>
                  </div>
                  <div className="mt-2 h-16 rounded-lg bg-zinc-100" />
                  <div className="mt-2 flex items-center justify-between rounded-md bg-brand/10 p-1.5">
                    <span className="text-[8px] font-bold text-dark">Economy</span>
                    <span className="text-[8px] text-muted">$4.20</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between rounded-md bg-brand/10 p-1.5">
                    <span className="text-[8px] font-bold text-dark">Premium</span>
                    <span className="text-[8px] text-muted">$8.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
