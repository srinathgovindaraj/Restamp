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
