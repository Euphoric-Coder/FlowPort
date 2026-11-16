import { pgEnum, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { users } from './users';

export const membershipRoleEnum = pgEnum('membership_role', [
  'PLATFORM_ADMIN',
  'ORGANIZATION_ADMIN',
  'OPERATIONS_MANAGER',
  'WAREHOUSE_MANAGER',
  'FLEET_MANAGER',
  'MERCHANT',
  'DRIVER',
  'CUSTOMER',
]);

export const membershipStatusEnum = pgEnum('membership_status', [
  'ACTIVE',
  'INVITED',
  'SUSPENDED',
]);

export const organizationMemberships = pgTable(
  'organization_memberships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: membershipRoleEnum('role').notNull(),
    status: membershipStatusEnum('status').default('ACTIVE').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userOrgUnique: unique('uq_memberships_user_org').on(table.userId, table.organizationId),
  })
);

export type OrganizationMembership = typeof organizationMemberships.$inferSelect;
export type NewOrganizationMembership = typeof organizationMemberships.$inferInsert;
export type MembershipRole = (typeof membershipRoleEnum.enumValues)[number];
export type MembershipStatus = (typeof membershipStatusEnum.enumValues)[number];
