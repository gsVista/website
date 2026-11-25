import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import InteractiveMapSection from "@/components/sections/InteractiveMapSection";
import ProductsSolutionsSection from "@/components/sections/ProductsSolutionsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col text-ink selection:bg-brand selection:text-ink">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Interactive Map Showcase */}
        <InteractiveMapSection />

        {/* Services & Capabilities */}
        <ProductsSolutionsSection />

        {/* Client & Partner Statements */}
        <ReviewsSection />

        {/* About Company & Credentials */}
        <AboutSection />

        {/* Contact & Scope Submission */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
