import { useCallback, useEffect, useRef, useState } from "react";
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
        hasMore: raw?.pagination?.hasMore ?? false,
      }),
      search
    );

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
        placeholder="Buscar usuarios por nombre o información..."
        onSearch={setSearch}
      />

      {loading && data.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          {search ? "Buscando..." : "Cargando usuarios..."}
        </p>
      ) : data.length === 0 && search ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          No se encontraron usuarios para "{search}"
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
              Cargando más usuarios...
            </p>
          )}

          {!hasMore && data.length > 0 && (
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
