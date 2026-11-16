import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../lib/errors/AppError';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};
