import { useCallback, useEffect, useState } from "react";

interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
}

interface UsePaginatedFetchResult<T> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook for paginated APIs that support ?page=X&limit=N&search=Y.
 *
 * - Loads the first page on mount.
 * - `loadMore()` appends the next page to the list.
 * - When `search` changes, the list resets and re-fetches from page 1,
 *   so the server filters across the WHOLE database (not just loaded items).
 * - `refetch()` resets and reloads (useful after creating/deleting).
 *
 * @param baseUrl  e.g. `${serverURL}sketches/all`
 * @param limit    Items per page
 * @param transform Function that takes the raw response and returns {items, hasMore}
 * @param search   Current search term (empty = no filter)
 */
export function usePaginatedFetch<T>(
  baseUrl: string,
  limit: number,
  transform: (raw: any) => PaginatedResponse<T>,
  search: string = ""
): UsePaginatedFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(
    async (pageToFetch: number, append: boolean, searchTerm: string) => {
      const isFirst = pageToFetch === 1 && !append;
      if (isFirst) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams({
          page: String(pageToFetch),
          limit: String(limit),
        });
        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }
        const url = `${baseUrl}?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = await response.json();
        const { items, hasMore: more } = transform(raw);

        setData((prev) => (append ? [...prev, ...items] : items));
        setHasMore(more);
        setError(null);
      } catch (err) {
        console.error("usePaginatedFetch error:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [baseUrl, limit, transform]
  );

  // Initial load + whenever search changes: reset and fetch page 1
  useEffect(() => {
    setPage(1);
    fetchPage(1, false, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, search]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next, true, search);
  }, [page, hasMore, loadingMore, fetchPage, search]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchPage(1, false, search);
  }, [fetchPage, search]);

  return { data, loading, loadingMore, hasMore, error, loadMore, refetch };
}
