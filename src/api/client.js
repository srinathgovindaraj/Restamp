/**
 * Minimal RESTAMP API client (Phase 2, discovery only).
 * Base URL from EXPO_PUBLIC_API_URL (LAN IP for Android, localhost for web/iOS sim).
 * fetch-based; no extra dependencies. No auth yet (public discovery endpoints need
 * none); an Authorization hook is reserved for the auth phase.
 */
const RAW_BASE_URL =
  (typeof process !== "undefined" && process.env && process.env.EXPO_PUBLIC_API_URL) || "";

export const API_BASE_URL = (RAW_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(kind, status, detail) {
    super(detail || kind);
    this.kind = kind;
    this.status = status;
  }
}

function mapStatus(status) {
  if (status === 401) return "login";
  if (status === 403) return "denied";
  if (status === 404) return "missing";
  if (status === 400 || status === 422) return "validation";
  return "retry";
}

export async function apiGet(path, params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  const url = `${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`;
  let response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new ApiError(
      "offline",
      0,
      "No connection. Make sure the backend is running and reachable."
    );
  }
  if (response.ok) return response.json();
  throw new ApiError(mapStatus(response.status), response.status, `Request failed (${response.status}).`);
}

export function isApiError(e, kind) {
  return e instanceof ApiError && (kind === undefined || e.kind === kind);
}
