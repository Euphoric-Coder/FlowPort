# FlowPort — Version 0.1

**Intelligent Logistics & Supply Chain Management**
*Move Smarter. Deliver Better.*

FlowPort is a premium, AI-native logistics platform interface. This repository contains **Version 0.1** — a fully interactive frontend foundation with realistic, interconnected mock data and a mock service layer designed so real backends, AI services, and mapping providers can replace it in later versions.

> **Demo notice:** Everything in this version runs on deterministic sample data. No real authentication, databases, payments, AI inference, routing engines, or external APIs are connected.

---

## Tech Stack

- **Next.js 13 (App Router)** + React 18 + TypeScript (strict)
- **Tailwind CSS** with a custom design system (dark + light themes)
- **shadcn/ui** (Radix primitives) for the component library
- **Recharts** for analytics visualizations
- **Framer Motion** for micro-interactions
- **React Hook Form + Zod** for form validation
- **next-themes** for theme switching, **Sonner** for toasts, **Lucide** for icons

## Getting Started

```bash
npm install
npm run dev        # start dev server
npm run build      # production build
npm run typecheck  # strict TypeScript check
```

Open the marketing site at `/` and the platform at `/dashboard`. No login is required — sign-in and registration are simulated.

## Project Structure

```
app/
  (marketing)/            # public site: /, /features, /solutions, /pricing
  (auth)/                 # /login, /register (simulated)
  dashboard/              # platform shell + all module pages
components/
  layout/                 # sidebar, header, page header
  dashboard/              # dashboard-level feature components (+ ai/)
  marketing/              # marketing nav, footer, hero visual
  shared/                 # logo, theme toggle, KPI cards, charts, badges, providers
  ui/                     # shadcn/ui primitives
data/mock/                # centralized, interconnected mock dataset
types/                    # shared TypeScript domain models
hooks/  lib/              # hooks (toast) and utilities
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
