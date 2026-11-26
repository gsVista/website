"use client";

import React from "react";
import InteractiveMap from "@/components/map/InteractiveMap";
import { Compass } from "lucide-react";

export default function InteractiveMapSection() {
  return (
    <section
      id="map"
      className="py-20 bg-surface relative border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>GIS Map Viewer</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight">
            Interactive Spatial Analysis Viewer
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            Interact with our spatial study areas directly in your browser. Use
            the top control to switch between standard OpenStreetMap and
            high-resolution satellite imagery, or toggle custom project
            boundaries on and off using the layer panel.
          </p>
        </div>

        {/* Embedded Interactive Map */}
        <InteractiveMap />

        {/* Custom layers call to action */}
        <div className="mt-4 flex justify-end text-xs">
          <a
            href="#contact"
            className="text-brand-strong hover:text-brand-strong font-medium shrink-0"
          >
            Request custom layers for your project &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
