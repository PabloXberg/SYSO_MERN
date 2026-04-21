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
 * Hook for paginated APIs that support ?page=X&limit=N&search=Y&tag=Z.
 *
 * When `search` or `tag` change, the list resets and re-fetches from page 1,
 * so the server filters across the WHOLE database (not just loaded items).
 */
export function usePaginatedFetch<T>(
  baseUrl: string,
  limit: number,
  transform: (raw: any) => PaginatedResponse<T>,
  search: string = "",
  tag: string = ""
): UsePaginatedFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(
    async (
      pageToFetch: number,
      append: boolean,
      searchTerm: string,
      tagTerm: string
    ) => {
      const isFirst = pageToFetch === 1 && !append;
      if (isFirst) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams({
          page: String(pageToFetch),
          limit: String(limit),
        });
        if (searchTerm.trim()) params.append("search", searchTerm.trim());
        if (tagTerm.trim()) params.append("tag", tagTerm.trim());

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

  // Initial load + whenever search/tag change
  useEffect(() => {
    setPage(1);
    fetchPage(1, false, search, tag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, search, tag]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next, true, search, tag);
  }, [page, hasMore, loadingMore, fetchPage, search, tag]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchPage(1, false, search, tag);
  }, [fetchPage, search, tag]);

  return { data, loading, loadingMore, hasMore, error, loadMore, refetch };
}
