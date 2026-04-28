import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Notification } from "../hooks/useNotifications";
import DefaultAvatar from "../avatar-placeholder.gif";
import SiteLogo from "../images/IMG-20231228-WA0004-removebg-preview.png";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClose?: () => void;
}

const NotificationItem = ({
  notification,
  onMarkRead,
  onRemove,
  onClose,
}: NotificationItemProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const { _id, type, actor, sketch, read, createdAt } = notification;

  let message: string;
  let avatar: string;
  // System notifications (welcome, future announcements...) get the site
  // logo on a dark circular background so they stand out visually.
  let isSystem = false;

  if (type === "welcome") {
    message = t("notifications.welcome");
    avatar = SiteLogo;
    isSystem = true;
  } else {
    const username = actor?.username || t("common.unknownUser");
    avatar = actor?.avatar || DefaultAvatar;

    if (type === "like") {
      message = t("notifications.likedYourSketch", { username });
    } else if (type === "comment") {
      message = t("notifications.commentedYourSketch", { username });
    } else {
      message = t("notifications.commentedSameSketch", { username });
    }
  }

  const timeAgo = formatRelativeTime(createdAt, i18n.language);

  const handleClick = () => {
    if (!read) onMarkRead(_id);

    if (type === "welcome") {
      navigate("/mysketchs", { state: { openUpload: true } });
    } else if (sketch?._id) {
      navigate(`/sketchdetail/${sketch._id}`);
    }
    onClose?.();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(_id);
  };

  const bgBase = read ? "transparent" : "rgba(255,204,0,0.07)";
  const bgHover = read ? "rgba(255,255,255,0.05)" : "rgba(255,204,0,0.13)";
  const isClickable = type === "welcome" || !!sketch?._id;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 0.8rem",
        backgroundColor: hovered ? bgHover : bgBase,
        borderLeft: read ? "3px solid transparent" : "3px solid #ffcc00",
        cursor: isClickable ? "pointer" : "default",
        transition: "background-color 0.15s",
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      <img
        src={avatar}
        alt=""
        style={{
          width: "2.4rem",
          height: "2.4rem",
          borderRadius: "50%",
          // For system messages, contain the logo so it's visible on its
          // dark circular background (cover would crop the logo).
          objectFit: isSystem ? "contain" : "cover",
          backgroundColor: isSystem ? "#0d0d0d" : "transparent",
          padding: isSystem ? "0.15rem" : 0,
          flexShrink: 0,
          // Yellow border on system notifs to mark them as "from the site"
          border: isSystem ? "2px solid #ffcc00" : "1.5px solid #333",
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: read ? "#bbb" : "#f0f0f0",
            lineHeight: 1.3,
          }}
        >
          {message}
        </p>
        <small style={{ color: "#777", fontSize: "0.7rem" }}>{timeAgo}</small>
      </div>

      {sketch?.url && (
        <img
          src={sketch.url}
          alt={sketch.name}
          style={{
            width: "2.4rem",
            height: "2.4rem",
            objectFit: "cover",
            borderRadius: "0.15rem",
            flexShrink: 0,
            border: "1.5px solid #333",
          }}
        />
      )}

      <button
        onClick={handleRemoveClick}
        title={t("notifications.remove")}
        style={{
          background: "none",
          border: "none",
          color: "#666",
          fontSize: "1.3rem",
          cursor: "pointer",
          padding: "0 0.25rem",
          lineHeight: 1,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ff3030")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
      >
        ×
      </button>
    </div>
  );
};

function formatRelativeTime(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const isEs = lang.startsWith("es");

  if (diffMin < 1) return isEs ? "ahora" : "now";
  if (diffMin < 60) return isEs ? `hace ${diffMin}m` : `${diffMin}m ago`;
  if (diffHr < 24) return isEs ? `hace ${diffHr}h` : `${diffHr}h ago`;
  if (diffDay < 7) return isEs ? `hace ${diffDay}d` : `${diffDay}d ago`;

  return date.toLocaleDateString(isEs ? "es-ES" : "en-US", {
    day: "2-digit",
    month: "short",
  });
}

export default NotificationItem;
