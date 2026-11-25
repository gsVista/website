import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Governance & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Privacy & Spatial Data Governance Policy
          </h1>
          <p className="text-xs text-muted">
            Last Updated: November 2026 • gsVista Legal & Data Governance Desk
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-ink leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              1. Scope & Commitment
            </h2>
            <p>
              gsVista (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              operates as a specialized geospatial innovation, Earth
              observation, and spatial data science provider headquartered in
              Lagos, Nigeria. This Privacy and Spatial Data Policy outlines our
              strict protocols regarding the handling of client contact
              information, project inquiries, and proprietary geospatial
              boundary datasets (Areas of Interest / AOIs).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              2. Protection of Client Boundary Coordinates & Spatial AOIs
            </h2>
            <p>
              We recognize that project boundary shapefiles, cadastral
              coordinates, elevation point clouds, and asset locations provided
              by our enterprise and institutional clients represent commercially
              sensitive intellectual property:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted">
              <li>
                <strong className="text-ink">
                  Non-Disclosure of Target Geometries:
                </strong>{" "}
                Client-provided coordinate boundaries, farm perimeters,
                infrastructure right-of-way vectors, and private survey
                benchmarks are treated as strictly confidential under bilateral
                non-disclosure agreements (NDAs).
              </li>
              <li>
                <strong className="text-ink">Restricted Data Access:</strong>{" "}
                Access to raw client shapefiles and processed spatial layers is
                restricted strictly to assigned GIS analysts and lead remote
                sensing engineers working directly on the project.
              </li>
              <li>
                <strong className="text-ink">
                  Zero Commercial Resale of Client Data:
                </strong>{" "}
                gsVista never resells, distributes, or publicly aggregates
                client survey data or commercial farm telemetry to third-party
                brokers.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              3. Satellite Imagery Sourcing & Licensing
            </h2>
            <p>
              When executing remote sensing workflows, gsVista accesses imagery
              from public planetary observation programs (e.g., European Space
              Agency Copernicus Sentinel-1/2, NASA/USGS Landsat) as well as
              commercial satellite constellations (e.g., PlanetScope, Maxar):
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted">
              <li>
                Public Earth observation data is governed by open-access data
                principles (CC-BY or equivalent).
              </li>
              <li>
                Commercial high-resolution satellite imagery acquired
                specifically for client contracts is licensed in full compliance
                with the primary data provider&apos;s end-user license
                agreements (EULA).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              4. Contact Information & Communications
            </h2>
            <p>
              Information submitted via our contact and project scope intake
              forms (including names, corporate emails, phone numbers, and
              organizational affiliations) is collected solely to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted">
              <li>
                Provide formal technical proposals, scopes of work, and project
                quotes.
              </li>
              <li>
                Coordinate survey logistics and deliverables handover meetings.
              </li>
              <li>Maintain operational billing and contract records.</li>
            </ul>
            <p>
              We do not share your contact details with external advertising
              networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              5. Data Retention & Archival
            </h2>
            <p>
              Upon successful handover and sign-off of deliverables (Shapefiles,
              GeoPackages, GeoTIFFs, and PDF dossiers), raw and intermediate
              processing files are maintained in secure cold storage for a
              standard warranty period of 12 months, after which they may be
              securely purged or archived per the client&apos;s contractual
              instruction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-ink">
              6. Governance Contact
            </h2>
            <p>
              For questions regarding our spatial data handling practices or to
              execute a formal Non-Disclosure Agreement (NDA) prior to
              transmitting project coordinates, contact our desk at:
            </p>
            <div className="p-4 rounded-lg bg-paper border border-line text-xs space-y-1 text-ink font-mono">
              <p>gsVista Data Governance & Legal Desk</p>
              <p>Email: info@gsvista.com</p>
              <p>Phone: +234 901 456 4547</p>
              <p>Address: Ajayi-apata estate, Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
