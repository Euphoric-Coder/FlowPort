/**
 * FlowPort Typed API Client Configuration - Version 1.0 Foundation
 * Prepares the frontend for future backend integrations while preserving
 * all existing client-side mock workflows.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface HealthStatus {
  service: string;
  status: 'ok';
  version: string;
  timestamp: string;
  uptimeSeconds: number;
}

export interface ReadinessStatus {
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

/**
 * Reusable generic API fetcher with typed responses and error handling.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiSuccessResponse<T>> {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorResponse;
    const error = new Error(errorBody.error?.message || 'API request failed');
    (error as Error & { code?: string; status?: number; details?: unknown }).code =
      errorBody.error?.code;
    (error as Error & { code?: string; status?: number; details?: unknown }).status =
      response.status;
    (error as Error & { code?: string; status?: number; details?: unknown }).details =
      errorBody.error?.details;
    throw error;
  }

  return body as ApiSuccessResponse<T>;
}

/**
 * Check backend liveness probe.
 */
export async function checkBackendHealth(): Promise<HealthStatus> {
  const res = await apiFetch<HealthStatus>('/api/v1/health');
  return res.data;
}

/**
 * Check backend readiness probe (including Neon PostgreSQL connectivity).
 */
export async function checkBackendReadiness(): Promise<ReadinessStatus> {
  const res = await apiFetch<ReadinessStatus>('/api/v1/health/ready');
  return res.data;
}
