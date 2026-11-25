"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { apiSend } from "@/lib/client";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiSend("/api/auth", "POST", { password });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-strong mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to website
        </Link>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong mb-5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin portal</h1>
          <p className="text-sm text-muted mt-2">
            Manage projects, services, map layers, pricing, reviews, and
            inquiries without touching code.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-ink">Password</span>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-lg border border-line bg-paper pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Enter admin password"
                />
              </div>
            </label>

            {error && (
              <p className="text-xs text-danger-ink bg-danger-soft border border-danger/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand text-paper font-semibold text-sm hover:bg-brand-strong disabled:opacity-60 transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-xs text-muted text-center mt-6">
          Access is gated server-side. Set{" "}
          <code className="font-mono">ADMIN_PASSWORD</code> in your environment.
        </p>
      </div>
    </main>
  );
}
