import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { Notification } from "../hooks/useNotifications";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRemove: (id: string) => void;
}

const TOP_N = 5;

/**
 * Stencil-style double-check icon — used to "mark all as read".
 * Compact, icon-only with a tooltip via title attribute.
 */
const DoubleCheckIcon = () => (
  <svg
    width="16"
    height="16"
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

const NotificationDropdown = ({
  open,
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onRemove,
  onClose,
}: NotificationDropdownProps) => {
  const { t } = useTranslation();

  if (!open) return null;
  const top = notifications.slice(0, TOP_N);

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 0.6rem)",
        right: 0,
        width: "min(360px, calc(100vw - 1rem))",
        maxHeight: "min(60vh, 28rem)",
        backgroundColor: "#1a1a1a",
        border: "2px solid #ffcc00",
        boxShadow:
          "4px 4px 0 rgba(0,0,0,0.85), 0 0 12px rgba(255,204,0,0.25)",
        transform: "rotate(-0.3deg)",
        zIndex: 1500,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        color: "#f0f0f0",
      }}
    >
      {/* Header — graffiti title + tiny "mark all read" icon button */}
      <div
        style={{
          padding: "0.65rem 0.9rem",
          borderBottom: "2px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#0d0d0d",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "MiFuente2, MiFuente, cursive",
            fontSize: "1.4rem",
            color: "#ffcc00",
            letterSpacing: "0.04em",
            textShadow: "2px 2px 0 #000",
            transform: "rotate(-1deg)",
            display: "inline-block",
          }}
        >
          {t("notifications.title")}
        </span>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            // The title attribute creates a native browser tooltip on hover.
            title={t("notifications.markAllRead")}
            aria-label={t("notifications.markAllRead")}
            style={{
              background: "none",
              border: "1.5px solid #00e5ff",
              color: "#00e5ff",
              cursor: "pointer",
              padding: "0.25rem 0.4rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,229,255,0.15)";
              e.currentTarget.style.boxShadow = "0 0 6px rgba(0,229,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <DoubleCheckIcon />
          </button>
        )}
      </div>

      <div style={{ overflowY: "auto", flex: 1, backgroundColor: "#1a1a1a" }}>
        {top.length === 0 ? (
          <p
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "#888",
              fontSize: "0.85rem",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {t("notifications.empty")}
          </p>
        ) : (
          top.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onMarkRead={onMarkRead}
              onRemove={onRemove}
              onClose={onClose}
            />
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <Link
          to="/notifications"
          onClick={onClose}
          style={{
            display: "block",
            padding: "0.55rem 1rem",
            textAlign: "center",
            backgroundColor: "#0d0d0d",
            color: "#00ff88",
            textDecoration: "none",
            fontSize: "1rem",
            fontFamily: "MiFuente2, MiFuente, cursive",
            letterSpacing: "0.05em",
            borderTop: "2px solid #333",
            flexShrink: 0,
            textTransform: "uppercase",
          }}
        >
          {t("notifications.viewAll")} →
        </Link>
      )}
    </div>
  );
};

export default NotificationDropdown;
