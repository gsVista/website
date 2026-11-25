import React from "react";
import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Brief & Direct Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand/15 border border-brand/30 flex items-center justify-center text-brand-strong">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-ink">
                gs<span className="text-brand-strong">Vista</span>
              </span>
            </Link>

            <p className="text-xs text-brand-strong font-medium">
              Leveraging Geospatial Intelligence
            </p>

            <p className="text-xs text-muted leading-relaxed">
              gsVista provides satellite remote sensing, GIS mapping, coastal
              flood vulnerability analysis, and environmental spatial
              assessments for enterprises, engineering firms, and institutional
              researchers.
            </p>

            <div className="space-y-2 text-xs text-ink pt-1">
              <a
                href="mailto:info@gsvista.com"
                className="flex items-center gap-2 hover:text-brand-strong transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-brand-strong shrink-0" />
                <span>info@gsvista.com</span>
              </a>

              <a
                href="tel:+2349014564547"
                className="flex items-center gap-2 hover:text-brand-strong transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-strong shrink-0" />
                <span>+234 901 456 4547</span>
              </a>

              <div className="flex items-start gap-2 text-muted">
                <MapPin className="w-3.5 h-3.5 text-brand-strong shrink-0 mt-0.5" />
                <span>Ajayi-apata estate, Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Section: Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <a
                  href="/#services"
                  className="hover:text-ink transition-colors"
                >
                  Remote Sensing &amp; Satellite Imagery
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-ink transition-colors"
                >
                  Coastal &amp; Flood Inundation Studies
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-ink transition-colors"
                >
                  Precision Agriculture &amp; NDVI Mapping
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-ink transition-colors"
                >
                  Land Use &amp; Urban Growth (LULC)
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-ink transition-colors"
                >
                  Site Selection &amp; Feasibility Analysis
                </a>
              </li>
            </ul>
          </div>

          {/* Section: Platform & Work */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Platform &amp; Work
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <a href="/#map" className="hover:text-ink transition-colors">
                  Interactive GIS Map Viewer
                </a>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-ink transition-colors"
                >
                  Project Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-ink transition-colors"
                >
                  Engagement Tiers &amp; Retainers
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-ink transition-colors">
                  About gsVista
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="hover:text-ink transition-colors"
                >
                  Request a Project Scope
                </a>
              </li>
            </ul>
          </div>

          {/* Section: Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Governance
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-brand-strong transition-colors"
                >
                  Privacy &amp; Spatial Data Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-brand-strong transition-colors"
                >
                  Terms of Engagement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-line/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>
            &copy; {new Date().getFullYear()} gsVista. All rights reserved.
            Registered Geospatial Science & Analysis Provider, Lagos, Nigeria.
          </p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy & Spatial Data Policy
            </Link>
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms of Engagement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
