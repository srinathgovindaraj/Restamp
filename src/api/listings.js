/**
 * Detail helper (Phase 3). Single-record fetch mapped onto the UI shape.
 * Gallery comes from the backend; all other fields reuse toUiProperty.
 */
import { apiGet } from "./client";
import { toUiProperty } from "./mappers";

export async function fetchListingDetail(listingId) {
  const data = await apiGet(`/buyer/listings/${listingId}`);
  const ui = toUiProperty(data);
  return { ...ui, gallery: Array.isArray(data.gallery) ? data.gallery : [] };
}

/**
 * Similar properties (Phase 4). Returns UI-shaped cards (max 5, deterministic
 * backend order) or null when the source has no numeric backend id (mock flows).
 * Callers keep existing mock fallback on null/error/empty per their own UI rules.
 */
export async function fetchSimilar(listingId, limit = 5) {
  if (typeof listingId !== "number") return null;
  const data = await apiGet(`/buyer/listings/${listingId}/similar`, { limit });
  if (!Array.isArray(data)) return [];
  return data.map(toUiProperty);
}
