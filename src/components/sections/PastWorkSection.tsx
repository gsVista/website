"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, MapPin, X, Check, ChevronRight } from "lucide-react";
import { Project } from "@/types";
import { apiFetch } from "@/lib/client";

export default function PastWorkSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    apiFetch<{ items: Project[] }>("/api/projects")
      .then(({ items }) => setProjects(items))
      .catch(() => setProjects([]));
  }, []);

  const categories = [
    "All",
    "Climate & Flood",
    "Precision Agriculture",
    "Urban Planning",
    "Renewable Energy",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="work"
      className="py-20 bg-surface relative border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Trail of Evidence & Projects</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight">
              Case Studies & Past Spatial Analyses
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              Explore concrete examples of satellite imagery processing, terrain
              modeling, and spatial analyses completed by gsVista.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 p-1 bg-paper rounded-lg border border-line">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-brand text-paper"
                    : "text-muted hover:text-ink hover:bg-surface-2"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl bg-paper border border-line overflow-hidden hover:border-line transition-all flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                {/* Cover Image banner */}
                <div className="relative h-56 w-full overflow-hidden bg-surface-2">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded bg-paper/90 backdrop-blur-sm border border-line text-brand-strong text-xs font-medium">
                      {project.category}
                    </span>
                    {project.location && (
                      <span className="px-2.5 py-1 rounded bg-paper/90 backdrop-blur-sm border border-line text-ink text-xs flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-brand-strong" />
                        <span>{project.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs text-muted font-medium">
                      Sector: {project.client}
                    </span>
                    <h3 className="text-lg font-semibold text-ink mt-1 group-hover:text-brand-strong transition-colors leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-ink text-xs leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Tools used */}
                  {project.toolsUsed && project.toolsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.toolsUsed.map((tool, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded bg-surface-2 text-muted text-[11px] border border-line"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-2.5 px-3 rounded-md bg-surface-2 hover:bg-brand hover:text-ink text-ink text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Review Case Details & Deliverables</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-2/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-paper border border-line rounded-xl overflow-y-auto shadow-2xl text-ink">
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 py-4 bg-paper/95 backdrop-blur-sm border-b border-line flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-brand-strong uppercase tracking-wide">
                  {selectedProject.category}
                </span>
                <h3 className="text-base font-semibold text-ink">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-muted hover:text-ink rounded-md hover:bg-surface-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="relative h-60 rounded-lg overflow-hidden bg-surface-2">
                <img
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Context */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-surface-2 rounded-lg border border-line text-xs">
                <div>
                  <span className="text-muted block">Sector / Client</span>
                  <span className="font-medium text-ink">
                    {selectedProject.client}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Location</span>
                  <span className="font-medium text-ink">
                    {selectedProject.location || "Nigeria"}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Methodology & Execution
                </h4>
                <p className="text-ink text-xs leading-relaxed whitespace-pre-line">
                  {selectedProject.description}
                </p>
              </div>

              {/* Deliverables */}
              {selectedProject.deliverables && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">
                    Client Deliverables
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProject.deliverables.map((d, di) => (
                      <li
                        key={di}
                        className="flex items-start gap-2 text-xs text-ink"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-strong shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-line flex items-center justify-between">
                <span className="text-xs text-muted">
                  Need a similar assessment for your site?
                </span>
                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-md bg-brand hover:bg-brand text-paper font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Request Scope</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
