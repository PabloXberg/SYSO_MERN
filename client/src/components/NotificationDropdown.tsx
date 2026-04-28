import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

/**
 * Notifications dropdown.
 *
 * THE ROOT FIX vs previous attempts:
 *   The bell lives inside the mobile navbar, which has
 *   `position: relative; z-index: 1050 !important`. That creates a
 *   stacking context that traps every descendant — even with z-index
 *   9999 and position:fixed, the dropdown could only sit above siblings
 *   inside the navbar, never above the SubNav rendered later in the tree.
 *
 *   Solution: render the mobile dropdown into document.body via a React
 *   portal. That way it lives at the top level of the DOM, outside any
 *   stacking context, and a simple z-index reliably wins.
 *
 * Desktop keeps the regular absolute positioning anchored to the bell.
 */
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!open) return null;
  const top = notifications.slice(0, TOP_N);

  // ──────────────────────────────────────────────────────────────────────
  // MOBILE — render via portal so the dropdown escapes the navbar's
  // stacking context. document.body is the highest possible parent.
  // ──────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return createPortal(
      <>
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 99998,
          }}
        />

        <div
          style={{
            position: "fixed",
            top: "3.5rem",
            left: "0.5rem",
            right: "0.5rem",
            maxHeight: "70vh",
            backgroundColor: "#1a1a1a",
            border: "2px solid #ffcc00",
            boxShadow:
              "4px 4px 0 rgba(0,0,0,0.85), 0 0 12px rgba(255,204,0,0.25)",
            zIndex: 99999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            color: "#f0f0f0",
          }}
        >
          <DropdownContent
            top={top}
            unreadCount={unreadCount}
            t={t}
            onMarkAllRead={onMarkAllRead}
            onMarkRead={onMarkRead}
            onRemove={onRemove}
            onClose={onClose}
            notificationsLength={notifications.length}
          />
        </div>
      </>,
      document.body
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // DESKTOP — standard absolute dropdown
  // ──────────────────────────────────────────────────────────────────────
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
        zIndex: 2000,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        color: "#f0f0f0",
      }}
    >
      <DropdownContent
        top={top}
        unreadCount={unreadCount}
        t={t}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={onMarkRead}
        onRemove={onRemove}
        onClose={onClose}
        notificationsLength={notifications.length}
      />
    </div>
  );
};

const DropdownContent = ({
  top,
  unreadCount,
  t,
  onMarkAllRead,
  onMarkRead,
  onRemove,
  onClose,
  notificationsLength,
}: any) => (
  <>
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
        top.map((n: Notification) => (
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

    {notificationsLength > 0 && (
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
  </>
);

export default NotificationDropdown;
