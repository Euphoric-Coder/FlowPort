import { checkDatabaseConnection } from '../../db';

export interface LivenessData {
  service: string;
  status: 'ok';
  version: string;
  timestamp: string;
  uptimeSeconds: number;
}

export interface ReadinessData {
  service: string;
  status: 'ready' | 'unready';
  version: string;
  timestamp: string;
  database: {
    status: 'connected' | 'unavailable';
    latencyMs?: number;
    error?: string;
  };
}

export class HealthService {
  public static getLiveness(): LivenessData {
    return {
      service: 'flowport-api',
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  public static async getReadiness(): Promise<{
    isReady: boolean;
    data: ReadinessData;
  }> {
    const dbCheck = await checkDatabaseConnection();

    const data: ReadinessData = {
      service: 'flowport-api',
      status: dbCheck.connected ? 'ready' : 'unready',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        status: dbCheck.connected ? 'connected' : 'unavailable',
        ...(dbCheck.latencyMs !== undefined ? { latencyMs: dbCheck.latencyMs } : {}),
        ...(dbCheck.error ? { error: dbCheck.error } : {}),
      },
    };

    return {
      isReady: dbCheck.connected,
      data,
    };
  }
}
