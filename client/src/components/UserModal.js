import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import UserStats from "./UserStats";

/**
 * UserModal — compact, responsive, dark-themed user profile modal.
 *
 * Accepts user data in two formats for compatibility:
 *   1. props.userData      → direct user object (from /users page)
 *   2. props.character     → a sketch whose .owner is the user (legacy)
 *
 * Mobile behavior: uses an `isMobile` state hook to apply tighter padding
 * and smaller avatar sizes on narrow viewports (< 600px). Inline styles
 * make the responsive behavior self-contained — no CSS changes needed.
 */
function UserModal(props) {
  const { t } = useTranslation();

  // Track viewport width so we can render mobile-friendly sizes.
  // Updates on resize so flipping orientation keeps the modal sized correctly.
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 600
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!props.show) return null;

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

  // Responsive sizing — tighter everything on mobile
  const padding = isMobile ? "0.9rem" : "1.5rem";
  const gap = isMobile ? "0.7rem" : "1rem";
  const avatarSize = isMobile ? "6rem" : "10rem";
  const titleSize = isMobile ? "1.5rem" : "2rem";
  const maxWidth = isMobile ? "calc(100vw - 1rem)" : "32rem";

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
        padding: isMobile ? "0.5rem" : "1rem",
        overflowY: "auto",
      }}
    >
      <div
        onClick={stopPropagation}
        style={{
          maxWidth,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#1a1a1a",
          border: "2px solid #ffcc00",
          borderRadius: "0.4rem",
          boxShadow:
            "5px 5px 0 rgba(0,0,0,0.85), 0 0 20px rgba(255,204,0,0.25)",
          color: "#f0f0f0",
          padding,
          display: "flex",
          flexDirection: "column",
          gap,
        }}
      >
        {/* USERNAME */}
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontFamily: "MiFuente2, MiFuente, cursive",
            fontSize: titleSize,
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
            width: avatarSize,
            height: avatarSize,
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
            gap: "0.4rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid #333",
            fontSize: isMobile ? "0.85rem" : "1rem",
          }}
        >
          <div>
            <strong style={{ color: "#ffcc00" }}>
              {t("users.personalInfo")}:
            </strong>
            <p
              style={{
                margin: "0.2rem 0 0",
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

        {/* STATS GRID */}
        {user._id && <UserStats userId={user._id} />}

        {/* FOOTER */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "0.4rem",
            borderTop: "1px solid #333",
          }}
        >
          <Button
            variant="warning"
            size={isMobile ? "sm" : undefined}
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
