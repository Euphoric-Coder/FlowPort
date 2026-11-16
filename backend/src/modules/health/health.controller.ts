import { Request, Response } from 'express';
import { HealthService } from './health.service';

export class HealthController {
  public static getLiveness(_req: Request, res: Response): void {
    const data = HealthService.getLiveness();
    res.status(200).json({
      success: true,
      data,
    });
  }

  public static async getReadiness(_req: Request, res: Response): Promise<void> {
    const { isReady, data } = await HealthService.getReadiness();

    if (!isReady) {
      res.status(503).json({
        success: false,
        error: {
          code: 'DATABASE_UNAVAILABLE',
          message: 'PostgreSQL database is currently unavailable or disconnected',
        },
        data,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  }
}
