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
 * Hook for paginated APIs that support ?page=X&limit=N.
 *
 * - Loads the first page on mount.
 * - `loadMore()` appends the next page to the existing list.
 * - `refetch()` resets and reloads from page 1 (useful after creating/deleting).
 *
 * @param baseUrl   e.g. `${serverURL}sketches/all`
 * @param limit     Items per page (default 20)
 * @param transform Function that takes the raw response and returns {items, hasMore}
 */
export function usePaginatedFetch<T>(
  baseUrl: string,
  limit: number,
  transform: (raw: any) => PaginatedResponse<T>
): UsePaginatedFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(
    async (pageToFetch: number, append: boolean) => {
      const isFirst = pageToFetch === 1 && !append;
      if (isFirst) setLoading(true);
      else setLoadingMore(true);

      try {
        const url = `${baseUrl}?page=${pageToFetch}&limit=${limit}`;
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

  // Initial load
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next, true);
  }, [page, hasMore, loadingMore, fetchPage]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchPage(1, false);
  }, [fetchPage]);

  return { data, loading, loadingMore, hasMore, error, loadMore, refetch };
}
