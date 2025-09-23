// Layout Components
import { NavbarLandingPage } from "@/components/layout/LandingPageNavbar";

// Landing Page Components
import { Hero } from "@/components/features/landing-page/Hero";
import { Feature } from "@/components/features/landing-page/Feature";
import { Stats } from "@/components/features/landing-page/Stats";
import { Cta } from "@/components/features/landing-page/Cta";
import { Testimonial } from "@/components/features/landing-page/Testimonial";
import { Footer7 } from "@/components/features/landing-page/Footer";

/**
 * Halaman utama (Home) yang menampilkan landing page Appiks
 * Berisi komponen-komponen utama: Navbar, Hero, Features, Stats, CTA, Testimonial, dan Footer
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <NavbarLandingPage />
      <Hero />
      <Feature />
      <Stats />
      <Cta />
      <Testimonial />
      <Footer7 />
    </main>
  );
}
