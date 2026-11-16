import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const existingId = req.headers['x-request-id'];
  const requestId = (typeof existingId === 'string' && existingId) || randomUUID();

  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);

  return pinoHttp({
    logger,
    genReqId: () => requestId,
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} ${res.statusCode} - ${err.message}`,
  })(req, res, next);
};
