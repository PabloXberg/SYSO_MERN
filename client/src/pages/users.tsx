import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../index.css";
import SubHomeNav from "../components/SubHomeNav";
import UserCard from "../components/UserCard";
import SearchBar from "../components/SearchBar";
import { serverURL } from "../serverURL";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { User } from "../@types/models";

const PAGE_SIZE = 20;

const UsersPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data, loading, loadingMore, hasMore, loadMore } =
    usePaginatedFetch<User>(
      `${serverURL}users/all`,
      PAGE_SIZE,
      (raw: any) => ({
        items: raw?.users || [],
        hasMore: raw?.pagination?.hasMore ?? false,
      }),
      search
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

  return (
    <div>
      <SubHomeNav />

      <SearchBar
        placeholder={t("users.searchPlaceholder")}
        onSearch={setSearch}
      />

      {loading && data.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          {search ? t("users.searching") : t("users.loading")}
        </p>
      ) : data.length === 0 && search ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          {t("users.noResults", { query: search })}
        </p>
      ) : (
        <>
          <div className="cardcontainer">
            {data.map((user) => (
              <UserCard key={user._id} props={user} />
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: "1px" }} />

          {loadingMore && (
            <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
              {t("users.loadingMore")}
            </p>
          )}

          {!hasMore && data.length > 0 && (
            <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              {t("users.allLoaded", { count: data.length })}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
