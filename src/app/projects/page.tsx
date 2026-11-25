import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PastWorkSection from "@/components/sections/PastWorkSection";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, Mail } from "lucide-react";

export const metadata = {
  title:
    "Case Studies & Past Work | gsVista - Leveraging Geospatial Intelligence",
  description:
    "Browse verified geospatial case studies, satellite remote sensing deliverables, flood vulnerability modeling, and agricultural NDVI assessments by gsVista.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col text-ink selection:bg-brand selection:text-ink">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="py-14 bg-surface border-b border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>gsVista Project Portfolio</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-ink tracking-tight">
                Case Studies & Past Spatial Analyses
              </h1>

              <p className="text-ink text-sm sm:text-base leading-relaxed">
                Explore our portfolio of Earth observation deliverables, SAR
                radar flood mapping, multispectral crop vigor analyses, and
                terrain feasibility studies conducted for engineering firms,
                commercial operators, and public institutions.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Projects Section */}
        <PastWorkSection />

        {/* Bottom Scope CTA Banner */}
        <section className="py-16 bg-surface border-b border-line">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Have a Similar Spatial Analysis or Feasibility Need?
            </h2>
            <p className="text-muted text-sm max-w-2xl mx-auto leading-relaxed">
              We evaluate custom Areas of Interest (AOI), prepare technical
              methodologies for corporate tenders, and deliver verified GIS
              shapefiles and reports.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand hover:bg-brand text-paper font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Discuss Your Project Scope</span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-paper border border-line hover:border-line text-ink hover:text-ink font-semibold text-xs sm:text-sm transition-all"
              >
                <span>View Engagement & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
