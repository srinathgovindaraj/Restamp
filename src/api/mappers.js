/**
 * Backend card -> legacy UI property shape (Phase 2).
 * Every key below is either authoritative backend data or an explicit,
 * documented UI fallback (rating/furnishing-style fields stay mock-only).
 */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop";

const CONSTRUCTION_LABELS = {
  READY_TO_MOVE: "Ready to move",
  UNDER_CONSTRUCTION: "Under Construction",
  NEW_LAUNCH: "New Launch",
};

function titleCaseType(t) {
  if (!t) return "Apartment";
  const lower = String(t).toLowerCase();
  if (lower === "house") return "House";
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function toUiProperty(card) {
  const areaNum = card.area_value ?? undefined;
  return {
    id: card.listing_id,
    title: card.title,
    price: card.price_display,
    pricePeriod: "",
    rawPrice: Math.round(card.price_paise / 100),
    rating: undefined, // mock-only in UI (shows 4.9 fallback); no backend rating exists
    location: card.location_label,
    address: card.address_line || card.location_label,
    beds: card.bedrooms ?? undefined,
    baths: card.bathrooms ?? undefined,
    sqft: areaNum != null ? areaNum.toLocaleString("en-IN") : undefined,
    isVerified: true, // server guarantees VERIFIED
    constructionStatus: CONSTRUCTION_LABELS[card.construction_status] || undefined,
    image: card.cover_image_url || FALLBACK_IMAGE,
    description: card.description || undefined,
    type: titleCaseType(card.property_type),
    transactionType: card.transaction_type,
    backendId: card.listing_id,
  };
}

// UI filter state -> GET /buyer/listings query params. Returns plain object.
// Rupee budgets (preset and/or numeric, Infinity allowed) are merged then converted
// to paise: effective floor = max of the two, effective ceiling = min of the two.
export function buildListingParams(ui, page, pageSize) {
  const params = { page, page_size: pageSize };
  const dealMap = {
    Buy: "BUY",
    Resale: "RESALE",
    Rent: "RENT",
    Lease: "LEASE",
    BUY: "BUY",
    RESALE: "RESALE",
    RENT: "RENT",
    LEASE: "LEASE",
  };
  const dealVal = ui.dealTab || ui.dealType;
  if (dealVal && dealMap[dealVal]) params.deal = dealMap[dealVal];

  const typeMap = {
    Apartment: "APARTMENT",
    Villa: "VILLA",
    House: "HOUSE",
    Commercial: "COMMERCIAL",
    Plot: "PLOT",
    Home: "HOUSE",
    APARTMENT: "APARTMENT",
    VILLA: "VILLA",
    HOUSE: "HOUSE",
    COMMERCIAL: "COMMERCIAL",
    PLOT: "PLOT",
  };
  const typeVal = ui.selectedType || ui.propertyType;
  if (typeVal && typeVal !== "All Types" && typeMap[typeVal]) {
    params.property_type = typeMap[typeVal];
  }
  if (ui.searchQuery && ui.searchQuery.trim()) {
    // Backend searches title/description/locality; locality-only chips also map here.
    params.q = ui.searchQuery.trim();
  } else if (ui.locality) {
    params.locality = ui.locality;
  }
  if (ui.bhk === "4+ BHK") params.bedrooms_min = 4;
  else if (ui.bhk && ui.bhk !== "All BHK") {
    const n = parseInt(ui.bhk, 10);
    if (!Number.isNaN(n)) params.bedrooms = n;
  }
  // UI budgets are rupees; API takes paise.
  const lo = Math.max(ui.presetMinRupees || 0, ui.minRupees || 0, ui.budgetMin || 0);
  const rawHi = Math.min(
    ui.presetMaxRupees == null ? Infinity : ui.presetMaxRupees,
    ui.maxRupees == null ? Infinity : ui.maxRupees,
    ui.budgetMax == null ? Infinity : ui.budgetMax
  );
  if (lo > 0) params.min_price_paise = Math.round(lo * 100);
  if (rawHi < Infinity) params.max_price_paise = Math.round(rawHi * 100);
  const sortMap = {
    relevance: "relevance",
    price_asc: "price_asc",
    price_desc: "price_desc",
    area_desc: "area_desc",
    rating: "relevance",
  };
  params.sort = sortMap[ui.sort] || "relevance";
  return params;
}

export const __testables = { titleCaseType, CONSTRUCTION_LABELS, FALLBACK_IMAGE };
