# FlowPort Backend (Version 1.1)

A clean, minimal Node.js, Express, and Drizzle ORM backend for FlowPort connecting to NeonDB PostgreSQL.

---

## 1. Directory Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── dbconfig.ts    # Neon PostgreSQL connection pool & Drizzle client
│   │   ├── schema.ts      # Consolidated Drizzle schema (users, organizations, memberships)
│   │   ├── migrate.ts     # Migration runner script
│   │   └── seed.ts        # Database seed script
│   ├── middleware/
│   │   └── errorHandler.ts# Centralized JSON error handler
│   ├── routes/
│   │   └── health.ts      # /api/v1/health & /api/v1/health/ready probes
│   └── server.ts          # Main Express entry point & graceful shutdown
├── drizzle/
│   ├── 0000_brave_warstar.sql # Initial SQL migration
│   └── meta/              # Migration journal & snapshots
├── tests/
│   ├── health.test.ts     # Liveness probe tests
│   ├── middleware.test.ts # 404, CORS, Helmet & error tests
│   └── database.test.ts   # Readiness probe & schema structure tests
├── drizzle.config.ts      # Drizzle Kit configuration
├── .env.example           # Environment template
└── package.json           # Dependencies and scripts
```

---

## 2. Installation & Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your Neon connection strings:
```ini
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# NeonDB Pooled Connection (used by Express application runtime)
DATABASE_URL=postgresql://USER:PASSWORD@ep-sample-pooler.region.neon.tech/flowport?sslmode=require

# NeonDB Direct Connection (used by Drizzle migrations)
DIRECT_DATABASE_URL=postgresql://USER:PASSWORD@ep-sample.region.neon.tech/flowport?sslmode=require
```

---

## 3. Database Commands

```bash
# Generate SQL migrations from schema diff
npm run db:generate

# Apply migrations to Neon PostgreSQL
npm run db:migrate

# Seed demo organizations, users, and memberships
npm run db:seed

# Inspect database in Drizzle Studio browser
npm run db:studio
```

---

## 4. Running the Backend

```bash
# Development mode with hot-reload (via tsx)
npm run dev

# Type check
npm run typecheck

# Build TypeScript to dist/
npm run build

# Start production build
npm run start
```

---

## 5. Running Tests

```bash
npm run test
```

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API service metadata |
| `GET` | `/api/v1/health` | Liveness probe (HTTP 200 when service is running) |
| `GET` | `/api/v1/health/ready` | Readiness probe (queries database `SELECT 1`, returns 200 or 503) |
