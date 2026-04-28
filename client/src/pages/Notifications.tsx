import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import NotificationItem from "../components/NotificationItem";

const DoubleCheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <polyline points="2 12 7 17 14 8" />
    <polyline points="10 12 15 17 22 8" />
  </svg>
);

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [hoverMarkAll, setHoverMarkAll] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    remove,
  } = useNotifications(100);

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "1rem auto",
        padding: "0 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "2rem",
            fontFamily: "MiFuente2, MiFuente, cursive",
            color: "#ffcc00",
            letterSpacing: "0.04em",
            textShadow: "3px 3px 0 #000",
            transform: "rotate(-1.5deg)",
          }}
        >
          🔔 {t("notifications.title")}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            title={t("notifications.markAllRead")}
            aria-label={t("notifications.markAllRead")}
            onMouseEnter={() => setHoverMarkAll(true)}
            onMouseLeave={() => setHoverMarkAll(false)}
            style={{
              background: hoverMarkAll ? "rgba(0,229,255,0.15)" : "none",
              border: "2px solid #00e5ff",
              color: "#00e5ff",
              padding: "0.4rem 0.6rem",
              borderRadius: "0.2rem",
              cursor: "pointer",
              boxShadow: hoverMarkAll
                ? "0 0 8px rgba(0,229,255,0.5), 2px 2px 0 rgba(0,0,0,0.7)"
                : "2px 2px 0 rgba(0,0,0,0.7)",
              display: "inline-flex",
              alignItems: "center",
              gap: hoverMarkAll ? "0.4rem" : "0",
              transition: "gap 0.15s ease, background-color 0.15s ease",
              overflow: "hidden",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              maxWidth: hoverMarkAll ? "20rem" : "2.4rem",
              whiteSpace: "nowrap",
            }}
          >
            <DoubleCheckIcon />
            <span
              style={{
                opacity: hoverMarkAll ? 1 : 0,
                transition: "opacity 0.15s ease",
              }}
            >
              {t("notifications.markAllRead")}
            </span>
          </button>
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
          {t("common.loading")}
        </p>
      ) : notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            color: "#aaa",
            backgroundColor: "#1a1a1a",
            border: "2px solid #333",
            borderRadius: "0.3rem",
          }}
        >
          <p style={{ fontSize: "3rem", margin: 0 }}>🔔</p>
          <p style={{ marginTop: "0.5rem" }}>{t("notifications.empty")}</p>
          <Link
            to="/sketches"
            style={{
              color: "#00ff88",
              fontFamily: "MiFuente2, MiFuente, cursive",
              fontSize: "1.1rem",
              letterSpacing: "0.04em",
            }}
          >
            {t("notifications.goExplore")}
          </Link>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "2px solid #ffcc00",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.85)",
            overflow: "hidden",
          }}
        >
          {notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onMarkRead={markRead}
              onRemove={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
