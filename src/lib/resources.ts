import { z } from "zod";
import { toLayer, toPricing, toProject, toReview, toService } from "@/lib/db";

const textArray = z.array(z.string()).default([]);

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Project title is required"),
  client: z.string().default(""),
  category: z.string().min(1, "Category is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().default(""),
  tags: textArray,
  coverImage: z.string().default(""),
  date: z.string().default(""),
  featured: z.boolean().default(false),
  deliverables: textArray,
  location: z.string().default(""),
  toolsUsed: textArray,
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.enum([
    "Waves",
    "Sprout",
    "Building",
    "Sun",
    "Satellite",
    "Database",
    "Layers",
    "Globe",
  ]),
  title: z.string().min(1, "Service title is required"),
  category: z.string().default(""),
  description: z.string().default(""),
  tools: textArray,
  deliverables: textArray,
  methodology: z.string().default(""),
  order: z.number().int().default(0),
});

export const reviewSchema = z.object({
  id: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  role: z.string().default(""),
  organization: z.string().default(""),
  content: z.string().min(1, "Review text is required"),
  rating: z.number().int().min(1).max(5).default(5),
  date: z.string().default(""),
  verified: z.boolean().default(true),
});

export const pricingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Package name is required"),
  tagline: z.string().default(""),
  price: z.string().default("Custom Quote"),
  period: z.string().default("per project scope"),
  popular: z.boolean().default(false),
  features: textArray,
  ctaText: z.string().default("Request Scope & Quote"),
  order: z.number().int().default(0),
});

export const layerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Layer name is required"),
  type: z.string().default("geojson"),
  description: z.string().default(""),
  color: z.string().default("#0284c7"),
  colorField: z.string().optional(),
  url: z.string().optional(),
  data: z.any().optional(),
  visible: z.boolean().default(true),
  opacity: z.number().min(0).max(1).default(1),
});

/** Parses GeoJSON pasted as text into an object before validation. */
export function normalizeLayerInput(body: any) {
  if (body && typeof body.data === "string" && body.data.trim()) {
    try {
      return { ...body, data: JSON.parse(body.data) };
    } catch {
      throw new Error("Layer data is not valid GeoJSON JSON");
    }
  }
  return body;
}

export const resourceConfigs = {
  projects: {
    table: "gsvista_projects",
    orderBy: "ORDER BY created_at DESC, id ASC",
    schema: projectSchema,
    fromRow: toProject,
    toColumns: (item: any) => ({
      id: item.id,
      title: item.title,
      client: item.client,
      category: item.category,
      summary: item.summary,
      description: item.description,
      tags: item.tags,
      cover_image: item.coverImage,
      date: item.date,
      featured: item.featured,
      deliverables: item.deliverables,
      location: item.location,
      tools_used: item.toolsUsed,
    }),
  },
  services: {
    table: "gsvista_services",
    orderBy: "ORDER BY sort_order ASC, id ASC",
    schema: serviceSchema,
    fromRow: toService,
    toColumns: (item: any) => ({
      id: item.id,
      icon: item.icon,
      title: item.title,
      category: item.category,
      description: item.description,
      tools: item.tools,
      deliverables: item.deliverables,
      methodology: item.methodology,
      sort_order: item.order,
    }),
  },
  reviews: {
    table: "gsvista_reviews",
    orderBy: "ORDER BY created_at DESC, id ASC",
    schema: reviewSchema,
    fromRow: toReview,
    toColumns: (item: any) => ({
      id: item.id,
      author: item.author,
      role: item.role,
      organization: item.organization,
      content: item.content,
      rating: item.rating,
      date: item.date,
      verified: item.verified,
    }),
  },
  pricing: {
    table: "gsvista_pricing",
    orderBy: "ORDER BY sort_order ASC, id ASC",
    schema: pricingSchema,
    fromRow: toPricing,
    toColumns: (item: any) => ({
      id: item.id,
      name: item.name,
      tagline: item.tagline,
      price: item.price,
      period: item.period,
      popular: item.popular,
      features: item.features,
      cta_text: item.ctaText,
      sort_order: item.order,
    }),
  },
  layers: {
    table: "gsvista_layers",
    orderBy: "ORDER BY created_at DESC, id ASC",
    schema: layerSchema,
    fromRow: toLayer,
    normalize: normalizeLayerInput,
    toColumns: (item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      color: item.color,
      color_field: item.colorField || null,
      url: item.url || null,
      data: item.data ? JSON.stringify(item.data) : null,
      visible: item.visible,
      opacity: item.opacity,
    }),
  },
} as const;
