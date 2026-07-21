const safetyFeatures = [
  {
    title: "SOS Emergency Button",
    description:
      "One tap to alert emergency services and your trusted contacts. We monitor every ride in real-time.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: "Trip Sharing",
    description:
      "Share your trip details with friends and family in real-time. They can track your journey live.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
  },
  {
    title: "Audio Recording",
    description:
      "Optional in-trip audio recording for added security. Recordings are encrypted and stored safely.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "Emergency Contacts",
    description:
      "Set up trusted contacts who are notified automatically if you trigger an SOS alert during your trip.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default function Safety() {
  return (
    <section id="safety" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              Your Safety Is Our
              <span className="text-brand"> Priority</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Every ride is built around your safety. From real-time monitoring
              to emergency response tools, we&apos;ve got you covered.
            </p>
            <div className="mt-10 space-y-6">
              {safetyFeatures.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative h-96 w-72 rounded-3xl bg-gradient-to-b from-brand to-brand-dark p-1 shadow-2xl">
              <div className="h-full w-full rounded-[calc(1.5rem-4px)] bg-white p-6">
                <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-red-700">SOS Emergency</p>
                    <p className="text-sm text-red-500">Tap to alert</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-zinc-100 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium text-dark">Trip Sharing Active</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">Shared with 2 contacts</p>
                  </div>
                  <div className="rounded-xl border border-zinc-100 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-brand" />
                      <span className="font-medium text-dark">Audio Recording</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">Encrypted • Not recording</p>
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
