"use client";

import React, { useEffect, useState } from "react";
import {
  Satellite,
  Waves,
  Sprout,
  Building,
  Sun,
  Database,
  ChevronRight,
  Layers,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Service } from "@/types";
import { apiFetch } from "@/lib/client";

const iconMap: Record<Service["icon"], LucideIcon> = {
  Waves,
  Sprout,
  Building,
  Sun,
  Satellite,
  Database,
  Layers,
  Globe,
};

export default function ProductsSolutionsSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ items: Service[] }>("/api/services")
      .then(({ items }) => setServices(items))
      .catch(() => setServices([]));
  }, []);

  return (
    <section id="services" className="py-20 bg-surface border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft border border-brand/30 text-brand-strong text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Services &amp; Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight">
            Comprehensive Geospatial Science &amp; Analysis Services
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            From flood vulnerability modeling in coastal megacities to satellite
            NDVI crop intelligence and land use classification, we deliver
            sound, verifiable geospatial science to support your bids, studies,
            and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = iconMap[svc.icon] || Layers;
            const isExpanded = selectedService === svc.id;
            return (
              <div
                key={svc.id}
                className="p-6 rounded-xl bg-paper border border-line hover:border-brand/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong group-hover:border-brand transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-brand-strong px-2 py-0.5 rounded bg-brand-soft border border-brand/20">
                      {svc.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-ink group-hover:text-brand-strong transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-ink block mb-1.5">
                      Tools &amp; Data Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {svc.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-surface-2 text-muted text-[11px] border border-line"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-line space-y-3 text-xs">
                      <div>
                        <span className="font-semibold text-ink block mb-1">
                          Methodology Overview:
                        </span>
                        <p className="text-muted leading-relaxed text-[11px]">
                          {svc.methodology}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-ink block mb-1">
                          Standard Deliverables:
                        </span>
                        <ul className="space-y-1 text-muted text-[11px]">
                          {svc.deliverables.map((deliverable, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-brand font-bold">•</span>
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-3 border-t border-line">
                  <button
                    onClick={() =>
                      setSelectedService(isExpanded ? null : svc.id)
                    }
                    className="w-full py-2 px-3 rounded-md bg-surface-2 hover:bg-brand-soft text-ink hover:text-brand-strong text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>
                      {isExpanded
                        ? "Collapse Details"
                        : "View Methodology & Deliverables"}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
