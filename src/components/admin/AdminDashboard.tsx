"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Check,
  DollarSign,
  Edit3,
  Layers,
  LogOut,
  Mail,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import { apiFetch, apiSend, uploadFile } from "@/lib/client";

type EditableTab = "projects" | "services" | "layers" | "pricing" | "reviews";
type TabKey = EditableTab | "inquiries";
type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "toggle"
  | "list"
  | "select"
  | "color"
  | "image"
  | "geojson";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  hint?: string;
  wide?: boolean;
}

interface ResourceConfig {
  label: string;
  icon: LucideIcon;
  endpoint: EditableTab;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  columns: { key: string; label: string }[];
}

const RESOURCES: Record<EditableTab, ResourceConfig> = {
  projects: {
    label: "Projects",
    icon: Briefcase,
    endpoint: "projects",
    defaults: {
      title: "",
      client: "",
      category: "Climate & Flood",
      summary: "",
      description: "",
      location: "Lagos State, Nigeria",
      date: "2025",
      featured: false,
      tags: [],
      toolsUsed: [],
      deliverables: [],
      coverImage: "",
    },
    columns: [
      { key: "title", label: "Title" },
      { key: "client", label: "Client" },
      { key: "category", label: "Category" },
      { key: "date", label: "Year" },
    ],
    fields: [
      { key: "title", label: "Project title", type: "text" },
      { key: "client", label: "Client / organization", type: "text" },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          "Climate & Flood",
          "Precision Agriculture",
          "Urban Planning",
          "Remote Sensing",
          "Renewable Energy",
          "Infrastructure",
          "GIS Mapping",
        ],
      },
      { key: "location", label: "Location", type: "text" },
      { key: "date", label: "Year / date", type: "text" },
      { key: "featured", label: "Featured on homepage", type: "toggle" },
      { key: "summary", label: "Short summary", type: "textarea" },
      { key: "description", label: "Full description", type: "textarea" },
      { key: "tags", label: "Tags (one per line)", type: "list" },
      { key: "toolsUsed", label: "Tools used (one per line)", type: "list" },
      {
        key: "deliverables",
        label: "Deliverables (one per line)",
        type: "list",
        wide: true,
      },
      {
        key: "coverImage",
        label: "Cover image",
        type: "image",
        hint: "Upload an image or paste an image URL. Uploads are stored in the database.",
      },
    ],
  },
  services: {
    label: "Services",
    icon: Layers,
    endpoint: "services",
    defaults: {
      title: "",
      category: "",
      icon: "Layers",
      description: "",
      methodology: "",
      tools: [],
      deliverables: [],
      order: 0,
    },
    columns: [
      { key: "title", label: "Service" },
      { key: "category", label: "Category" },
      { key: "icon", label: "Icon" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { key: "title", label: "Service title", type: "text" },
      { key: "category", label: "Category label", type: "text" },
      {
        key: "icon",
        label: "Icon",
        type: "select",
        options: [
          "Waves",
          "Sprout",
          "Building",
          "Sun",
          "Satellite",
          "Database",
          "Layers",
          "Globe",
        ],
      },
      { key: "order", label: "Display order", type: "number" },
      {
        key: "description",
        label: "Short description",
        type: "textarea",
        wide: true,
      },
      {
        key: "methodology",
        label: "Methodology overview",
        type: "textarea",
        wide: true,
      },
      {
        key: "tools",
        label: "Tools & data sources (one per line)",
        type: "list",
      },
      {
        key: "deliverables",
        label: "Standard deliverables (one per line)",
        type: "list",
      },
    ],
  },
  layers: {
    label: "Map layers",
    icon: Layers,
    endpoint: "layers",
    defaults: {
      name: "",
      type: "geojson",
      description: "",
      color: "#0284c7",
      colorField: "",
      url: "",
      data: null,
      visible: true,
      opacity: 0.8,
    },
    columns: [
      { key: "name", label: "Layer" },
      { key: "type", label: "Type" },
      { key: "color", label: "Color" },
      { key: "visible", label: "Visible" },
    ],
    fields: [
      { key: "name", label: "Layer name", type: "text" },
      {
        key: "type",
        label: "Layer type",
        type: "select",
        options: ["geojson", "cog", "raster"],
      },
      { key: "color", label: "Fill / line color", type: "color" },
      {
        key: "colorField",
        label: "Feature property for coloring (optional)",
        type: "text",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
      {
        key: "url",
        label: "External tile / COG URL (optional)",
        type: "text",
        wide: true,
      },
      { key: "visible", label: "Visible by default", type: "toggle" },
      { key: "opacity", label: "Opacity (0–1)", type: "number" },
      {
        key: "data",
        label: "GeoJSON data",
        type: "geojson",
        hint: "Upload a .geojson/.json file or paste GeoJSON. Stored in the database with the layer.",
        wide: true,
      },
    ],
  },
  pricing: {
    label: "Pricing",
    icon: DollarSign,
    endpoint: "pricing",
    defaults: {
      name: "",
      tagline: "",
      price: "Custom Quote",
      period: "per project scope",
      popular: false,
      ctaText: "Request Scope & Quote",
      features: [],
      order: 0,
    },
    columns: [
      { key: "name", label: "Package" },
      { key: "price", label: "Price" },
      { key: "period", label: "Period" },
      { key: "popular", label: "Popular" },
    ],
    fields: [
      { key: "name", label: "Package name", type: "text" },
      { key: "price", label: "Price label", type: "text" },
      { key: "period", label: "Billing period", type: "text" },
      { key: "order", label: "Display order", type: "number" },
      { key: "popular", label: "Mark as popular", type: "toggle" },
      { key: "tagline", label: "Tagline", type: "textarea", wide: true },
      {
        key: "features",
        label: "Included features (one per line)",
        type: "list",
        wide: true,
      },
      { key: "ctaText", label: "Call-to-action label", type: "text" },
    ],
  },
  reviews: {
    label: "Reviews",
    icon: Star,
    endpoint: "reviews",
    defaults: {
      author: "",
      role: "",
      organization: "",
      content: "",
      rating: 5,
      date: "",
      verified: true,
    },
    columns: [
      { key: "author", label: "Author" },
      { key: "organization", label: "Organization" },
      { key: "rating", label: "Rating" },
      { key: "verified", label: "Verified" },
    ],
    fields: [
      { key: "author", label: "Author", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "date", label: "Year / date", type: "text" },
      { key: "rating", label: "Rating (1–5)", type: "number" },
      { key: "verified", label: "Verified badge", type: "toggle" },
      { key: "content", label: "Review text", type: "textarea", wide: true },
    ],
  },
};

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "projects", label: "Projects", icon: Briefcase },
  { key: "services", label: "Services", icon: Layers },
  { key: "layers", label: "Map layers", icon: Layers },
  { key: "pricing", label: "Pricing", icon: DollarSign },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "inquiries", label: "Inquiries", icon: Mail },
];

const EMPTY_DATA: Record<TabKey, any[]> = {
  projects: [],
  services: [],
  layers: [],
  pricing: [],
  reviews: [],
  inquiries: [],
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [data, setData] = useState<Record<TabKey, any[]>>(EMPTY_DATA);
  const [form, setForm] = useState<Record<string, any> | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAll() {
    setBusy(true);
    try {
      const [projects, services, layers, pricing, reviews, inquiries] =
        await Promise.all([
          apiFetch<{ items: any[] }>("/api/projects"),
          apiFetch<{ items: any[] }>("/api/services"),
          apiFetch<{ items: any[] }>("/api/layers"),
          apiFetch<{ items: any[] }>("/api/pricing"),
          apiFetch<{ items: any[] }>("/api/reviews"),
          apiFetch<{ items: any[] }>("/api/contact"),
        ]);
      setData({
        projects: projects.items,
        services: services.items,
        layers: layers.items,
        pricing: pricing.items,
        reviews: reviews.items,
        inquiries: inquiries.items,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load content");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function switchTab(tab: TabKey) {
    setActiveTab(tab);
    setForm(null);
    setError("");
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form || activeTab === "inquiries") return;
    const config = RESOURCES[activeTab];
    setBusy(true);
    setError("");
    try {
      await apiSend(`/api/${config.endpoint}`, form.id ? "PUT" : "POST", form);
      setForm(null);
      await loadAll();
      notify(
        `${config.label} saved. The website will show the update on next load.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(tab: EditableTab, id: string) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    try {
      await apiSend(
        `/api/${RESOURCES[tab].endpoint}?id=${encodeURIComponent(id)}`,
        "DELETE",
      );
      if (form?.id === id) setForm(null);
      await loadAll();
      notify("Item deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete item");
    } finally {
      setBusy(false);
    }
  }

  async function handleStatus(id: string, status: string) {
    try {
      await apiSend("/api/contact", "PATCH", { id, status });
      await loadAll();
      notify("Inquiry status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  }

  async function handleLogout() {
    await apiSend("/api/auth", "DELETE");
    router.refresh();
  }

  function startNew() {
    if (activeTab === "inquiries") return;
    setForm({ ...RESOURCES[activeTab].defaults });
    setError("");
  }

  const config = activeTab === "inquiries" ? null : RESOURCES[activeTab];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              gsVista content studio
            </h1>
            <p className="text-xs text-muted">
              Edit live site content without writing code.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line text-xs font-medium hover:border-brand hover:text-brand-strong transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line text-xs font-medium hover:border-brand hover:text-brand-strong transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand-strong">
            <Check className="w-4 h-4" /> {message}
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger-ink">
            {error}
          </div>
        )}

        <nav className="flex gap-1 overflow-x-auto border-b border-line mb-8">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === key
                  ? "border-brand text-brand-strong"
                  : "border-transparent text-muted hover:text-ink hover:border-line"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
              <span className="text-[10px] rounded-full bg-surface-2 px-1.5 py-0.5">
                {data[key].length}
              </span>
            </button>
          ))}
        </nav>

        {activeTab === "inquiries" ? (
          <InquiryTable inquiries={data.inquiries} onStatus={handleStatus} />
        ) : (
          config && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{config.label}</h2>
                  <p className="text-xs text-muted mt-1">
                    Add, edit or remove {config.label.toLowerCase()} shown on
                    the live website.
                  </p>
                </div>
                <button
                  onClick={startNew}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-paper text-sm font-semibold hover:bg-brand-strong transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add new
                </button>
              </div>

              {form && (
                <form
                  onSubmit={handleSave}
                  className="rounded-xl border border-brand/30 bg-surface p-6 shadow-sm space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {form.id ? "Edit" : "New"}{" "}
                      {config.label.replace(/s$/, "")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setForm(null)}
                      className="p-1.5 rounded hover:bg-surface-2 text-muted hover:text-ink"
                      aria-label="Close form"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {config.fields.map((field) => (
                      <FieldInput
                        key={field.key}
                        field={field}
                        value={form[field.key]}
                        onChange={(value) =>
                          setForm((prev) => ({ ...prev, [field.key]: value }))
                        }
                        busy={busy}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForm(null)}
                      className="px-4 py-2 rounded-lg border border-line text-sm font-medium hover:border-brand"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-paper text-sm font-semibold hover:bg-brand-strong disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {busy ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </form>
              )}

              <div className="rounded-xl border border-line bg-surface overflow-hidden">
                {data[config.endpoint].length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted">
                    Nothing here yet. Use “Add new” to create the first entry.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
                      <tr>
                        {config.columns.map((column) => (
                          <th
                            key={column.key}
                            className="px-4 py-3 font-semibold"
                          >
                            {column.label}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {data[config.endpoint].map((item) => (
                        <tr key={item.id} className="hover:bg-surface-2/60">
                          {config.columns.map((column) => (
                            <td
                              key={column.key}
                              className="px-4 py-3 text-muted max-w-xs truncate"
                            >
                              {formatCell(item[column.key])}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setForm({ ...item });
                                  setError("");
                                }}
                                className="p-2 rounded-md text-muted hover:text-brand-strong hover:bg-brand-soft"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(config.endpoint, item.id)
                                }
                                className="p-2 rounded-md text-muted hover:text-danger hover:bg-danger-soft"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}

function formatCell(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function InquiryTable({
  inquiries,
  onStatus,
}: {
  inquiries: any[];
  onStatus: (id: string, status: string) => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      {inquiries.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted">
          No inquiries received yet.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">From</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="align-top">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{inquiry.name}</div>
                  <div className="text-xs text-muted">{inquiry.email}</div>
                  {inquiry.phone && (
                    <div className="text-xs text-muted">{inquiry.phone}</div>
                  )}
                  {inquiry.organization && (
                    <div className="text-xs text-muted">
                      {inquiry.organization}
                    </div>
                  )}
                  {inquiry.budget && (
                    <div className="text-xs text-muted">
                      Budget: {inquiry.budget}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{inquiry.inquiryType}</td>
                <td className="px-4 py-3 text-muted max-w-md whitespace-pre-wrap">
                  {inquiry.message}
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {inquiry.createdAt
                    ? new Date(inquiry.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={inquiry.status}
                    onChange={(event) =>
                      onStatus(inquiry.id, event.target.value)
                    }
                    className="rounded-md border border-line bg-paper px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contracted">Contracted</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  busy,
}: {
  field: FieldDef;
  value: any;
  onChange: (value: any) => void;
  busy: boolean;
}) {
  const className =
    "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-muted/70";
  const label = (
    <span className="text-xs font-semibold text-ink block mb-1.5">
      {field.label}
    </span>
  );
  const wrapper = `min-w-0 ${field.wide ? "md:col-span-2" : ""}`;

  if (field.type === "toggle") {
    return (
      <label
        className={`${wrapper} flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2.5`}
      >
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-[rgb(var(--brand))]"
        />
        <span className="text-xs font-medium text-ink">{field.label}</span>
      </label>
    );
  }

  if (field.type === "list") {
    return (
      <label className={wrapper}>
        {label}
        <textarea
          rows={4}
          value={Array.isArray(value) ? value.join("\n") : ""}
          onChange={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
          className={`${className} font-mono text-xs`}
          placeholder={field.placeholder || "One item per line"}
        />
      </label>
    );
  }

  if (field.type === "geojson") {
    const text =
      typeof value === "string"
        ? value
        : value
          ? JSON.stringify(value, null, 2)
          : "";
    return (
      <div className={wrapper}>
        {label}
        <div className="flex items-center gap-2 mb-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-medium cursor-pointer hover:border-brand hover:text-brand-strong">
            <Upload className="w-3.5 h-3.5" /> Upload GeoJSON file
            <input
              type="file"
              accept=".geojson,.json,application/geo+json,application/json"
              disabled={busy}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) onChange(await file.text());
              }}
            />
          </label>
          {text && (
            <span className="text-xs text-muted">
              {text.length.toLocaleString()} characters
            </span>
          )}
        </div>
        <textarea
          rows={7}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={`${className} font-mono text-xs`}
          placeholder='{ "type": "FeatureCollection", "features": [] }'
        />
        {field.hint && (
          <p className="text-[11px] text-muted mt-1">{field.hint}</p>
        )}
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div className={wrapper}>
        {label}
        <div className="flex items-center gap-3">
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Preview"
              className="h-14 w-20 rounded border border-line object-cover bg-surface-2"
            />
          )}
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line text-xs font-medium cursor-pointer hover:border-brand hover:text-brand-strong">
            <Upload className="w-3.5 h-3.5" /> Upload image
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  const uploaded = await uploadFile(file);
                  onChange(uploaded.url);
                } catch {
                  onChange("");
                }
              }}
            />
          </label>
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={`${className} mt-2`}
          placeholder="Or paste an image URL"
        />
        {field.hint && (
          <p className="text-[11px] text-muted mt-1">{field.hint}</p>
        )}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <label className={wrapper}>
        {label}
        <select
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className={wrapper}>
        {label}
        <textarea
          rows={3}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
          placeholder={field.placeholder}
        />
      </label>
    );
  }

  return (
    <label className={wrapper}>
      {label}
      <input
        type={
          field.type === "number"
            ? "number"
            : field.type === "color"
              ? "color"
              : "text"
        }
        step={field.key === "opacity" ? "0.05" : undefined}
        min={
          field.key === "opacity" ? 0 : field.key === "rating" ? 1 : undefined
        }
        max={
          field.key === "opacity" ? 1 : field.key === "rating" ? 5 : undefined
        }
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            field.type === "number"
              ? Number(event.target.value)
              : event.target.value,
          )
        }
        className={className}
        placeholder={field.placeholder}
      />
      {field.hint && (
        <p className="text-[11px] text-muted mt-1">{field.hint}</p>
      )}
    </label>
  );
}
