import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

/**
 * Stencil-style bell — chunky outline, thick strokes, slightly rotated
 * for that spray-on-wall feel. The whole thing is monochrome SVG so it
 * picks up `currentColor` and matches the navbar text/badge.
 */
const StencilBell = ({ active }: { active: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    style={{
      transform: active ? "rotate(-8deg)" : "rotate(-2deg)",
      transition: "transform 0.2s ease",
      // Subtle drop shadow — like the chip stickers on the brick wall
      filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.6))",
    }}
  >
    {/* Bell body — slightly chunky / hand-drawn proportions */}
    <path d="M5 16 L5 11 C5 7.5 7.5 5 11 5 L13 5 C16.5 5 19 7.5 19 11 L19 16 L20.5 18 L3.5 18 Z" />
    {/* Tongue / clapper at the bottom */}
    <path d="M10 18 L10 20 C10 21.1 11 22 12 22 C13 22 14 21.1 14 20 L14 18" />
    {/* Top knob (the little bit on top) */}
    <path d="M11 5 L11 3.5 L13 3.5 L13 5" />
  </svg>
);

const NotificationBell = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    remove,
  } = useNotifications();

  // Click-outside-to-close handled at the wrapper level so the bell can
  // toggle itself when clicked again.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);
  const hasUnread = unreadCount > 0;

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title={t("notifications.title")}
        aria-label={t("notifications.title")}
        style={{
          background: open ? "rgba(255,204,0,0.15)" : "transparent",
          // Sharp graffiti-style border
          border: `2px solid ${hasUnread ? "#ffcc00" : "rgba(255,255,255,0.5)"}`,
          // Glow when there are unread notifs (spray-paint feel)
          boxShadow: hasUnread
            ? "0 0 6px rgba(255,204,0,0.4), 1px 1px 0 rgba(0,0,0,0.7)"
            : "1px 1px 0 rgba(0,0,0,0.5)",
          color: hasUnread ? "#ffcc00" : "white",
          padding: "0.25rem 0.45rem",
          borderRadius: "0.2rem",
          cursor: "pointer",
          position: "relative",
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        <StencilBell active={open} />
        {hasUnread && (
          <span
            style={{
              position: "absolute",
              top: "-0.4rem",
              right: "-0.4rem",
              backgroundColor: "#ff3030",
              color: "white",
              // Slight rotation on the badge — sticker vibe
              transform: "rotate(-5deg)",
              borderRadius: "0.2rem",
              fontSize: "0.65rem",
              fontWeight: 800,
              fontFamily: "MiFuente2, MiFuente, cursive",
              padding: "0.1rem 0.3rem",
              minWidth: "1.1rem",
              textAlign: "center",
              lineHeight: 1.2,
              border: "1.5px solid #000",
              boxShadow: "1px 1px 0 #000",
              letterSpacing: "0.05em",
            }}
          >
            {badgeText}
          </span>
        )}
      </button>

      <NotificationDropdown
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onRemove={remove}
      />
    </div>
  );
};

export default NotificationBell;
