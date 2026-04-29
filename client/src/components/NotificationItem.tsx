import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Notification } from "../hooks/useNotifications";

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

/**
 * Single row in the notifications dropdown / page.
 *
 * Handles all notification types:
 *   - like / comment / comment_reply / welcome  → existing flow
 *   - battle_voting / battle_finished           → links to /actualbattle
 *   - battle_winner_popular / battle_winner_jury → "win" styling (green accent)
 */
const NotificationItem = ({
  notification,
  onMarkRead,
  onRemove,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  // Fallback name when the actor user has been deleted or is missing.
  // Uses i18n so it's localized — add `"common.someone"` to your locales
  // if not present (es: "alguien", en: "someone").
  const actorName =
    notification.actor?.username || t("common.someone", "alguien");
  const battleTheme = notification.battle?.theme || "";

  /**
   * Map notification type → translated message.
   * Battle messages use {{theme}} interpolation; like/comment use {{username}}.
   */
  const getMessage = (): string => {
    switch (notification.type) {
      case "welcome":
        return t("notifications.welcome");
      case "like":
        return t("notifications.likedYourSketch", { username: actorName });
      case "comment":
        return t("notifications.commentedYourSketch", { username: actorName });
      case "comment_reply":
        return t("notifications.commentedSameSketch", { username: actorName });
      case "battle_voting":
        return t("notifications.battleVotingStarted", { theme: battleTheme });
      case "battle_finished":
        return t("notifications.battleFinished", { theme: battleTheme });
      case "battle_winner_popular":
        return t("notifications.battleWinnerPopular", { theme: battleTheme });
      case "battle_winner_jury":
        return t("notifications.battleWinnerJury", { theme: battleTheme });
      default:
        return "";
    }
  };

  /**
   * Where clicking the notification takes you.
   *   - battle_*  → /actualbattle (the live battle page)
   *   - welcome   → /mysketchs (with state to auto-open the upload modal)
   *   - rest      → /sketchdetail/{id} (the sketch the action happened on)
   */
  const getLink = (): { to: string; state?: any } => {
    if (notification.type?.startsWith("battle_")) {
      return { to: "/actualbattle" };
    }
    if (notification.type === "welcome") {
      return { to: "/mysketchs", state: { openUpload: true } };
    }
    if (notification.sketch?._id) {
      return { to: `/sketchdetail/${notification.sketch._id}` };
    }
    return { to: "/sketches" };
  };

  // Battle wins get a brighter accent (green) on the unread bar
  const isWinNotification =
    notification.type === "battle_winner_popular" ||
    notification.type === "battle_winner_jury";

  const accent = isWinNotification ? "#39ff14" : "#ffcc00";

  const handleClick = () => {
    if (!notification.read) onMarkRead(notification._id);
    onClose();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(notification._id);
  };

  const link = getLink();

  return (
    <Link
      to={link.to}
      state={link.state}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.65rem 0.9rem",
        borderBottom: "1px solid #2a2a2a",
        textDecoration: "none",
        color: "#f0f0f0",
        backgroundColor: notification.read ? "transparent" : "#222",
        borderLeft: notification.read
          ? "3px solid transparent"
          : `3px solid ${accent}`,
        position: "relative",
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Avatar — actor for like/comment, sketch thumb for battle, fallback emoji */}
      {notification.actor?.avatar && (
        <img
          src={notification.actor.avatar}
          alt=""
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      )}
      {!notification.actor && notification.sketch?.url && (
        <img
          src={notification.sketch.url}
          alt=""
          style={{
            width: "2.5rem",
            height: "2.5rem",
            objectFit: "cover",
            flexShrink: 0,
            border: `1px solid ${accent}`,
          }}
        />
      )}
      {!notification.actor && !notification.sketch?.url && (
        <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>
          {isWinNotification ? "🏆" : "⚔"}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.3,
            color: "#f0f0f0",
            wordBreak: "break-word",
          }}
        >
          {getMessage()}
        </div>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#888",
            marginTop: "0.2rem",
          }}
        >
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>

      <button
        onClick={handleRemove}
        title={t("notifications.remove")}
        aria-label={t("notifications.remove")}
        style={{
          background: "none",
          border: "none",
          color: "#666",
          cursor: "pointer",
          padding: "0.2rem 0.4rem",
          fontSize: "1rem",
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </Link>
  );
};

export default NotificationItem;
