/**
 * CityRide API Configuration
 *
 * In production (Vercel): VITE_API_BASE_URL is empty, so all /api/* calls
 * go to Vercel Serverless Functions automatically (same domain).
 *
 * In local development: VITE_API_BASE_URL = http://localhost:5000
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Build a full API URL from a path.
 * e.g. apiUrl('/api/buses') → 'http://localhost:5000/api/buses' (local)
 *                           → '/api/buses' (Vercel production)
 */
export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

/**
 * WebSocket URL for live bus telemetry (local dev only).
 * Vercel does not support persistent WebSocket connections;
 * the app falls back to the in-browser demo simulator on Vercel.
 */
export const WS_URL = import.meta.env.VITE_WS_URL || '';
