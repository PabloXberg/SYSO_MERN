import { useCallback, useEffect, useRef, useState } from "react";
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

  // Search is passed to the hook — server filters across the WHOLE database,
  // not just already-loaded items. The hook auto-resets when search changes.
  const { data, loading, loadingMore, hasMore, loadMore, refetch } =
    usePaginatedFetch<Sketch>(
      `${serverURL}sketches/all`,
      PAGE_SIZE,
      (raw: any) => {
        if (Array.isArray(raw)) {
          return { items: raw, hasMore: false };
        }
        return {
          items: raw?.sketches || [],
          hasMore: raw?.pagination?.hasMore ?? false,
        };
      },
      search
    );

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMore();
      }
    },
    [hasMore, loadingMore, loadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "200px",
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

      {loading && data.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          {search ? "Buscando..." : "Cargando bocetos..."}
        </p>
      ) : data.length === 0 && search ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          No se encontraron bocetos para "{search}"
        </p>
      ) : (
        <>
          <div className="masonry-grid">
            {data.map((sketch) => (
              <div key={sketch._id} className="masonry-item">
                <SketchCard props={sketch} onUpdate={refetch} />
              </div>
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: "1px" }} />

          {loadingMore && (
            <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
              Cargando más bocetos...
            </p>
          )}

          {!hasMore && data.length > 0 && (
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
