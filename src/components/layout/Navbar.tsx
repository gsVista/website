"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Menu, X, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nav links — hash anchors for homepage sections, full paths for separate pages
  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "Map", href: "/#map" },
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-line shadow-md shadow-black/5 "
          : "bg-paper/80 backdrop-blur-sm border-b border-line/80 "
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* Brand Logo & Slogan */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-strong group-hover:border-brand/40 transition-colors">
              <Globe className="w-5 h-5 text-brand-strong " />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-ink ">
                  gs<span className="text-brand-strong ">Vista</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-surface-2 border border-line text-muted tracking-wider">
                  Geospatial
                </span>
              </div>
              <p className="text-[11px] text-muted tracking-wide font-medium whitespace-nowrap">
                Leveraging Geospatial Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-muted hover:text-brand-strong transition-colors py-1 hover:border-b-2 hover:border-brand/40"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Desktop Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ThemeToggle />

            <Link
              href="/#contact"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-brand hover:bg-brand text-paper transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <span>Get in Touch</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted hover:text-ink rounded-md hover:bg-surface-2 "
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper border-b border-line px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-muted hover:text-brand-strong hover:bg-surface-2 rounded-md font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-line ">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-brand hover:bg-brand text-paper font-semibold text-sm"
            >
              <span>Get in Touch / Request Scope</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
