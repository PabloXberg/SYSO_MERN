import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface WinnerSketch {
  _id: string;
  name: string;
  url: string;
  likes?: any[];
  owner?: { username?: string; avatar?: string };
}

interface Props {
  sketch: WinnerSketch;
  /** Either "popular" (most likes) or "jury" (chosen by judges). Drives the label/color. */
  type: "popular" | "jury";
}

/**
 * Highlight card for a battle winner. Used on /actualbattle when the battle
 * is finished. Designed to feel like a "trophy frame" rather than a regular
 * sketch card.
 */
const WinnerCard = ({ sketch, type }: Props) => {
  const { t } = useTranslation();

  // Popular = gold trophy, jury = red trophy
  const accent = type === "popular" ? "#ffcc00" : "#ff3b3b";
  const label =
    type === "popular" ? t("battle.popularWinner") : t("battle.juryWinner");
  const trophy = type === "popular" ? "🏆" : "👑";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        border: `3px solid ${accent}`,
        borderRadius: "0.4rem",
        backgroundColor: "#1a1a1a",
        boxShadow: `4px 4px 0 rgba(0,0,0,0.7), 0 0 16px ${accent}33`,
        maxWidth: "20rem",
      }}
    >
      <div
        style={{
          fontFamily: "MiFuente2, MiFuente, cursive",
          fontSize: "1.1rem",
          color: accent,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}
      >
        {trophy} {label}
      </div>

      <Link to={`/sketchdetail/${sketch._id}`} style={{ width: "100%" }}>
        <img
          src={sketch.url}
          alt={sketch.name}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            borderRadius: "0.2rem",
            cursor: "pointer",
          }}
        />
      </Link>

      <div
        style={{
          marginTop: "0.75rem",
          textAlign: "center",
          color: "#f0f0f0",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
          {sketch.name}
        </div>
        {sketch.owner?.username && (
          <div style={{ fontSize: "0.9rem", color: "#aaa" }}>
            {t("sketch.uploadedBy")}: <b>{sketch.owner.username}</b>
          </div>
        )}
        {typeof sketch.likes?.length === "number" && (
          <div style={{ fontSize: "0.85rem", color: "#aaa", marginTop: "0.3rem" }}>
            ❤ {sketch.likes.length} {t("sketch.likes")}
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerCard;
