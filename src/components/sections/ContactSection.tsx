"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { apiSend } from "@/lib/client";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    inquiryType: "Contract / Project Inquiry",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await apiSend("/api/contact", "POST", formData);
      setSubmitted(true);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Unable to send your inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-surface relative border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-soft/60 border border-brand/30 text-brand-strong text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>Contact & Inquiries</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                Get in Touch with the gsVista Team
              </h2>

              <p className="text-muted text-sm leading-relaxed">
                Whether you need satellite imagery pre-processing, a coastal
                flood hazard assessment, or precision crop health telemetry, we
                are available to review your Area of Interest (AOI) coordinates
                and discuss your technical specifications.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3 pt-2">
              <a
                href="mailto:info@gsvista.com"
                className="flex items-center gap-3.5 p-4 rounded-xl bg-paper border border-line hover:border-line hover:bg-surface-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-soft/60 border border-brand/30 flex items-center justify-center text-brand-strong group-hover:bg-brand-soft/60 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-muted block">
                    Direct Email
                  </span>
                  <span className="text-ink font-medium text-sm group-hover:text-brand-strong transition-colors">
                    info@gsvista.com
                  </span>
                </div>
              </a>

              <a
                href="tel:+2349014564547"
                className="flex items-center gap-3.5 p-4 rounded-xl bg-paper border border-line hover:border-line hover:bg-surface-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-soft/60 border border-brand/30 flex items-center justify-center text-brand-strong group-hover:bg-brand-soft/60 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-muted block">
                    Phone & WhatsApp
                  </span>
                  <span className="text-ink font-medium text-sm group-hover:text-brand-strong transition-colors">
                    +234 901 456 4547
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-paper border border-line">
                <div className="w-10 h-10 rounded-lg bg-brand-soft/60 border border-brand/30 flex items-center justify-center text-brand-strong">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-muted block">
                    Office Location
                  </span>
                  <span className="text-ink font-medium text-sm">
                    Ajayi-apata estate, Lagos, Nigeria
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-paper border border-line p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-brand-soft/60 border border-brand/50 text-brand-strong flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    Inquiry Received
                  </h3>
                  <p className="text-ink text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. We have received your scope
                    details and will review them promptly. We will contact you
                    at{" "}
                    <strong className="text-brand-strong">
                      {formData.email}
                    </strong>
                    .
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          organization: "",
                          inquiryType: "Contract / Project Inquiry",
                          budget: "",
                          message: "",
                        });
                      }}
                      className="px-4 py-2 rounded-md bg-surface-2 hover:bg-surface-2 text-ink text-xs font-medium transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
                      Submit a Project Inquiry / Request for Proposal
                    </h3>
                    <p className="text-muted text-xs mt-1">
                      Share your project requirements, location, or area of
                      interest coordinates.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-md bg-danger-soft border border-danger/30 text-danger-ink text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink mb-1">
                        Full Name <span className="text-brand-strong">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Babatunde Adeleke"
                        className="w-full px-3 py-2 rounded-md bg-surface-2 border border-line text-ink text-xs placeholder-muted focus:outline-none focus:border-brand/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink mb-1">
                        Email Address{" "}
                        <span className="text-brand-strong">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="e.g. adeleke@enterprise.com"
                        className="w-full px-3 py-2 rounded-md bg-surface-2 border border-line text-ink text-xs placeholder-muted focus:outline-none focus:border-brand/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+234..."
                        className="w-full px-3 py-2 rounded-md bg-surface-2 border border-line text-ink text-xs placeholder-muted focus:outline-none focus:border-brand/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink mb-1">
                        Organization / Company
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: e.target.value,
                          })
                        }
                        placeholder="e.g. Civil Engineering Firm"
                        className="w-full px-3 py-2 rounded-md bg-surface-2 border border-line text-ink text-xs placeholder-muted focus:outline-none focus:border-brand/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inquiryType: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 rounded-md bg-surface-2 border border-line text-ink text-xs focus:outline-none focus:border-brand/40"
                    >
                      <option value="Contract / Project Inquiry">
                        Contract / Project Inquiry
                      </option>
                      <option value="Government / NGO">
                        Government / Institutional Study
                      </option>
                      <option value="Consulting">
                        Consulting / Data Advisory
                      </option>
                      <option value="General">General Spatial Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">
                      Project Scope & Target Location{" "}
                      <span className="text-brand-strong">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Please describe your project location (e.g. Lagos, Niger Delta), specific analysis needed (e.g. flood modeling, NDVI vegetation health, land use change), and timeline..."
                      className="w-full px-3 py-2 rounded-md bg-surface-2 border border-line text-ink text-xs placeholder-muted focus:outline-none focus:border-brand/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-md bg-brand hover:bg-brand text-paper font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Project Scope</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
