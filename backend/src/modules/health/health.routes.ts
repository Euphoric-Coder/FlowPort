import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { HealthController } from './health.controller';

const healthRouter = Router();

healthRouter.get('/', HealthController.getLiveness);
healthRouter.get('/ready', asyncHandler(HealthController.getReadiness));

export { healthRouter };
