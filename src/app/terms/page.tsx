import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsOfEngagementPage() {
  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to gsVista Homepage</span>
          </Link>
        </div>

        {/* Document Header */}
        <div className="border-b border-line pb-8 mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Contract Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Standard Terms of Engagement & Spatial Services Agreement
          </h1>
          <p className="text-xs text-muted">
            Governing All Spatial Audits, Satellite Telemetry Retainers &
            Consulting Scopes
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-ink leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              1. Engagement Framework
            </h2>
            <p>
              These Terms of Engagement govern all technical proposals,
              Statements of Work (SOW), and service deliverables commissioned
              from gsVista. Each engagement is formally initiated upon mutually
              agreed Terms of Reference (TOR) or an executed proposal document
              detailing the Area of Interest (AOI), analytical parameters,
              sensor types, and deliverable schedule.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              2. Coordinate Datums & Spatial Projection Standards
            </h2>
            <p>
              Unless explicitly specified otherwise in writing, all spatial
              deliverables prepared by gsVista are referenced to the World
              Geodetic System 1984 (WGS84 / EPSG:4326) or the appropriate
              Universal Transverse Mercator (UTM) projection (e.g., UTM Zone 31N
              / 32N for Nigerian territorial boundaries). Clients must verify
              target datum compatibility with their internal CAD or GIS systems
              prior to project sign-off.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              3. Sensor Resolution & Technical Disclaimers
            </h2>
            <p>
              gsVista utilizes state-of-the-art satellite radar (SAR) and
              optical sensors. Clients acknowledge that satellite-derived
              observations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted">
              <li>
                Depend on orbital revisit intervals, optical cloud cover
                conditions, and atmospheric transmission windows.
              </li>
              <li>
                Hydrodynamic flood models, vegetation indices (NDVI/EVI), and
                land cover classifications represent remote sensing estimations
                based on calibrated mathematical models and digital terrain
                datums.
              </li>
              <li>
                Satellite assessments are designed to complement, not completely
                replace, statutory geotechnical ground borings, intrusive
                foundation soil tests, or legal boundary land registry surveys.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              4. Deliverables & Intellectual Property Rights
            </h2>
            <p>
              Upon receipt of full payment under the agreed project milestone
              schedule:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted">
              <li>
                The Client receives full, non-exclusive rights to use, modify,
                and integrate final deliverable products (including Shapefiles,
                GeoPackages, GeoTIFFs, and Cartographic PDF Reports) for their
                internal business operations and tender submissions.
              </li>
              <li>
                gsVista retains ownership of its proprietary processing
                algorithms, custom scripts, internal models, and training
                libraries developed during execution.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              5. Invoicing & Payment Terms
            </h2>
            <p>
              Targeted feasibility assessments typically operate on a milestone
              schedule (e.g., 50% mobilization advance upon contract execution
              and 50% upon delivery of final spatial data layers). Recurring
              satellite telemetry retainers are billed on monthly or quarterly
              cycles in advance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms are governed by and construed in accordance with the
              laws of Lagos State and the Federal Republic of Nigeria. Any
              disputes arising in connection with an engagement shall be
              submitted to mediation prior to formal arbitration in Lagos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              7. Contracting Inquiries
            </h2>
            <div className="p-4 rounded-lg bg-paper border border-line text-xs space-y-1 text-ink font-mono">
              <p>gsVista Executive Project Desk</p>
              <p>Email: info@gsvista.com</p>
              <p>Phone: +234 901 456 4547</p>
              <p>Location: Ajayi-apata estate, Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
