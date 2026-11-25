# gsVista — Geospatial Innovation, Science & Advanced Spatial Analysis

Corporate website for **gsVista**, a Lagos-based geospatial consultancy. The site is a Next.js app deployed on **Vercel**, backed by a **managed Postgres** database (e.g. Neon). All public content is editable from a password-protected admin studio at `/admin` — no code changes required.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS with semantic light/dark tokens (white / black / blue) |
| Database | Managed Postgres via `postgres` (postgres.js), schema in `db/schema.sql` |
| Auth | Server-verified password + signed HTTP-only session cookie |
| Maps | MapLibre GL JS with GeoJSON layers stored in Postgres |
| Deployment | Vercel (Hobby plan supports free custom domains) |

Supabase, the JSON-file storage layer, Cloudflare Pages, and the Groq AI assistant have been removed.

---

## Features

- **Interactive map showcase** — OSM and Esri satellite basemaps, toggleable GeoJSON layers, feature popups, fullscreen mode, and automatic reprojection of UTM/Web Mercator data to WGS84.
- **Editable content studio (`/admin`)** — manage projects, services, map layers, pricing packages, reviews, and contact inquiries. Upload images and GeoJSON files directly; they are stored in Postgres.
- **Contact inbox** — public inquiry form writes to Postgres; admin marks inquiries as *New*, *Reviewed*, or *Contracted*.
- **Corporate pages** — services, projects, pricing, about, contact, privacy, and terms.
- **Two themes** — the default is white background, black text, and blue accents; a toggle switches to an inverted dark palette.

---

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and set:

   ```env
   POSTGRES_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   ADMIN_PASSWORD=choose-a-strong-password
   ADMIN_SESSION_SECRET=a-long-random-string
   ```

   A free Neon database works well. Tables and starter content are created automatically on the first request.

3. Run the app:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 and visit http://localhost:3000/admin.

---

## Admin studio

1. Go to `/admin` and sign in with `ADMIN_PASSWORD`. The cookie is HTTP-only and signed with `ADMIN_SESSION_SECRET`; credentials are never sent to the browser.
2. Choose a tab:
   - **Projects** — title, client, category, summary, description, tags, tools, deliverables, featured flag, and cover image upload.
   - **Services** — the cards on the homepage, including icon, methodology, tools, and deliverables.
   - **Map layers** — name, color, visibility, opacity, and GeoJSON. Upload a `.geojson` file or paste JSON.
   - **Pricing** — package details, features, and display order.
   - **Reviews** — author, organization, rating, verified badge, and quote.
   - **Inquiries** — read submitted leads and update their status.
3. Use **Add new**, the pencil icon, and the trash icon to create, edit, and delete entries. Changes appear on the live site on the next page load.

Uploads are limited to 4 MB each (Vercel serverless payload limit). Images and files are served from `/api/media/<id>`.

---

## Deploying to Vercel

1. Push the repository to your GitHub organisation and import it into Vercel.
2. Add `POSTGRES_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` under **Project Settings → Environment Variables**.
3. Deploy. Framework detection will use `npm run build`.
4. Add the domain under **Project Settings → Domains**. Hobby projects support custom domains for free.
5. At your registrar (e.g. Namecheap), point DNS to Vercel:

   | Type | Host | Value |
   | --- | --- | --- |
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Keep existing MX/TXT records so `info@gsvista.com` mail continues to work.

---

## API

All JSON endpoints return `{ "success": true, ... }` or `{ "success": false, "error": "..." }`.

| Endpoint | Public methods | Admin-only methods |
| --- | --- | --- |
| `/api/projects` | GET | POST, PUT, DELETE |
| `/api/services` | GET | POST, PUT, DELETE |
| `/api/layers` | GET | POST, PUT, DELETE |
| `/api/pricing` | GET | POST, PUT, DELETE |
| `/api/reviews` | GET | POST, PUT, DELETE |
| `/api/contact` | POST | GET, PATCH |
| `/api/media` | — | POST (multipart upload) |
| `/api/media/[id]` | GET | — |
| `/api/auth` | GET (session status) | POST (login), DELETE (logout) |

---

## Project structure

```text
src/app/                 Pages and route handlers
src/components/admin/    Admin login and content studio
src/components/sections/ Homepage and page sections
src/components/map/      MapLibre viewer
src/data/                Starter content used for first-run seeding
src/lib/db.ts            Postgres client, schema bootstrap, seeding, row mappers
src/lib/auth.ts          Password verification and session cookie helpers
src/lib/resources.ts     Validation schemas and table/field mappings
src/lib/api.ts           Generic CRUD route factory
db/schema.sql            Reference schema
```

Useful commands: `npm run dev`, `npm run build`, `npm run start`, `npm run lint` (TypeScript check).
