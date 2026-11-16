import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../lib/errors/AppError';
import { ApiErrorResponse } from '../types';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId =
    (req.headers['x-request-id'] as string) ||
    (res.getHeader('x-request-id') as string) ||
    undefined;

  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected server error occurred';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = err.flatten();
  } else if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Malformed JSON in request body';
  } else {
    logger.error(
      {
        err,
        requestId,
        url: req.originalUrl,
        method: req.method,
      },
      'Unhandled internal error'
    );
  }

  // Sanitize message in production for internal 500 errors
  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
    details = undefined;
  }

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    ...(requestId ? { requestId } : {}),
  };

  res.status(statusCode).json(response);
};
