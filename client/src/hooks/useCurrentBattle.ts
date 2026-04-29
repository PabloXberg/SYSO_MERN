import { useEffect, useState } from "react";
import { serverURL } from "../serverURL";

export interface CurrentBattle {
  _id: string;
  theme: string;
  state: "open" | "voting" | "finished";
  submissionDeadline: string;
  votingDeadline: string;
  description?: string;
  prizes?: string;
  judges?: string;
}

/**
 * Module-level cache. Multiple components (BattleBanner, SketchCard, MySketchs,
 * BattleAdmin previews...) all need the current battle, but we don't want N
 * parallel HTTP requests. Cache for 5 minutes; expose a refetch() to invalidate
 * when something the app does might change the answer (e.g. user adds/removes
 * a sketch from the battle).
 *
 * `cache === undefined` means "not fetched yet"
 * `cache === null`      means "fetched, no current battle exists"
 * `cache === Battle`    means "fetched, here it is"
 */
let cache: CurrentBattle | null | undefined = undefined;
let cacheTime = 0;
const TTL = 5 * 60 * 1000;

// Dedupe in-flight requests so simultaneous mounts share one promise.
let pendingPromise: Promise<CurrentBattle | null> | null = null;

const fetchCurrent = async (): Promise<CurrentBattle | null> => {
  if (pendingPromise) return pendingPromise;
  pendingPromise = (async () => {
    try {
      const res = await fetch(`${serverURL}battles/current`);
      const data = await res.json();
      cache = data || null;
      cacheTime = Date.now();
      return cache;
    } catch (err) {
      console.error("Failed to fetch current battle:", err);
      cache = null;
      cacheTime = Date.now();
      return null;
    } finally {
      pendingPromise = null;
    }
  })();
  return pendingPromise;
};

/**
 * Hook: returns { battle, loading, refetch }.
 * `battle` is the current open/voting/finished battle, or `null` if none.
 */
export const useCurrentBattle = () => {
  const [battle, setBattle] = useState<CurrentBattle | null | undefined>(cache);
  const [loading, setLoading] = useState(cache === undefined);

  useEffect(() => {
    const isStale = Date.now() - cacheTime > TTL;
    if (cache !== undefined && !isStale) {
      setBattle(cache);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCurrent().then((data) => {
      setBattle(data);
      setLoading(false);
    });
  }, []);

  const refetch = async () => {
    cache = undefined;
    cacheTime = 0;
    setLoading(true);
    const data = await fetchCurrent();
    setBattle(data);
    setLoading(false);
  };

  return { battle, loading, refetch };
};
