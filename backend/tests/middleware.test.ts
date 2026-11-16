import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('Middleware & Error Handling', () => {
  describe('Not Found Handler', () => {
    it('should return HTTP 404 with standardized error response for unknown route', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint-404');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
        },
      });
      expect(res.body.error.message).toContain('Cannot GET /api/v1/unknown-endpoint-404');
      expect(res.headers).toHaveProperty('x-request-id');
    });

    it('should return 404 for unknown POST route', async () => {
      const res = await request(app)
        .post('/api/v1/nonexistent')
        .send({ test: 'data' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Request ID Middleware', () => {
    it('should preserve and reflect client-provided x-request-id', async () => {
      const clientReqId = 'custom-trace-id-12345';
      const res = await request(app)
        .get('/api/v1/health')
        .set('x-request-id', clientReqId);

      expect(res.headers['x-request-id']).toBe(clientReqId);
    });

    it('should generate a valid request ID when none is provided', async () => {
      const res = await request(app).get('/api/v1/health');

      const reqId = res.headers['x-request-id'];
      expect(typeof reqId).toBe('string');
      expect(reqId.length).toBeGreaterThan(0);
    });
  });

  describe('Security Headers (Helmet)', () => {
    it('should include standard security headers', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control', 'off');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow configured origin http://localhost:3000', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3000');

      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should expose x-request-id in CORS headers', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3000');

      expect(res.headers['access-control-expose-headers']).toContain('x-request-id');
    });
  });

  describe('Request Body & JSON Parsing', () => {
    it('should return HTTP 400 for malformed JSON request body', async () => {
      const res = await request(app)
        .post('/api/v1/health')
        .set('Content-Type', 'application/json')
        .send('{ "broken": json-invalid }');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          code: 'INVALID_JSON',
        },
      });
    });
  });
});
