# FlowPort — Version 1.1

**Intelligent Logistics & Supply Chain Management**
*Move Smarter. Deliver Better.*

FlowPort is a large-scale, AI-powered logistics and supply chain management platform.

This repository contains **Version 1.1 — Simplified Backend & Database Foundation** along with the interactive Next.js frontend application.

---

## Technical Architecture

FlowPort uses a decoupled fullstack architecture:

- **Frontend**: Next.js 13.5 (App Router) + React 18 + Tailwind CSS + Radix UI + Framer Motion
- **Backend API**: Node.js + Express + TypeScript (located in `backend/`)
- **Database**: NeonDB (Serverless Managed PostgreSQL)
- **ORM & Migrations**: Drizzle ORM + Drizzle Kit
- **Testing**: Vitest + Supertest

---

## Quick Start Commands

### 1. Frontend

```bash
npm install
npm run dev        # Starts frontend at http://localhost:3000
npm run typecheck  # Strict TypeScript verification
npm run build      # Next.js production build
```

### 2. Backend (Version 1.0)

```bash
# Start backend in development mode (from root or backend/)
npm run backend:dev

# Run automated tests (Vitest + Supertest)
npm run backend:test

# Compile backend TypeScript
npm run backend:typecheck
npm run backend:build

# Database migrations & tools
npm run db:generate  # Generate SQL migration
npm run db:migrate   # Apply migrations to Neon
npm run db:seed      # Seed deterministic demo data
npm run db:studio    # Open Drizzle Studio database browser
```

The local backend runs at:
- **API Base URL**: `http://localhost:5000/api/v1`
- **Liveness Probe**: `http://localhost:5000/api/v1/health`
- **Readiness Probe**: `http://localhost:5000/api/v1/health/ready`
- **Swagger Documentation**: `http://localhost:5000/api/docs`

---

## Environment Variables

### Backend (`backend/.env`)
See `backend/.env.example`:
```ini
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@ep-sample-pooler.region.neon.tech/flowport?sslmode=require
DIRECT_DATABASE_URL=postgresql://USER:PASSWORD@ep-sample.region.neon.tech/flowport?sslmode=require
```

### Frontend (`.env.local`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Project Structure

```
FlowPort/
├── app/                  # Next.js App Router (marketing, auth, dashboard)
├── components/           # UI components (Radix, layout, dashboard, shared)
├── data/mock/            # Realistic mock data layer
├── lib/
│   ├── api-client.ts     # Typed backend API client (Version 1.0 integration)
│   └── utils.ts          # Shared UI utilities
├── public/               # Static assets & icons
├── types/                # Frontend TypeScript domain types
└── backend/              # FlowPort Version 1.0 Backend
    ├── src/
    │   ├── app.ts        # Express setup, security, logging & middleware
    │   ├── server.ts     # HTTP server bootstrap & graceful shutdown
    │   ├── config/       # Environment, CORS & Pino logger
    │   ├── db/           # Drizzle client, pool, schemas & seed script
    │   ├── modules/      # Health check module
    │   ├── middleware/   # Request logger, error handler & 404
    │   ├── lib/errors/   # Custom AppError hierarchy
    │   └── docs/         # OpenAPI 3.0 specification
    ├── drizzle/          # Generated version-controlled SQL migrations
    └── tests/            # Vitest + Supertest automated test suite
```

## Implemented Features

**Marketing site** — sticky blurred navigation with theme toggle, animated hero with simulated dashboard preview, demo-data metrics band, 8 feature cards, "How FlowPort Works" workflow, roles/solutions overview, security-architecture vision, pricing with three plans, and full footer.

**Dashboard shell** — collapsible desktop sidebar with section grouping and collapsed tooltips, mobile drawer navigation, breadcrumbs, global search (`/` hotkey) with quick navigation, workspace selector, notification badge, user menu.

**Modules**
- **Overview** — 6 KPI cards, shipment volume area chart (7/30-day toggle), status donut, delivery performance bars, fleet utilization, simulated network map (SVG, no external maps), activity feed, labeled simulated AI insight cards, CSV export.
- **Orders** — summary cards, searchable/sortable/filterable/paginated table, order detail drawer with timeline and line items, validated create-order modal that updates local state.
- **Shipments** — tracking table with progress bars and status filters, detail dialog with full event timeline.
- **Warehouses** — facility cards with capacity visualization, detail dialog with inventory summary and fulfillment queue.
- **Inventory** — stock KPIs, low-stock warning cards, search/status/warehouse filters, sortable table, detail drawer with stock-health visualization.
- **Fleet** — KPI cards, per-vehicle load/fuel snapshot grid, filterable vehicle table, detail dialog.
- **Route Planning** — validated planning form, animated simulated optimization, three deterministic route alternatives with efficiency scoring, route preview map, clearly labeled demo notice.
- **Analytics** — revenue, cost structure, delivery completion vs. target, SLA compliance, regional performance table, warehouse efficiency, fleet mix, loading skeletons, CSV export.
- **AI Control Tower** — AI overview cards, severity-ranked insights feed with Review (detail panel) and Dismiss, grounded rule-based assistant chat with suggested prompts, historical-vs-projected demand chart, action recommendations.
- **Notifications** — read/unread states, category and unread filters, mark-all-as-read.
- **Settings** — account preferences, workspace info, light/dark appearance picker, notification toggles, persisted demo persona (localStorage).

## Mock Data Architecture

All data lives in `data/mock/index.ts` and is **interconnected**: orders reference real customers and products, shipments reference existing orders and fleet vehicles, inventory references valid warehouses, and KPIs/charts derive from consistent assumptions. A deterministic PRNG keeps every page load identical. Types in `types/index.ts` form the contract a future backend would implement — swapping the mock layer for real services means replacing the data module without touching UI components.

## Deliberate Limitations (by design in v0.1)

- No production authentication — login/register are simulated and clearly labeled.
- No database, backend, payments, or real integrations of any kind.
- The AI assistant uses predefined, deterministic responses grounded in the mock dataset — no external LLM is called, and all AI content is labeled **Simulated AI Insight**.
- Route optimization is a deterministic demo — **no live routing engine is connected**.
- The network map is a styled SVG illustration, ready to be replaced with a real mapping implementation.
- No security certifications, customer counts, or production claims are made anywhere in the UI.
