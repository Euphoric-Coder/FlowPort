import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { closeDatabase, getDb } from './index';
import {
  organizationMemberships,
  organizations,
  users,
} from './schema';

dotenv.config();

export async function seedDatabase(): Promise<void> {
  if (env.NODE_ENV === 'production') {
    throw new Error('Seed script cannot be executed in production environment.');
  }

  const db = getDb();
  if (!db) {
    throw new Error(
      'Cannot seed database: DATABASE_URL is not configured or connection failed.'
    );
  }

  logger.info('Starting deterministic database seed...');

  // 1. Seed Organizations
  const seedOrgs = [
    {
      name: 'FlowPort Demo Logistics',
      slug: 'flowport-demo-logistics',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Northstar Distribution',
      slug: 'northstar-distribution',
      status: 'ACTIVE' as const,
    },
  ];

  const orgMap = new Map<string, string>();

  for (const orgData of seedOrgs) {
    const existing = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, orgData.slug))
      .limit(1);

    if (existing.length > 0) {
      orgMap.set(orgData.slug, existing[0].id);
      logger.info({ slug: orgData.slug }, 'Organization already exists, skipped insertion');
    } else {
      const inserted = await db
        .insert(organizations)
        .values(orgData)
        .returning({ id: organizations.id, slug: organizations.slug });
      orgMap.set(inserted[0].slug, inserted[0].id);
      logger.info({ slug: orgData.slug }, 'Inserted organization');
    }
  }

  // 2. Seed Users
  const seedUsers = [
    {
      name: 'Demo Admin',
      email: 'admin@example.com',
      passwordHash: null,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Demo Operations Manager',
      email: 'ops.manager@example.com',
      passwordHash: null,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Demo Warehouse Manager',
      email: 'warehouse.manager@example.com',
      passwordHash: null,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Demo Merchant',
      email: 'merchant@example.com',
      passwordHash: null,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Demo Driver',
      email: 'driver@example.com',
      passwordHash: null,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Demo Customer',
      email: 'customer@example.com',
      passwordHash: null,
      status: 'ACTIVE' as const,
    },
  ];

  const userMap = new Map<string, string>();

  for (const userData of seedUsers) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existing.length > 0) {
      userMap.set(userData.email, existing[0].id);
      logger.info({ email: userData.email }, 'User already exists, skipped insertion');
    } else {
      const inserted = await db
        .insert(users)
        .values(userData)
        .returning({ id: users.id, email: users.email });
      userMap.set(inserted[0].email, inserted[0].id);
      logger.info({ email: userData.email }, 'Inserted user');
    }
  }

  // 3. Seed Memberships
  const fpOrgId = orgMap.get('flowport-demo-logistics');
  const nsOrgId = orgMap.get('northstar-distribution');

  if (!fpOrgId || !nsOrgId) {
    throw new Error('Missing organization IDs for membership seeding.');
  }

  const seedMemberships = [
    {
      orgId: fpOrgId,
      userEmail: 'admin@example.com',
      role: 'ORGANIZATION_ADMIN' as const,
      status: 'ACTIVE' as const,
    },
    {
      orgId: fpOrgId,
      userEmail: 'ops.manager@example.com',
      role: 'OPERATIONS_MANAGER' as const,
      status: 'ACTIVE' as const,
    },
    {
      orgId: fpOrgId,
      userEmail: 'warehouse.manager@example.com',
      role: 'WAREHOUSE_MANAGER' as const,
      status: 'ACTIVE' as const,
    },
    {
      orgId: fpOrgId,
      userEmail: 'merchant@example.com',
      role: 'MERCHANT' as const,
      status: 'ACTIVE' as const,
    },
    {
      orgId: fpOrgId,
      userEmail: 'driver@example.com',
      role: 'DRIVER' as const,
      status: 'ACTIVE' as const,
    },
    {
      orgId: fpOrgId,
      userEmail: 'customer@example.com',
      role: 'CUSTOMER' as const,
      status: 'ACTIVE' as const,
    },
    {
      orgId: nsOrgId,
      userEmail: 'ops.manager@example.com',
      role: 'OPERATIONS_MANAGER' as const,
      status: 'ACTIVE' as const,
    },
  ];

  for (const m of seedMemberships) {
    const userId = userMap.get(m.userEmail);
    if (!userId) continue;

    // Composite unique check: user_id + organization_id
    const existing = await db
      .select()
      .from(organizationMemberships)
      .where(
        eq(organizationMemberships.userId, userId)
      )
      .limit(10);

    const alreadyMember = existing.some((row) => row.organizationId === m.orgId);

    if (alreadyMember) {
      logger.info(
        { userEmail: m.userEmail, role: m.role },
        'Membership already exists, skipped insertion'
      );
    } else {
      await db.insert(organizationMemberships).values({
        organizationId: m.orgId,
        userId,
        role: m.role,
        status: m.status,
      });
      logger.info(
        { userEmail: m.userEmail, role: m.role },
        'Inserted organization membership'
      );
    }
  }

  logger.info('Database seeding completed successfully.');
}

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await closeDatabase();
      process.exit(0);
    })
    .catch(async (err) => {
      // eslint-disable-next-line no-console
      console.error('Database seed error:', err);
      await closeDatabase();
      process.exit(1);
    });
}
