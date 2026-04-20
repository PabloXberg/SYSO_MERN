import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../index.css";
import SketchCard from "../components/SketchCard";
import SubHomeNav from "../components/SubHomeNav";
import SearchBar from "../components/SearchBar";
import { serverURL } from "../serverURL";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { Sketch } from "../@types/models";

const PAGE_SIZE = 20;

const SketchesPage = () => {
  const [search, setSearch] = useState("");

  const { data, loading, loadingMore, hasMore, loadMore, refetch } =
    usePaginatedFetch<Sketch>(
      `${serverURL}sketches/all`,
      PAGE_SIZE,
      // Handle both old (array) and new (paginated object) backends
      (raw: any) => {
        if (Array.isArray(raw)) {
          return { items: raw, hasMore: false };
        }
        return {
          items: raw?.sketches || [],
          hasMore: raw?.pagination?.hasMore ?? false,
        };
      }
    );

  // Filter by search. When searching, we filter what's already loaded.
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase().trim();
    return data.filter((sketch) => {
      const name = sketch.name?.toLowerCase() || "";
      const comment = sketch.comment?.toLowerCase() || "";
      const ownerName = sketch.owner?.username?.toLowerCase() || "";
      return (
        name.includes(q) || comment.includes(q) || ownerName.includes(q)
      );
    });
  }, [data, search]);

  // Infinite scroll: auto-load more when user nears the bottom.
  // We use IntersectionObserver on a sentinel div at the end of the list.
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const first = entries[0];
      // Don't auto-load while user is actively searching (they see filtered results)
      if (first.isIntersecting && hasMore && !loadingMore && !search) {
        loadMore();
      }
    },
    [hasMore, loadingMore, loadMore, search]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "200px", // start loading 200px before the sentinel enters view
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div>
      <SubHomeNav />

      <SearchBar
        placeholder="Buscar bocetos por nombre, descripción o autor..."
        onSearch={setSearch}
      />

      {search && (
        <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
          {filtered.length === 0
            ? "No se encontraron bocetos (en los ya cargados)"
            : `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}`}
        </p>
      )}

      {loading && data.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>Cargando bocetos...</p>
      ) : (
        <>
          <div className="masonry-grid">
            {filtered.map((sketch) => (
              <div key={sketch._id} className="masonry-item">
                <SketchCard props={sketch} onUpdate={refetch} />
              </div>
            ))}
          </div>

          {/* Sentinel for auto-loading + manual "Load more" fallback */}
          <div ref={sentinelRef} style={{ height: "1px" }} />

          {loadingMore && (
            <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
              Cargando más bocetos...
            </p>
          )}

          {/* Show end-of-list message only when we're done AND not searching */}
          {!hasMore && !search && data.length > 0 && (
            <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              — Has visto todos los bocetos ({data.length}) —
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SketchesPage;
