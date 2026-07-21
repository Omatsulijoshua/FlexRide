export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand/10 via-white to-brand/5 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight text-dark sm:text-5xl lg:text-6xl">
              Your Ride,{" "}
              <span className="text-brand">Your Way</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">
              Affordable, safe, and reliable rides at your fingertips.
              Real-time tracking, AI-powered dispatch, and rides for every
              budget — from bikes to luxury sedans.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#download"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-dark px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dark/90 sm:w-auto"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                Google Play
              </a>
              <a
                href="#download"
                className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-dark px-8 py-3.5 text-sm font-semibold text-dark transition-colors hover:bg-dark hover:text-white sm:w-auto"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.67-.79 1.75-1.32 2.74-1.35.1 1.04-.3 2.08-.93 2.83-.63.74-1.68 1.3-2.7 1.24-.11-1 .3-2.03.89-2.72z" />
                </svg>
                App Store
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted lg:justify-start">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75z" clipRule="evenodd" />
                </svg>
                50,000+ Rides
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6c0 4.5 5 8 6 8s6-3.5 6-8a6 6 0 00-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                100+ Cities
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-13a1 1 0 112 0v4a1 1 0 01-.293.707l-3 3a1 1 0 01-1.414-1.414L9 9.586V5z" clipRule="evenodd" />
                </svg>
                24/7 Support
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative h-80 w-64 sm:h-96 sm:w-72">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-brand to-brand-dark shadow-2xl" />
              <div className="absolute inset-2 rounded-[2.25rem] bg-dark" />
              <div className="absolute left-1/2 top-3 h-4 w-24 -translate-x-1/2 rounded-full bg-dark" />
              <div className="absolute inset-x-4 top-8 bottom-4 rounded-2xl bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-semibold text-dark">Finding driver...</span>
                </div>
                <div className="mb-3 h-32 rounded-xl bg-zinc-100" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-brand" />
                    <div className="h-2 flex-1 rounded bg-zinc-200" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-300" />
                    <div className="h-2 flex-1 rounded bg-zinc-200" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-brand/10 p-2">
                  <span className="text-[10px] font-bold text-dark">$12.50</span>
                  <span className="text-[10px] text-muted">3 min away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
