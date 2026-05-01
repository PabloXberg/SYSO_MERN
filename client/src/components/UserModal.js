import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import UserStats from "./UserStats";

/**
 * UserModal — shows a user's profile in a modal.
 *
 * Accepts the user data in TWO formats for backwards compatibility:
 *   1. props.userData      → direct user object (from /users page)
 *   2. props.character     → a sketch object whose .owner is the user
 *                            (legacy path from when this was opened from
 *                             SketchCard / sketch detail)
 *
 * Whichever is provided, we end up with a `user` object containing
 * username, avatar, info, createdAt, and _id.
 *
 * The dark theme styles are inline because the .userModal CSS class in
 * index.css uses light backgrounds — overriding inline keeps changes
 * contained without touching the global CSS.
 */
function UserModal(props) {
  const { t } = useTranslation();

  if (!props.show) return null;

  // Accept either shape — pick whichever was passed in.
  const user = props.userData || props.character?.owner;
  if (!user) return null;

  const datum = user.createdAt?.substring(0, 10) || "";
  const partesFecha = datum.split("-");
  const fechaTransformada =
    partesFecha.length === 3
      ? `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`
      : t("common.unknownDate");

  const avatarSrc =
    user.avatar ||
    "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

  const handleBackdropClick = () => props.onClose();
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        onClick={stopPropagation}
        style={{
          maxWidth: "32rem",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#1a1a1a",
          border: "2px solid #ffcc00",
          borderRadius: "0.4rem",
          boxShadow:
            "5px 5px 0 rgba(0,0,0,0.85), 0 0 20px rgba(255,204,0,0.25)",
          color: "#f0f0f0",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* HEADER — username in graffiti font */}
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontFamily: "MiFuente2, MiFuente, cursive",
            fontSize: "2rem",
            color: "#ffcc00",
            letterSpacing: "0.04em",
            textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
            wordBreak: "break-word",
          }}
        >
          {user.username || "?"}
        </h2>

        {/* AVATAR */}
        <img
          src={avatarSrc}
          alt={user.username || "user avatar"}
          style={{
            width: "10rem",
            height: "10rem",
            borderRadius: "50%",
            objectFit: "cover",
            alignSelf: "center",
            border: "3px solid #ffcc00",
            backgroundColor: "#0d0d0d",
            boxShadow: "0 0 12px rgba(255,204,0,0.25)",
          }}
        />

        {/* INFO BLOCK */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid #333",
          }}
        >
          <div>
            <strong style={{ color: "#ffcc00" }}>
              {t("users.personalInfo")}:
            </strong>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: user.info ? "#ddd" : "#888",
                fontStyle: user.info ? "normal" : "italic",
              }}
            >
              {user.info || t("users.noInfo")}
            </p>
          </div>

          <div>
            <strong style={{ color: "#ffcc00" }}>
              {t("users.registeredOn")}:
            </strong>{" "}
            <span style={{ color: "#ddd" }}>{fechaTransformada}</span>
          </div>
        </div>

        {/* STATS GRID — fetched live from /users/id/:id/stats */}
        {user._id && <UserStats userId={user._id} />}

        {/* FOOTER */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "0.5rem",
            borderTop: "1px solid #333",
          }}
        >
          <Button
            variant="warning"
            onClick={props.onClose}
            style={{
              fontFamily: "MiFuente2, MiFuente, cursive",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {t("auth.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
