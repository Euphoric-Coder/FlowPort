import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/server';

describe('Health & Liveness Endpoints', () => {
  describe('GET /api/v1/health (Liveness)', () => {
    it('should return HTTP 200 with service status ok', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toMatchObject({
        service: 'flowport-api',
        status: 'ok',
        version: '1.1.0',
      });
      expect(typeof res.body.data.uptime).toBe('number');
    });
  });

  describe('GET / (Root)', () => {
    it('should return HTTP 200 with API service metadata', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        service: 'flowport-api',
        version: '1.1.0',
        health: '/api/v1/health',
      });
    });
  });
});
