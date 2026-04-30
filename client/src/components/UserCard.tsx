import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultImage from "../avatar-placeholder.gif";
import SketchModal from "./SketchModal";
import { AuthContext } from "../contexts/AuthContext";

const AVATAR_PLACEHOLDER =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

/**
 * User card — rebuilt from scratch with the new dark theme.
 *
 * Design notes:
 * - Replaces bootstrap <Card> with a custom <div> so we have full styling
 *   control without fighting bootstrap defaults (white bg, light borders,
 *   text-muted that goes invisible on dark backgrounds, etc).
 * - Avatar shrunk from 20rem to 8rem — gives the card a much better
 *   proportion and lets us fit more cards per row.
 * - Hover state lifts the card and adds a yellow glow, consistent with
 *   the WinnerCard and BattleStateBadge styling.
 * - Sketch count is now a clickable green pill (visible affordance) when
 *   the user has any AND the viewer is logged in.
 *
 * The outer .usercard wrapper is preserved so any existing flex layout
 * in the parent container keeps working.
 */
function UserCard(props: any) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  const userData = props.props;
  const datum =
    userData.createdAt?.substring(0, 10) || t("common.unknownDate");

  // Use local placeholder GIF when avatar is empty or matches the cloud default
  const avatarFinal =
    userData.avatar === "" || userData.avatar === AVATAR_PLACEHOLDER
      ? DefaultImage
      : userData.avatar;

  const sketchCount = userData.sketchs?.length || 0;
  const canOpenSketchesModal = sketchCount > 0 && !!user;

  return (
    <div className="usercard">
      <div
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
        }}
      >
        {/* AVATAR — circular with yellow ring, much smaller than before */}
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
            backgroundColor: "#0d0d0d", // for transparent avatars
            boxShadow: "0 0 12px rgba(255,204,0,0.25)",
          }}
        />

        {/* USERNAME — graffiti-style heading, gold */}
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
          }}
        >
          {userData.username || t("auth.username")}
        </h3>

        {/* INFO TEXT — italic + muted when there's no info */}
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
          }}
        >
          {userData.info || t("users.noInfo")}
        </p>

        {/* STATS / FOOTER */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
            paddingTop: "0.85rem",
            borderTop: "1px solid #333",
          }}
        >
          {/* Sketches count — green pill, clickable when logged in + has sketches */}
          <div
            onClick={canOpenSketchesModal ? () => setShow(true) : undefined}
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

          {/* Registration date */}
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "0.75rem",
              fontStyle: "italic",
            }}
          >
            {t("users.registeredOn")}: {datum}
          </div>
        </div>
      </div>

      <SketchModal
        onClose={() => setShow(false)}
        show={show}
        character={userData}
      />
    </div>
  );
}

export default UserCard;
