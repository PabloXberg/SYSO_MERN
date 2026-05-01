import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverURL } from "../serverURL";

interface UserStatsData {
  totalSketches: number;
  totalLikesReceived: number;
  totalCommentsReceived: number;
  totalLikesGiven: number;
  totalCommentsMade: number;
  battlesParticipated: number;
  battlesWonPopular: number;
  battlesWonJury: number;
}

interface Props {
  /** The user ID whose stats to fetch and display */
  userId: string;
}

/**
 * UserStats — displays aggregate stats for a user as a grid of badges.
 * Used inside UserModal (clicking on a user card from /users page).
 * Fetches /users/id/:id/stats — public endpoint, no auth needed.
 */
const UserStats = ({ userId }: Props) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${serverURL}users/id/${userId}/stats`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        console.error("UserStats fetch error:", err);
        if (!cancelled)
          setError(
            t("stats.error", "No se pudieron cargar las estadísticas")
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, t]);

  if (loading) {
    return (
      <div style={{ color: "#aaa", fontStyle: "italic", padding: "0.5rem" }}>
        {t("stats.loading", "Cargando estadísticas...")}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div
        style={{
          color: "#888",
          fontStyle: "italic",
          padding: "0.5rem",
          fontSize: "0.85rem",
        }}
      >
        {error || t("stats.unavailable", "Sin estadísticas disponibles")}
      </div>
    );
  }

  const statItems = [
    {
      icon: "🎨",
      value: stats.totalSketches,
      label: t("stats.sketches", "Sketches"),
      color: "#ffcc00",
    },
    {
      icon: "❤️",
      value: stats.totalLikesReceived,
      label: t("stats.likesReceived", "Likes recibidos"),
      color: "#ff3b3b",
    },
    {
      icon: "💬",
      value: stats.totalCommentsReceived,
      label: t("stats.commentsReceived", "Comentarios recibidos"),
      color: "#00aaff",
    },
    {
      icon: "⚔",
      value: stats.battlesParticipated,
      label: t("stats.battlesParticipated", "Battles"),
      color: "#ffcc00",
    },
    {
      icon: "❤️",
      value: stats.battlesWonPopular,
      label: t("stats.popularWins", "Popular wins"),
      color: "#39ff14",
      highlight: stats.battlesWonPopular > 0,
    },
    {
      icon: "🏆",
      value: stats.battlesWonJury,
      label: t("stats.juryWins", "Jury wins"),
      color: "#39ff14",
      highlight: stats.battlesWonJury > 0,
    },
  ];

  return (
    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <h5
        style={{
          fontFamily: "MiFuente2, MiFuente, cursive",
          color: "#ffcc00",
          fontSize: "1.1rem",
          letterSpacing: "0.05em",
          marginBottom: "0.75rem",
          textShadow: "1px 1px 0 rgba(0,0,0,0.7)",
        }}
      >
        📊 {t("stats.title", "Estadísticas")}
      </h5>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(7rem, 1fr))",
          gap: "0.6rem",
        }}
      >
        {statItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "0.6rem 0.4rem",
              backgroundColor: item.highlight ? "#0a3a1a" : "#1a1a1a",
              border: `2px solid ${item.color}`,
              borderRadius: "0.3rem",
              textAlign: "center",
              boxShadow: item.highlight
                ? `0 0 10px ${item.color}50`
                : "1px 1px 0 rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                fontSize: "1.4rem",
                lineHeight: 1,
                marginBottom: "0.2rem",
              }}
            >
              {item.icon}
            </div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: item.color,
                fontFamily: "MiFuente2, MiFuente, cursive",
                lineHeight: 1.1,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#aaa",
                marginTop: "0.15rem",
                lineHeight: 1.2,
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStats;
