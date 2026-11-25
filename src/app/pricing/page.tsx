import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/sections/PricingSection";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  ShieldCheck,
  FileCheck,
  Layers,
} from "lucide-react";

export const metadata = {
  title:
    "Pricing & Engagement Models | gsVista - Leveraging Geospatial Intelligence",
  description:
    "Transparent geospatial analysis packages, project-based scoping, and dedicated monthly GIS retainers for commercial companies and institutions.",
};

export default function PricingPage() {
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
                <DollarSign className="w-3.5 h-3.5" />
                <span>Transparent Scoping & Retainers</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-ink tracking-tight">
                Engagement Models & Pricing
              </h1>

              <p className="text-ink text-sm sm:text-base leading-relaxed">
                Whether you require a single rapid flood hazard review, site
                suitability screening for land acquisition, or dedicated monthly
                remote sensing support, we offer structured, predictable
                engagement models.
              </p>
            </div>
          </div>
        </section>

        {/* Full Pricing Section */}
        <PricingSection />

        {/* Engagement Commitments & FAQ */}
        <section className="py-16 bg-surface border-b border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-strong">
                Delivery Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                What Every Engagement Includes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-paper border border-line space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-soft/60 border border-brand/30 flex items-center justify-center text-brand-strong">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink">
                  Full Data Ownership & NDA
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  All processed shapefiles, GeoTIFFs, reports, and coordinates
                  remain 100% your company's proprietary property under strict
                  mutual NDA.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-paper border border-line space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-soft/60 border border-brand/30 flex items-center justify-center text-brand-strong">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink">
                  Audit-Ready Documentation
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  Every map layer is accompanied by complete sensor metadata,
                  projection coordinates (e.g. UTM), and transparent
                  methodological citations.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-paper border border-line space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-soft/60 border border-brand/30 flex items-center justify-center text-brand-strong">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink">
                  Open Standard GIS Deliverables
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  Exported directly to GeoPackage, ESRI Shapefile, GeoJSON, and
                  high-res PDF cartographic layouts compatible with any
                  enterprise GIS system.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center pt-8 border-t border-line">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand hover:bg-brand text-paper font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <span>Request a Custom Scope Quotation</span>
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
