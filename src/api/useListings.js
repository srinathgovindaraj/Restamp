/**
 * useListings hook (Phase 2): paginated GET /buyer/listings bound to UI filter state.
 * Returns { items, total, page, loading, loadingMore, error, loadMore, refresh }.
 * Category pseudo-filters (Pool/Townhouse) and rating sort have no backend
 * equivalent and are applied client-side by the caller where needed.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet } from "./client";
import { buildListingParams, toUiProperty } from "./mappers";

export function useListings(uiFilters, { pageSize = 20 } = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const reqId = useRef(0);
  const filtersKey = JSON.stringify({ ...uiFilters, pageSize });

  const fetchPage = useCallback(
    async (pageToLoad, append) => {
      const myReq = ++reqId.current;
      if (pageToLoad === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      try {
        const params = buildListingParams(JSON.parse(filtersKey), pageToLoad, pageSize);
        // Category pseudo-types without backend meaning stay client-side.
        const data = await apiGet("/buyer/listings", params);
        if (reqId.current !== myReq) return; // stale response
        const mapped = (data.items || []).map(toUiProperty);
        setItems((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotal(typeof data.total === "number" ? data.total : mapped.length);
        setPage(pageToLoad);
      } catch (e) {
        if (reqId.current !== myReq) return;
        setError(e);
      } finally {
        if (reqId.current === myReq) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [filtersKey, pageSize]
  );

  useEffect(() => {
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && !error && items.length < total) {
      fetchPage(page + 1, true);
    }
  }, [loading, loadingMore, error, items.length, total, page, fetchPage]);

  const refresh = useCallback(() => fetchPage(1, false), [fetchPage]);

  return { items, total, page, loading, loadingMore, error, loadMore, refresh };
}
