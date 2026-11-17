import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db, pool } from './dbconfig';
import { organizationMemberships, organizations, users } from './schema';

export async function seed(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Skipping seed in production environment.');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not configured.');
    return;
  }

  console.log('Seeding FlowPort database...');

  // 1. Seed Organizations
  const seedOrgs = [
    { name: 'FlowPort Demo Logistics', slug: 'flowport-demo-logistics' },
    { name: 'Northstar Distribution', slug: 'northstar-distribution' },
  ];

  const orgMap = new Map<string, string>();
  for (const org of seedOrgs) {
    const existing = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, org.slug))
      .limit(1);

    if (existing.length > 0) {
      orgMap.set(org.slug, existing[0].id);
    } else {
      const [inserted] = await db.insert(organizations).values(org).returning({ id: organizations.id });
      orgMap.set(org.slug, inserted.id);
    }
  }

  // 2. Seed Users
  const seedUsers = [
    { name: 'Demo Admin', email: 'admin@example.com' },
    { name: 'Demo Operations Manager', email: 'ops.manager@example.com' },
    { name: 'Demo Warehouse Manager', email: 'warehouse.manager@example.com' },
    { name: 'Demo Merchant', email: 'merchant@example.com' },
    { name: 'Demo Driver', email: 'driver@example.com' },
    { name: 'Demo Customer', email: 'customer@example.com' },
  ];

  const userMap = new Map<string, string>();
  for (const user of seedUsers) {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    if (existing.length > 0) {
      userMap.set(user.email, existing[0].id);
    } else {
      const [inserted] = await db.insert(users).values(user).returning({ id: users.id });
      userMap.set(user.email, inserted.id);
    }
  }

  // 3. Seed Memberships
  const fpOrgId = orgMap.get('flowport-demo-logistics')!;
  const nsOrgId = orgMap.get('northstar-distribution')!;

  const memberships = [
    { orgId: fpOrgId, email: 'admin@example.com', role: 'ORGANIZATION_ADMIN' as const },
    { orgId: fpOrgId, email: 'ops.manager@example.com', role: 'OPERATIONS_MANAGER' as const },
    { orgId: fpOrgId, email: 'warehouse.manager@example.com', role: 'WAREHOUSE_MANAGER' as const },
    { orgId: fpOrgId, email: 'merchant@example.com', role: 'MERCHANT' as const },
    { orgId: fpOrgId, email: 'driver@example.com', role: 'DRIVER' as const },
    { orgId: fpOrgId, email: 'customer@example.com', role: 'CUSTOMER' as const },
    { orgId: nsOrgId, email: 'ops.manager@example.com', role: 'OPERATIONS_MANAGER' as const },
  ];

  for (const m of memberships) {
    const userId = userMap.get(m.email);
    if (!userId) continue;

    const existing = await db
      .select({ id: organizationMemberships.id })
      .from(organizationMemberships)
      .where(eq(organizationMemberships.userId, userId));

    const alreadyExists = existing.length > 0;
    if (!alreadyExists) {
      await db.insert(organizationMemberships).values({
        organizationId: m.orgId,
        userId,
        role: m.role,
        status: 'ACTIVE',
      });
    }
  }

  console.log('Seeding completed successfully.');
}

if (require.main === module) {
  seed()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seed error:', err);
      await pool.end();
      process.exit(1);
    });
}
