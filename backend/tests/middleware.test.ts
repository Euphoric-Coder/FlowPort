import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/server';

describe('Middleware & Error Handling', () => {
  describe('Not Found Handler', () => {
    it('should return HTTP 404 for unknown route', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint-404');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        error: {
          message: 'Route not found',
        },
      });
    });

    it('should return 404 for unknown POST route', async () => {
      const res = await request(app)
        .post('/api/v1/nonexistent')
        .send({ test: 'data' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        error: {
          message: 'Route not found',
        },
      });
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
  });

  describe('Request Body & JSON Parsing', () => {
    it('should return HTTP 400 for malformed JSON request body', async () => {
      const res = await request(app)
        .post('/api/v1/health')
        .set('Content-Type', 'application/json')
        .send('{ "broken": json-invalid }');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('message');
    });
  });
});
