import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultImage from "../avatar-placeholder.gif";
import SketchModal from "./SketchModal";
import UserModal from "./UserModal";
import { AuthContext } from "../contexts/AuthContext";

const AVATAR_PLACEHOLDER =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

/**
 * User card — dark theme, full-card click opens the user detail modal
 * with stats. The "X sketches uploaded" pill is now a separate button
 * that opens the SketchModal directly without going through UserModal.
 *
 * Click flow:
 *   - Click anywhere on the card (except the pill) → UserModal with stats
 *   - Click the green pill (when logged in + has sketches) → SketchModal
 *
 * The pill uses stopPropagation() so it doesn't trigger UserModal as well.
 */
function UserCard(props: any) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  const userData = props.props;
  const datum =
    userData.createdAt?.substring(0, 10) || t("common.unknownDate");

  const avatarFinal =
    userData.avatar === "" || userData.avatar === AVATAR_PLACEHOLDER
      ? DefaultImage
      : userData.avatar;

  const sketchCount = userData.sketchs?.length || 0;
  const canOpenSketchesModal = sketchCount > 0 && !!user;

  const openUserModal = () => setShowUserModal(true);
  const openSketchesModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSketchModal(true);
  };

  return (
    <div className="usercard">
      <div
        onClick={openUserModal}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "18rem",
          backgroundColor: "#1a1a1a",
          border: "2px solid #ffcc00",
          borderRadius: "0.4rem",
          padding: "1.25rem",
          color: "#f0f0f0",
          boxShadow: hovered
            ? "5px 5px 0 rgba(0,0,0,0.7), 0 0 18px rgba(255,204,0,0.3)"
            : "3px 3px 0 rgba(0,0,0,0.6)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          cursor: "pointer",
          // Mobile defenses (avoid double-tap zoom on the card click)
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
      >
        <img
          src={avatarFinal}
          alt={userData.username || "user"}
          style={{
            width: "8rem",
            height: "8rem",
            borderRadius: "50%",
            objectFit: "cover",
            alignSelf: "center",
            border: "3px solid #ffcc00",
            backgroundColor: "#0d0d0d",
            boxShadow: "0 0 12px rgba(255,204,0,0.25)",
            pointerEvents: "none",
          }}
        />

        <h3
          style={{
            margin: 0,
            textAlign: "center",
            fontFamily: "MiFuente2, MiFuente, cursive",
            fontSize: "1.5rem",
            color: "#ffcc00",
            letterSpacing: "0.04em",
            textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
            wordBreak: "break-word",
            pointerEvents: "none",
          }}
        >
          {userData.username || t("auth.username")}
        </h3>

        <p
          style={{
            margin: 0,
            textAlign: "center",
            color: userData.info ? "#ddd" : "#777",
            fontStyle: userData.info ? "normal" : "italic",
            fontSize: "0.9rem",
            minHeight: "2.5rem",
            wordBreak: "break-word",
            lineHeight: 1.4,
            pointerEvents: "none",
          }}
        >
          {userData.info || t("users.noInfo")}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
            paddingTop: "0.85rem",
            borderTop: "1px solid #333",
          }}
        >
          {/* Sketches pill — only this small element handles its own click */}
          <div
            onClick={canOpenSketchesModal ? openSketchesModal : undefined}
            style={{
              alignSelf: "center",
              padding: "0.35rem 0.85rem",
              backgroundColor: sketchCount > 0 ? "#0a3a1a" : "#222",
              color: sketchCount > 0 ? "#39ff14" : "#888",
              border: `2px solid ${sketchCount > 0 ? "#39ff14" : "#444"}`,
              borderRadius: "0.3rem",
              fontSize: "0.85rem",
              fontFamily: "MiFuente2, MiFuente, cursive",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: canOpenSketchesModal ? "pointer" : "default",
              userSelect: "none",
              transition: "background-color 0.15s ease",
            }}
            title={
              canOpenSketchesModal
                ? t("users.sketchesUploaded", { count: sketchCount })
                : undefined
            }
          >
            {t("users.sketchesUploaded", { count: sketchCount })}
          </div>

          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "0.75rem",
              fontStyle: "italic",
              pointerEvents: "none",
            }}
          >
            {t("users.registeredOn")}: {datum}
          </div>
        </div>
      </div>

      {/* SketchModal — opened by green pill (sketch grid) */}
      <SketchModal
        onClose={() => setShowSketchModal(false)}
        show={showSketchModal}
        character={userData}
      />

      {/* UserModal — opened by clicking anywhere on the card (full profile) */}
      <UserModal
        onClose={() => setShowUserModal(false)}
        show={showUserModal}
        userData={userData}
      />
    </div>
  );
}

export default UserCard;
