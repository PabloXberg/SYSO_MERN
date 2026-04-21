import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../index.css";
import SketchCard from "../components/SketchCard";
import SubHomeNav from "../components/SubHomeNav";
import SearchBar from "../components/SearchBar";
import TagChip from "../components/TagChip";
import { TAG_OPTIONS } from "../constants/tags";
import { serverURL } from "../serverURL";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { Sketch } from "../@types/models";

const PAGE_SIZE = 20;

const SketchesPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");

  const { data, loading, loadingMore, hasMore, loadMore, refetch } =
    usePaginatedFetch<Sketch>(
      `${serverURL}sketches/all`,
      PAGE_SIZE,
      (raw: any) => {
        if (Array.isArray(raw)) return { items: raw, hasMore: false };
        return {
          items: raw?.sketches || [],
          hasMore: raw?.pagination?.hasMore ?? false,
        };
      },
      search,
      tag
    );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
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

  const toggleTag = (value: string) => {
    setTag((current) => (current === value ? "" : value));
  };

  return (
    <div>
      <SubHomeNav />

      <SearchBar
        placeholder={t("sketches.searchPlaceholder")}
        onSearch={setSearch}
      />

      {/* Tag filter bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.4rem",
          padding: "0 1rem 1rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {TAG_OPTIONS.map((opt) => (
          <TagChip
            key={opt.value}
            tag={opt.value}
            size="md"
            active={tag === opt.value}
            onClick={() => toggleTag(opt.value)}
          />
        ))}
      </div>

      {loading && data.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          {search || tag ? t("sketches.searching") : t("sketches.loading")}
        </p>
      ) : data.length === 0 && (search || tag) ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          {t("sketches.noResults", { query: search || t(`tags.${tag}`) })}
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
              {t("sketches.loadingMore")}
            </p>
          )}

          {!hasMore && data.length > 0 && (
            <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              {t("sketches.allLoaded", { count: data.length })}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SketchesPage;
