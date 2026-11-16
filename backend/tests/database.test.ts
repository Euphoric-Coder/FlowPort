import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../src/app';
import * as dbModule from '../src/db';
import {
  membershipRoleEnum,
  membershipStatusEnum,
  organizationMemberships,
  organizations,
  organizationStatusEnum,
  users,
  userStatusEnum,
} from '../src/db/schema';

describe('Database & Schema Foundation', () => {
  describe('GET /api/v1/health/ready (Readiness Probe)', () => {
    it('should return HTTP 503 when database is disconnected or unconfigured', async () => {
      // Mock database check returning disconnected
      vi.spyOn(dbModule, 'checkDatabaseConnection').mockResolvedValueOnce({
        connected: false,
        error: 'DATABASE_URL is not configured',
      });

      const res = await request(app).get('/api/v1/health/ready');

      expect(res.status).toBe(503);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          code: 'DATABASE_UNAVAILABLE',
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
      vi.spyOn(dbModule, 'checkDatabaseConnection').mockResolvedValueOnce({
        connected: true,
        latencyMs: 12.4,
      });

      const res = await request(app).get('/api/v1/health/ready');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          service: 'flowport-api',
          status: 'ready',
          database: {
            status: 'connected',
            latencyMs: 12.4,
          },
        },
      });
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
