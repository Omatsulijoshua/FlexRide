import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import VehicleTypes from "@/components/VehicleTypes";
import Safety from "@/components/Safety";
import Interstate from "@/components/Interstate";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import DriverCTA from "@/components/DriverCTA";
import AppDownload from "@/components/AppDownload";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <VehicleTypes />
        <Safety />
        <Interstate />
        <Pricing />
        <Testimonials />
        <DriverCTA />
        <AppDownload />
      </main>
      <ContactFooter />
    </>
  );
}
