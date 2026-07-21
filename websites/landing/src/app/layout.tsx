import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlexRide — Your Ride, Your Way",
  description:
    "FlexRide is a modern ride-hailing platform offering affordable, safe, and reliable transportation. Download the app today!",
  openGraph: {
    title: "FlexRide — Your Ride, Your Way",
    description:
      "Affordable, safe, and reliable ride-hailing. Real-time tracking, multiple vehicle options, and 24/7 support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
