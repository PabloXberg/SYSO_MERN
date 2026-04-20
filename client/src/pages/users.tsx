import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../index.css";
import SubHomeNav from "../components/SubHomeNav";
import UserCard from "../components/UserCard";
import SearchBar from "../components/SearchBar";
import { serverURL } from "../serverURL";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { User } from "../@types/models";

const PAGE_SIZE = 20;

const UsersPage = () => {
  const [search, setSearch] = useState("");

  const { data, loading, loadingMore, hasMore, loadMore } =
    usePaginatedFetch<User>(
      `${serverURL}users/all`,
      PAGE_SIZE,
      (raw: any) => ({
        items: raw?.users || [],
        // If backend doesn't send pagination (old version), assume no more
        hasMore: raw?.pagination?.hasMore ?? false,
      })
    );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase().trim();
    return data.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const info = user.info?.toLowerCase() || "";
      return username.includes(q) || info.includes(q);
    });
  }, [data, search]);

  // Infinite scroll via IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const first = entries[0];
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
      rootMargin: "200px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div>
      <SubHomeNav />

      <SearchBar
        placeholder="Buscar usuarios por nombre o información..."
        onSearch={setSearch}
      />

      {search && (
        <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
          {filtered.length === 0
            ? "No se encontraron usuarios (en los ya cargados)"
            : `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}`}
        </p>
      )}

      {loading && data.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Cargando usuarios...
        </p>
      ) : (
        <>
          <div className="cardcontainer">
            {filtered.map((user) => (
              <UserCard key={user._id} props={user} />
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: "1px" }} />

          {loadingMore && (
            <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
              Cargando más usuarios...
            </p>
          )}

          {!hasMore && !search && data.length > 0 && (
            <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              — Has visto todos los usuarios ({data.length}) —
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
