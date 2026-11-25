"use client";

import React, { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { PricingTier } from "@/types";
import { apiFetch } from "@/lib/client";

export default function PricingSection() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);

  useEffect(() => {
    apiFetch<{ items: PricingTier[] }>("/api/pricing")
      .then(({ items }) => setTiers(items))
      .catch(() => setTiers([]));
  }, []);

  return (
    <section
      id="pricing"
      className="py-20 bg-surface relative border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all relative shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                tier.popular
                  ? "bg-paper border-2 border-brand/40"
                  : "bg-paper/80 border border-line hover:border-line"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded bg-brand text-paper font-semibold text-[11px] tracking-wide uppercase">
                  Most Requested
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-ink">
                    {tier.name}
                  </h3>
                  <p className="text-muted text-xs leading-relaxed mt-1">
                    {tier.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-line">
                  <div className="text-2xl font-bold text-ink font-mono">
                    {tier.price}
                  </div>
                  <span className="text-xs text-muted">{tier.period}</span>
                </div>

                {/* Features */}
                <div className="space-y-2.5 pt-3 border-t border-line">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block">
                    Scope Details:
                  </span>
                  <ul className="space-y-2 text-xs text-ink">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-strong shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <a
                  href="#contact"
                  className={`w-full py-2.5 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    tier.popular
                      ? "bg-brand hover:bg-brand text-paper shadow-sm"
                      : "bg-surface-2 hover:bg-surface-2 text-ink hover:text-ink border border-line"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
