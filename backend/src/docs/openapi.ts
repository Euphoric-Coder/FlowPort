export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'FlowPort Logistics API',
    version: '1.0.0',
    description:
      'Backend REST API and Database Foundation for FlowPort Intelligent Logistics Platform.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Root',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Service liveness and database readiness probes',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Liveness probe',
        description:
          'Returns HTTP 200 when the FlowPort backend Node.js process is active and running. Does not depend on database status.',
        responses: {
          '200': {
            description: 'Service is alive and healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        service: { type: 'string', example: 'flowport-api' },
                        status: { type: 'string', example: 'ok' },
                        version: { type: 'string', example: '1.0.0' },
                        timestamp: {
                          type: 'string',
                          format: 'date-time',
                          example: '2026-11-17T00:00:00.000Z',
                        },
                        uptimeSeconds: { type: 'integer', example: 120 },
                      },
                      required: ['service', 'status', 'version'],
                    },
                  },
                  required: ['success', 'data'],
                },
              },
            },
          },
        },
      },
    },
    '/health/ready': {
      get: {
        tags: ['Health'],
        summary: 'Readiness probe',
        description:
          'Executes an active connectivity test against Neon PostgreSQL. Returns HTTP 200 when connected, or HTTP 503 if unreachable.',
        responses: {
          '200': {
            description: 'Service and database are ready',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        service: { type: 'string', example: 'flowport-api' },
                        status: { type: 'string', example: 'ready' },
                        version: { type: 'string', example: '1.0.0' },
                        timestamp: { type: 'string', format: 'date-time' },
                        database: {
                          type: 'object',
                          properties: {
                            status: { type: 'string', example: 'connected' },
                            latencyMs: { type: 'number', example: 14.5 },
                          },
                          required: ['status'],
                        },
                      },
                      required: ['service', 'status', 'version', 'database'],
                    },
                  },
                  required: ['success', 'data'],
                },
              },
            },
          },
          '503': {
            description: 'Database connection failed or unavailable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', example: 'DATABASE_UNAVAILABLE' },
                        message: {
                          type: 'string',
                          example:
                            'PostgreSQL database is currently unavailable or disconnected',
                        },
                      },
                      required: ['code', 'message'],
                    },
                    data: {
                      type: 'object',
                      properties: {
                        service: { type: 'string', example: 'flowport-api' },
                        status: { type: 'string', example: 'unready' },
                        version: { type: 'string', example: '1.0.0' },
                        database: {
                          type: 'object',
                          properties: {
                            status: { type: 'string', example: 'unavailable' },
                            error: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                  required: ['success', 'error'],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: 'Resource not found' },
              details: { type: 'object' },
            },
            required: ['code', 'message'],
          },
          requestId: { type: 'string', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538' },
        },
        required: ['success', 'error'],
      },
    },
  },
};
