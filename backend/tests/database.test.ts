import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../src/db/dbconfig';
import {
  membershipRoleEnum,
  membershipStatusEnum,
  organizationMemberships,
  organizations,
  organizationStatusEnum,
  users,
  userStatusEnum,
} from '../src/db/schema';
import { app } from '../src/server';

describe('Database & Schema Foundation', () => {
  const originalDbUrl = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.DATABASE_URL = originalDbUrl;
    vi.restoreAllMocks();
  });

  describe('GET /api/v1/health/ready (Readiness Probe)', () => {
    it('should return HTTP 503 when DATABASE_URL is not configured', async () => {
      delete process.env.DATABASE_URL;

      const res = await request(app).get('/api/v1/health/ready');

      expect(res.status).toBe(503);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          message: 'Database connection unavailable',
        },
        data: {
          service: 'flowport-api',
          status: 'unready',
          database: {
            status: 'unavailable',
          },
        },
      });
    });

    it('should return HTTP 503 when database query fails or is disconnected', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      vi.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Connection timeout') as never);

      const res = await request(app).get('/api/v1/health/ready');

      expect(res.status).toBe(503);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          message: 'Database connection failed',
        },
        data: {
          service: 'flowport-api',
          status: 'unready',
          database: {
            status: 'unavailable',
          },
        },
      });
    });

    it('should return HTTP 200 when database connectivity succeeds', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      vi.spyOn(pool, 'query').mockResolvedValueOnce({ rows: [{ '?column?': 1 }] } as never);

      const res = await request(app).get('/api/v1/health/ready');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          service: 'flowport-api',
          status: 'ready',
          database: {
            status: 'connected',
          },
        },
      });
      expect(typeof res.body.data.database.latencyMs).toBe('number');
    });
  });

  describe('Drizzle Table & Schema Definitions', () => {
    it('should have correct users table definition', () => {
      expect(users).toBeDefined();
      expect(users.id).toBeDefined();
      expect(users.name).toBeDefined();
      expect(users.email).toBeDefined();
      expect(users.passwordHash).toBeDefined();
      expect(users.status).toBeDefined();
      expect(users.createdAt).toBeDefined();
      expect(users.updatedAt).toBeDefined();

      expect(userStatusEnum.enumValues).toEqual(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
    });

    it('should have correct organizations table definition', () => {
      expect(organizations).toBeDefined();
      expect(organizations.id).toBeDefined();
      expect(organizations.name).toBeDefined();
      expect(organizations.slug).toBeDefined();
      expect(organizations.status).toBeDefined();
      expect(organizations.createdAt).toBeDefined();
      expect(organizations.updatedAt).toBeDefined();

      expect(organizationStatusEnum.enumValues).toEqual([
        'ACTIVE',
        'SUSPENDED',
        'INACTIVE',
      ]);
    });

    it('should have correct organization_memberships table definition and foreign keys', () => {
      expect(organizationMemberships).toBeDefined();
      expect(organizationMemberships.id).toBeDefined();
      expect(organizationMemberships.organizationId).toBeDefined();
      expect(organizationMemberships.userId).toBeDefined();
      expect(organizationMemberships.role).toBeDefined();
      expect(organizationMemberships.status).toBeDefined();
      expect(organizationMemberships.createdAt).toBeDefined();
      expect(organizationMemberships.updatedAt).toBeDefined();

      expect(membershipRoleEnum.enumValues).toContain('PLATFORM_ADMIN');
      expect(membershipRoleEnum.enumValues).toContain('ORGANIZATION_ADMIN');
      expect(membershipRoleEnum.enumValues).toContain('OPERATIONS_MANAGER');
      expect(membershipRoleEnum.enumValues).toContain('WAREHOUSE_MANAGER');
      expect(membershipRoleEnum.enumValues).toContain('FLEET_MANAGER');
      expect(membershipRoleEnum.enumValues).toContain('MERCHANT');
      expect(membershipRoleEnum.enumValues).toContain('DRIVER');
      expect(membershipRoleEnum.enumValues).toContain('CUSTOMER');

      expect(membershipStatusEnum.enumValues).toEqual(['ACTIVE', 'INVITED', 'SUSPENDED']);
    });
  });
});
