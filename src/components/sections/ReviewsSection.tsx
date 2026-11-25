"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  Quote,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquareQuote,
} from "lucide-react";
import { Review } from "@/types";
import { apiFetch } from "@/lib/client";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch<{ items: Review[] }>("/api/reviews")
      .then(({ items }) => setReviews(items))
      .catch(() => setReviews([]));
  }, []);

  // Auto sliding carousel (every 6 seconds, pauses on hover)
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-surface relative border-b border-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Client Statements</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Client & Collaborator Statements
            </h2>
            <p className="text-muted text-xs sm:text-sm">
              Verified statements from engineering leads, agricultural
              operators, and public sector partners.
            </p>
          </div>

          {/* Carousel Arrows & Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-medium">
              {currentIndex + 1} / {reviews.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-9 h-9 rounded-lg bg-paper border border-line hover:border-line text-ink hover:text-ink flex items-center justify-center transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next review"
                className="w-9 h-9 rounded-lg bg-paper border border-line hover:border-line text-ink hover:text-ink flex items-center justify-center transition-colors active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Sliding Carousel Container */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {reviews.map((rev) => (
                <div key={rev.id} className="w-full shrink-0 px-2 sm:px-4">
                  <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-2xl bg-paper/90 border border-line shadow-lg relative flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-brand-strong/20" />
                    </div>

                    <p className="text-ink text-base sm:text-xl font-normal leading-relaxed italic">
                      &ldquo;{rev.content}&rdquo;
                    </p>

                    <div className="pt-4 border-t border-line/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-ink tracking-wide">
                          {rev.author}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs">
                          <span className="text-muted">{rev.role}</span>
                          <span className="text-muted">•</span>
                          <span className="text-brand-strong font-medium">
                            {rev.organization}
                          </span>
                        </div>
                      </div>

                      {rev.verified && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-soft/40 border border-brand/20 text-[11px] text-brand-strong w-fit">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-strong" />
                          <span>Verified Project Engagement</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? "w-8 h-2 bg-brand"
                    : "w-2 h-2 bg-surface-2 hover:bg-surface-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
