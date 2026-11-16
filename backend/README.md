# FlowPort — Backend Architecture & Database Foundation (Version 1.0)

This directory contains the dedicated Node.js + Express + TypeScript backend, Drizzle ORM layer, and Neon PostgreSQL database foundation for **FlowPort**.

---

## 1. Architecture Overview

```
backend/
  src/
    app.ts                   # Express application setup & middleware composition
    server.ts                # HTTP bootstrap, pool warmup & graceful shutdown

    config/
      env.ts                 # Strict Zod environment schema & validation
      cors.ts                # CORS allowlist configuration
      logger.ts              # Structured Pino logging with sensitive field redaction

    db/
      index.ts               # Connection pooling (node-postgres), Drizzle client & health query
      schema/                # Drizzle PostgreSQL schema definitions
        users.ts             # users table & user_status enum
        organizations.ts     # organizations table & organization_status enum
        memberships.ts       # organization_memberships & membership_role/status enums
        index.ts             # Schema index & entity type exports
      relations.ts           # Drizzle relations definitions
      migrate.ts             # Migration runner script using drizzle-orm/migrator
      seed.ts                # Deterministic & idempotent database seeder

    modules/
      health/                # Health check module
        health.controller.ts # Liveness & readiness probe handlers
        health.routes.ts     # /health & /health/ready route definitions
        health.service.ts    # Liveness metadata & database connectivity evaluation

    middleware/
      errorHandler.ts        # Centralized error handler with standardized JSON output
      notFound.ts            # Catch-all 404 handler
      requestLogger.ts       # Request ID generation (UUID) and pino-http request logger

    lib/
      errors/
        AppError.ts          # Operational error hierarchy (AppError, NotFound, BadRequest, etc.)

    utils/
      asyncHandler.ts        # Safe asynchronous Express route wrapper

    docs/
      openapi.ts             # OpenAPI 3.0 specification definition

    types/
      index.ts               # Shared API response interfaces (ApiSuccessResponse, ApiErrorResponse)

  drizzle/
    0000_brave_warstar.sql   # Initial version-controlled SQL migration
    meta/
      _journal.json          # Drizzle migration journal

  tests/
    health.test.ts           # Liveness probe, root & OpenAPI doc tests
    middleware.test.ts       # 404 handler, request IDs, CORS, Helmet & JSON parsing tests
    database.test.ts         # Readiness probe & Drizzle schema structural tests

  drizzle.config.ts          # Drizzle Kit migration configuration
  vitest.config.ts           # Vitest configuration for automated tests
  .env.example               # Template environment configuration
  package.json               # Backend dependencies & npm scripts
  tsconfig.json              # Strict TypeScript compiler options
```

---

## 2. Technology Stack

- **Runtime**: Node.js 18+ (tested on Node v20)
- **Framework**: Express 4.x
- **Language**: TypeScript 5.x (strict mode)
- **Database**: Neon PostgreSQL (Managed Serverless Postgres)
- **ORM**: Drizzle ORM (`drizzle-orm/node-postgres`)
- **Database Driver**: `pg` (bounded `Pool` with strict TLS)
- **Migrations & Studio**: Drizzle Kit
- **Validation**: Zod 3.x
- **Logging**: Pino & Pino-HTTP (with automatic redaction)
- **Security**: Helmet & CORS allowlist
- **Documentation**: Swagger UI & OpenAPI 3.0 (`swagger-ui-express`)
- **Testing**: Vitest & Supertest

---

## 3. Neon PostgreSQL Account & Setup

FlowPort Version 1.0 connects to managed PostgreSQL hosted on [Neon](https://neon.tech).

### Step-by-Step Neon Setup:

1. Create or log in to your account at [neon.tech](https://neon.tech).
2. Create a new project: `flowport`.
3. Choose your preferred cloud region (e.g., `us-east-2`, `eu-central-1`).
4. In the Neon Console dashboard, navigate to **Dashboard** -> **Connection Details**.
5. Neon provides two connection modes:
   - **Pooled connection string** (ends with `-pooler` hostname, uses PgBouncer on port 5432).
     Use this for `DATABASE_URL` (application runtime).
   - **Direct connection string** (standard hostname without `-pooler`).
     Use this for `DIRECT_DATABASE_URL` (schema migrations and Drizzle Kit).
6. Note: Ensure `sslmode=require` is present in both connection strings.
7. Recommended: In Neon, create a separate branch for testing (`test`) and development (`main`/`dev`) to avoid running tests against development data.

---

## 4. Environment Configuration

Copy the example configuration to `.env`:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Neon connection strings:

```ini
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

# CORS: Comma-separated list of allowed origins (frontend Next.js dev server runs on 3000)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Application Runtime (Pooled Neon connection)
DATABASE_URL=postgresql://USER:PASSWORD@ep-sample-pooler.region.neon.tech/flowport?sslmode=require

# Migration Runner (Direct Neon connection)
DIRECT_DATABASE_URL=postgresql://USER:PASSWORD@ep-sample.region.neon.tech/flowport?sslmode=require
```

> **Security Notice**: Never commit `.env` or paste real database credentials into version control.

---

## 5. Drizzle Schema & Migrations

### Initial Schema (Version 1.0 Foundation):

1. **`users`**
   - `id`: UUID (Primary Key, `gen_random_uuid()`)
   - `name`: `varchar(150)`, NOT NULL
   - `email`: `varchar(255)`, UNIQUE, NOT NULL
   - `password_hash`: `text`, NULLABLE (authentication not implemented in v1.0)
   - `status`: ENUM (`ACTIVE`, `INACTIVE`, `SUSPENDED`), DEFAULT `'ACTIVE'`
   - `created_at`: `timestamp with time zone`, DEFAULT `now()`
   - `updated_at`: `timestamp with time zone`, DEFAULT `now()`

2. **`organizations`**
   - `id`: UUID (Primary Key, `gen_random_uuid()`)
   - `name`: `varchar(200)`, NOT NULL
   - `slug`: `varchar(150)`, UNIQUE, NOT NULL
   - `status`: ENUM (`ACTIVE`, `SUSPENDED`, `INACTIVE`), DEFAULT `'ACTIVE'`
   - `created_at`: `timestamp with time zone`, DEFAULT `now()`
   - `updated_at`: `timestamp with time zone`, DEFAULT `now()`

3. **`organization_memberships`**
   - `id`: UUID (Primary Key, `gen_random_uuid()`)
   - `organization_id`: UUID, Foreign Key -> `organizations.id` (ON DELETE CASCADE)
   - `user_id`: UUID, Foreign Key -> `users.id` (ON DELETE CASCADE)
   - `role`: ENUM (`PLATFORM_ADMIN`, `ORGANIZATION_ADMIN`, `OPERATIONS_MANAGER`, `WAREHOUSE_MANAGER`, `FLEET_MANAGER`, `MERCHANT`, `DRIVER`, `CUSTOMER`)
   - `status`: ENUM (`ACTIVE`, `INVITED`, `SUSPENDED`), DEFAULT `'ACTIVE'`
   - `created_at`: `timestamp with time zone`, DEFAULT `now()`
   - `updated_at`: `timestamp with time zone`, DEFAULT `now()`
   - **Constraint**: `UNIQUE("user_id", "organization_id")`

### Migration Commands:

```bash
# Generate new SQL migration from schema diff
npm run db:generate

# Apply pending SQL migrations to Neon
npm run db:migrate

# Inspect schema and data using Drizzle Studio GUI
npm run db:studio

# Check schema consistency
npm run db:check
```

---

## 6. Deterministic Database Seeding

Run the idempotent database seeder:

```bash
npm run db:seed
```

Seeds:
- **Organizations**:
  - `FlowPort Demo Logistics` (`flowport-demo-logistics`)
  - `Northstar Distribution` (`northstar-distribution`)
- **Users**:
  - `Demo Admin` (`admin@example.com`)
  - `Demo Operations Manager` (`ops.manager@example.com`)
  - `Demo Warehouse Manager` (`warehouse.manager@example.com`)
  - `Demo Merchant` (`merchant@example.com`)
  - `Demo Driver` (`driver@example.com`)
  - `Demo Customer` (`customer@example.com`)
- **Memberships**:
  - Valid relational assignments connecting each demo user to organizations.
  - Idempotent: Can be run repeatedly without duplicating records or throwing constraint errors.

---

## 7. Running the Backend

```bash
# Development mode with hot-reloading (via tsx)
npm run dev

# Type check
npm run typecheck

# Production build (transpiles to dist/)
npm run build

# Start production build
npm run start
```

Default addresses:
- **API Base URL**: `http://localhost:5000/api/v1`
- **Liveness Probe**: `http://localhost:5000/api/v1/health`
- **Readiness Probe**: `http://localhost:5000/api/v1/health/ready`
- **Interactive Swagger UI**: `http://localhost:5000/api/docs`
- **OpenAPI 3.0 JSON Spec**: `http://localhost:5000/api/docs.json`

---

## 8. Automated Testing

The test suite uses Vitest and Supertest:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
- **Liveness Probe**: Confirms HTTP 200, valid JSON envelope, service name, status, and uptime.
- **Readiness Probe**: Confirms HTTP 200 when database connection succeeds and HTTP 503 when disconnected or unconfigured.
- **Request IDs**: Confirms UUID generation and client header reflection.
- **Middleware**: Confirms 404 handler, CORS allowlist, Helmet security headers, and malformed JSON error handling.
- **Drizzle Schema Structure**: Validates table column types, nullability, enums, composite unique constraints, and foreign keys.

---

## 9. Troubleshooting Database Connections

| Issue | Cause | Solution |
|---|---|---|
| `DATABASE_URL is not configured` | Missing `.env` | Copy `.env.example` to `.env` and provide your Neon connection string. |
| `ETIMEDOUT` / `ENOTFOUND` | Hostname error | Verify your Neon database endpoint hostname in the connection string. |
| `SSL/TLS connection error` | Missing SSL flag | Neon requires encrypted connections. Ensure `?sslmode=require` is appended to the connection string. |
| Max connection limit exceeded | Using direct URL in app runtime | Neon serverless compute has connection limits. Use the **pooled** connection URL (`-pooler` hostname) for `DATABASE_URL`. |

---

## 10. Scope & Known Limitations (Version 1.0)

As per the technical roadmap, Version 1.0 is strictly the backend and database foundation:
- **Authentication**: No login endpoints or JWTs are active in v1.0. (Assigned to Version 2.0).
- **Logistics Business Logic**: Warehouse, shipment, inventory, and order CRUD APIs will be introduced in subsequent versions.
- **Frontend**: The existing Next.js frontend continues to use its deterministic mock service layer. A typed client (`lib/api-client.ts`) is configured to connect to the backend via `NEXT_PUBLIC_API_URL`.
- **AI/ML**: No hosted AI wrappers (OpenAI, Gemini, Claude) are included. All future AI capabilities will be custom in-house models.
