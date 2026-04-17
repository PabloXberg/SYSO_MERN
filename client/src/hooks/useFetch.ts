import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Re-runs the fetch. Useful after creating/updating/deleting. */
  refetch: () => Promise<void>;
}

/**
 * Generic hook for GET requests that return JSON.
 *
 * - Auto-fetches on mount and whenever `url` changes.
 * - Pass `null` as URL to skip fetching (useful when waiting for user id, etc).
 * - `transform` lets you reshape the response before setting state
 *   (e.g. unwrap `.users` or call `.reverse()`).
 * - Returned `refetch` replaces the `window.location.reload()` pattern:
 *   after mutating data, just call refetch() and the list updates without
 *   a full page reload (keeping SPA behavior).
 *
 * Usage:
 *   const { data: sketches, refetch } = useFetch<Sketch[]>(
 *     `${serverURL}sketches/all`,
 *     (raw) => raw.reverse()
 *   );
 */
export function useFetch<T>(
  url: string | null,
  transform?: (raw: any) => T
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);
  const [error, setError] = useState<Error | null>(null);

  // Keep `transform` in a ref so callers don't have to memoize it.
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const raw = await response.json();
      const t = transformRef.current;
      setData(t ? t(raw) : (raw as T));
    } catch (err) {
      console.error("useFetch error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
