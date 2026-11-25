"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Layers,
  Satellite,
  Waves,
  Sprout,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-paper border-b border-line transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Genuine, Authoritative Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.15]">
            Geospatial Science, Satellite Remote Sensing & Spatial Analysis
          </h1>

          {/* Grounded Description */}
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl font-normal">
            gsVista is a specialized geospatial innovation and analysis company.
            We help engineering firms, commercial agricultural operators, and
            public institutions evaluate spatial data, satellite radar and
            optical imagery, flood vulnerability, and environmental terrain
            conditions.
          </p>

          {/* Direct CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="#contact"
              className="px-6 py-3 rounded-md bg-brand hover:bg-brand text-paper font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Discuss a Project Scope</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#map"
              className="px-5 py-3 rounded-md bg-surface-2 hover:bg-surface-2 border border-line text-muted font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-strong " />
              <span>Open Interactive Map</span>
            </a>

            <Link
              href="/projects"
              className="px-5 py-3 rounded-md text-muted hover:text-ink font-medium text-sm transition-colors flex items-center justify-center"
            >
              <span>View Case Studies</span>
            </Link>
          </div>
        </div>

        {/* 4 Pillars of Competence */}
        <div className="mt-14 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-surface-2 border border-line hover:border-brand/30 transition-colors">
            <div className="w-8 h-8 rounded bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong mb-3">
              <Satellite className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink ">
              Satellite Remote Sensing
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Acquisition and analysis of Sentinel-1 radar (SAR) and
              multispectral Sentinel-2 & Landsat optical imagery.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-2 border border-line hover:border-brand/30 transition-colors">
            <div className="w-8 h-8 rounded bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong mb-3">
              <Waves className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink ">
              Coastal & Flood Studies
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Terrain elevation assessment, catchment drainage modeling, and
              coastal vulnerability delineation in Lagos.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-2 border border-line hover:border-brand/30 transition-colors">
            <div className="w-8 h-8 rounded bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong mb-3">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink ">
              Agricultural NDVI Telemetry
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Multispectral vegetation index computation to detect canopy vigor
              variations and support soil sampling.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-2 border border-line hover:border-brand/30 transition-colors">
            <div className="w-8 h-8 rounded bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink ">
              GIS Data Handover
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Industry-standard deliverables in Shapefile, GeoPackage, and
              GeoJSON formats ready for CAD or GIS software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
