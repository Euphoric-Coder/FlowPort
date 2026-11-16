import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('Health & Documentation Endpoints', () => {
  describe('GET /api/v1/health (Liveness)', () => {
    it('should return HTTP 200 with service status ok', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toMatchObject({
        service: 'flowport-api',
        status: 'ok',
        version: '1.0.0',
      });
      expect(res.body.data).toHaveProperty('timestamp');
      expect(typeof res.body.data.uptimeSeconds).toBe('number');
    });

    it('should return x-request-id in response headers', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.headers).toHaveProperty('x-request-id');
      expect(typeof res.headers['x-request-id']).toBe('string');
      expect(res.headers['x-request-id'].length).toBeGreaterThan(0);
    });
  });

  describe('GET / (Root)', () => {
    it('should return HTTP 200 with API service metadata', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        service: 'flowport-api',
        version: '1.0.0',
        docs: '/api/docs',
        health: '/api/v1/health',
      });
    });
  });

  describe('GET /api/docs.json (OpenAPI Specification)', () => {
    it('should return the OpenAPI 3.0 specification', async () => {
      const res = await request(app).get('/api/docs.json');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('openapi', '3.0.3');
      expect(res.body.info).toMatchObject({
        title: 'FlowPort Logistics API',
        version: '1.0.0',
      });
      expect(res.body.paths).toHaveProperty('/health');
      expect(res.body.paths).toHaveProperty('/health/ready');
    });
  });

  describe('GET /api/docs (Swagger UI)', () => {
    it('should serve Swagger UI documentation or redirect', async () => {
      const res = await request(app).get('/api/docs/');

      expect([200, 301, 302]).toContain(res.status);
    });
  });
});
