import postgres from "postgres";
import {
  Project,
  Review,
  PricingTier,
  MapLayerItem,
  Service,
  ContactInquiry,
} from "@/types";
import {
  INITIAL_PROJECTS,
  INITIAL_REVIEWS,
  INITIAL_PRICING,
  INITIAL_MAP_LAYERS,
} from "@/data/initialData";
import { INITIAL_SERVICES } from "@/data/initialServices";

let sqlInstance: ReturnType<typeof postgres> | null = null;

/** Lazily creates the connection so builds do not require a database URL. */
export function getSql() {
  if (!sqlInstance) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "POSTGRES_URL is not set. Add your managed Postgres connection string to .env.local (local) or Vercel environment variables.",
      );
    }
    sqlInstance = postgres(connectionString, {
      max: process.env.NODE_ENV === "production" ? 3 : 1,
      ssl: /localhost|127\.0\.0\.1/.test(connectionString) ? false : "require",
      idle_timeout: 20,
      connect_timeout: 20,
    });
  }
  return sqlInstance;
}

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS gsvista_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'GIS Mapping',
    summary TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT NOT NULL DEFAULT '',
    cover_media_id TEXT,
    date TEXT NOT NULL DEFAULT '',
    featured BOOLEAN NOT NULL DEFAULT false,
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    location TEXT NOT NULL DEFAULT '',
    tools_used TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsvista_services (
    id TEXT PRIMARY KEY,
    icon TEXT NOT NULL DEFAULT 'Layers',
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    tools TEXT[] NOT NULL DEFAULT '{}',
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    methodology TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsvista_reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT '',
    organization TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    rating INTEGER NOT NULL DEFAULT 5,
    date TEXT NOT NULL DEFAULT '',
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsvista_pricing (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT '',
    price TEXT NOT NULL DEFAULT 'Custom Quote',
    period TEXT NOT NULL DEFAULT 'per project scope',
    popular BOOLEAN NOT NULL DEFAULT false,
    features TEXT[] NOT NULL DEFAULT '{}',
    cta_text TEXT NOT NULL DEFAULT 'Request Scope & Quote',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsvista_layers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'geojson',
    description TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '#0284c7',
    color_field TEXT,
    url TEXT,
    source_crs TEXT,
    data JSONB,
    visible BOOLEAN NOT NULL DEFAULT true,
    opacity REAL NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsvista_inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    organization TEXT NOT NULL DEFAULT '',
    inquiry_type TEXT NOT NULL DEFAULT 'General',
    message TEXT NOT NULL DEFAULT '',
    budget TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsvista_media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    data BYTEA NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

let readyPromise: Promise<void> | null = null;

/**
 * Older builds stored GeoJSON as a JSON string inside the JSONB column, which
 * MapLibre treats as a URL. Convert those rows back into real JSON objects.
 */
async function repairStringifiedLayerData(sql: ReturnType<typeof postgres>) {
  const rows = await sql<{ id: string; raw: string }[]>`
    SELECT id, data #>> '{}' AS raw
    FROM gsvista_layers
    WHERE jsonb_typeof(data) = 'string'
  `;
  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.raw);
      await sql`
        UPDATE gsvista_layers
        SET data = ${sql.json(parsed)}
        WHERE id = ${row.id}
      `;
    } catch {
      // Leave unparseable values untouched.
    }
  }
}

async function seedIfEmpty(sql: ReturnType<typeof postgres>) {
  const [{ count: projectCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM gsvista_projects
  `;
  if (Number(projectCount) === 0) {
    await Promise.all(
      INITIAL_PROJECTS.map(
        (p) => sql`
        INSERT INTO gsvista_projects
          (id, title, client, category, summary, description, tags, cover_image, date, featured, deliverables, location, tools_used)
        VALUES
          (${p.id}, ${p.title}, ${p.client}, ${p.category}, ${p.summary}, ${p.description}, ${p.tags},
           ${p.coverImage}, ${p.date}, ${p.featured}, ${p.deliverables}, ${p.location || ""}, ${p.toolsUsed || []})
        ON CONFLICT (id) DO NOTHING
      `,
      ),
    );
  }

  const [{ count: serviceCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM gsvista_services
  `;
  if (Number(serviceCount) === 0) {
    await Promise.all(
      INITIAL_SERVICES.map(
        (s) => sql`
        INSERT INTO gsvista_services
          (id, icon, title, category, description, tools, deliverables, methodology, sort_order)
        VALUES
          (${s.id}, ${s.icon}, ${s.title}, ${s.category}, ${s.description}, ${s.tools},
           ${s.deliverables}, ${s.methodology}, ${s.order})
        ON CONFLICT (id) DO NOTHING
      `,
      ),
    );
  }

  const [{ count: reviewCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM gsvista_reviews
  `;
  if (Number(reviewCount) === 0) {
    await Promise.all(
      INITIAL_REVIEWS.map(
        (r) => sql`
        INSERT INTO gsvista_reviews (id, author, role, organization, content, rating, date, verified)
        VALUES (${r.id}, ${r.author}, ${r.role}, ${r.organization}, ${r.content}, ${r.rating}, ${r.date || ""}, ${r.verified})
        ON CONFLICT (id) DO NOTHING
      `,
      ),
    );
  }

  const [{ count: pricingCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM gsvista_pricing
  `;
  if (Number(pricingCount) === 0) {
    await Promise.all(
      INITIAL_PRICING.map(
        (t, i) => sql`
        INSERT INTO gsvista_pricing (id, name, tagline, price, period, popular, features, cta_text, sort_order)
        VALUES (${t.id}, ${t.name}, ${t.tagline}, ${t.price}, ${t.period}, ${t.popular ?? false}, ${t.features}, ${t.ctaText}, ${i})
        ON CONFLICT (id) DO NOTHING
      `,
      ),
    );
  }

  const [{ count: layerCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM gsvista_layers
  `;
  if (Number(layerCount) === 0) {
    await Promise.all(
      INITIAL_MAP_LAYERS.map(
        (l) => sql`
        INSERT INTO gsvista_layers (id, name, type, description, color, color_field, url, data, visible, opacity)
        VALUES (${l.id}, ${l.name}, ${l.type}, ${l.description}, ${l.color}, ${l.colorField || null},
                ${l.url || null}, ${sql.json(l.data || {})}, ${l.visible}, ${l.opacity ?? 1})
        ON CONFLICT (id) DO NOTHING
      `,
      ),
    );
  }
}

/** Creates tables and seeds starter content once per server process. */
export function ensureDatabase(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      const sql = getSql();
      for (const statement of SCHEMA_STATEMENTS) {
        await sql.unsafe(statement);
      }
      // Migration for databases created before per-layer source CRS support.
      await sql.unsafe(
        "ALTER TABLE gsvista_layers ADD COLUMN IF NOT EXISTS source_crs TEXT",
      );
      await repairStringifiedLayerData(sql);
      await seedIfEmpty(sql);
    })().catch((error) => {
      readyPromise = null;
      throw error;
    });
  }
  return readyPromise;
}

// ---------- Row mappers ----------

export function toProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    client: row.client,
    category: row.category,
    summary: row.summary,
    description: row.description,
    tags: row.tags || [],
    coverImage: row.cover_media_id
      ? `/api/media/${row.cover_media_id}`
      : row.cover_image || "",
    date: row.date || "",
    featured: row.featured,
    deliverables: row.deliverables || [],
    location: row.location || "",
    toolsUsed: row.tools_used || [],
  };
}

export function toService(row: any): Service {
  return {
    id: row.id,
    icon: row.icon,
    title: row.title,
    category: row.category,
    description: row.description,
    tools: row.tools || [],
    deliverables: row.deliverables || [],
    methodology: row.methodology,
    order: row.sort_order,
  };
}

export function toReview(row: any): Review {
  return {
    id: row.id,
    author: row.author,
    role: row.role,
    organization: row.organization,
    content: row.content,
    rating: row.rating,
    date: row.date,
    verified: row.verified,
  };
}

export function toPricing(row: any): PricingTier {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    period: row.period,
    popular: row.popular,
    features: row.features || [],
    ctaText: row.cta_text,
  };
}

export function toLayer(row: any): MapLayerItem {
  let data = row.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      // Keep the original value so the admin can inspect/fix it.
    }
  }

  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description,
    color: row.color,
    colorField: row.color_field || undefined,
    url: row.url || undefined,
    sourceCrs: row.source_crs || undefined,
    data: data ?? undefined,
    visible: row.visible,
    opacity: row.opacity,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

export function toInquiry(row: any): ContactInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    organization: row.organization,
    inquiryType: row.inquiry_type,
    message: row.message,
    budget: row.budget,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}
