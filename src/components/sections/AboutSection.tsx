"use client";

import React from "react";
import { Globe, Check, ArrowUpRight } from "lucide-react";

export default function AboutSection() {
  const competencies = [
    "Satellite Remote Sensing (Synthetic Aperture Radar & Optical Multispectral)",
    "Digital Elevation Modeling & Hydrodynamic Runoff Analysis",
    "Vegetation Health & Agricultural Indices (NDVI / EVI)",
    "Land Use / Land Cover (LULC) Multi-Temporal Change Detection",
    "GIS Cartography, Geodatabase Engineering & Coordinate Transformation",
    "Field Survey Coordination & UAV / Drone Orthomosaic Processing",
  ];

  return (
    <section
      id="about"
      className="py-20 bg-surface relative border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Mission & Identity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>About gsVista</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
              A Geospatial Innovation, Science &amp; Analysis Company
            </h2>

            <p className="text-ink text-sm sm:text-base leading-relaxed">
              Headquartered in Lagos, Nigeria, gsVista was established to bridge
              the gap between complex Earth observation datasets and actionable
              commercial decision-making. We transform raw satellite archives,
              radar observations, and digital elevation models into clear,
              structured GIS deliverables.
            </p>

            <p className="text-muted text-xs sm:text-sm leading-relaxed">
              Whether conducting flood vulnerability modeling for coastal civil
              engineering, tracking vegetative stress across commercial
              agro-plantations, or screening candidate land parcels for solar
              farm installation, our emphasis is on scientific rigor,
              transparent methodology, and verifiable accuracy.
            </p>

            {/* Core Competencies List */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink block mb-3">
                Core Competencies:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink">
                {competencies.map((comp, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-strong shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Positioning */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl bg-paper border border-line overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-brand to-brand-strong" />

              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-ink leading-snug">
                    We help companies grow by making better spatial decisions.
                  </h3>
                </div>

                <p className="text-muted text-xs sm:text-sm leading-relaxed">
                  Geospatial intelligence is not just a technical tool. For the
                  right commercial team, it is a direct input to revenue. We
                  work with operators and developers who need to know exactly
                  where to build, what their land is worth, and what risks sit
                  beneath the surface before money moves.
                </p>

                <p className="text-muted text-xs sm:text-sm leading-relaxed">
                  From agricultural companies tracking yield variability across
                  thousands of hectares to infrastructure firms screening site
                  suitability before ground teams are deployed, the clients who
                  work with gsVista consistently reduce project preparation
                  costs and make faster, better-informed investment calls.
                </p>

                <div className="pt-1 border-t border-line">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 py-2 px-4 rounded-md bg-brand hover:bg-brand text-paper text-xs font-semibold transition-all shadow-sm"
                  >
                    <span>Discuss Your Scope</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
