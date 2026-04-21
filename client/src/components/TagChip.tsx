import { useTranslation } from "react-i18next";
import { findTag } from "../constants/tags";

interface TagChipProps {
  tag: string;
  size?: "sm" | "md";
  onClick?: () => void;
  active?: boolean;
}

/**
 * Graffiti-style tag chip.
 * Dark background with vibrant colored border (spray-paint effect),
 * graffiti font, slight rotation. On hover/active: glow + scale.
 */
const TagChip = ({ tag, size = "sm", onClick, active }: TagChipProps) => {
  const { t } = useTranslation();
  const option = findTag(tag);
  if (!option) return null;

  // Size config
  const cfg = size === "sm"
    ? { fontSize: "0.95rem", padding: "0.1rem 0.7rem", border: "2px" }
    : { fontSize: "1.15rem", padding: "0.25rem 0.9rem", border: "2.5px" };

  const color = option.color;

  // Styling tricks:
  // - tag uppercase but with graffiti font
  // - text in the tag's color on a dark background (stencil/spray look)
  // - glow effect on hover/active (looks like wet paint)
  // - slight rotation on active for attitude
  const base: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: active ? color : "#111",
    color: active ? "#111" : color,
    padding: cfg.padding,
    borderRadius: "0.2rem",
    fontFamily: "MiFuente2, MiFuente, cursive",
    fontSize: cfg.fontSize,
    letterSpacing: "0.05em",
    cursor: onClick ? "pointer" : "default",
    border: `${cfg.border} solid ${color}`,
    boxShadow: active
      ? `0 0 10px ${color}, 0 0 20px ${color}66, 2px 2px 0 #000`
      : `2px 2px 0 #000`,
    transition: "all 0.2s ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    transform: active ? "rotate(-1.5deg) scale(1.05)" : "rotate(-0.5deg)",
    textShadow: active ? "none" : `0 0 2px ${color}44`,
  };

  const handleHover = (e: React.MouseEvent<HTMLSpanElement>, entering: boolean) => {
    if (!onClick || active) return;
    const el = e.currentTarget;
    if (entering) {
      el.style.transform = "rotate(1deg) scale(1.08)";
      el.style.boxShadow = `0 0 8px ${color}88, 2px 2px 0 #000`;
    } else {
      el.style.transform = "rotate(-0.5deg)";
      el.style.boxShadow = `2px 2px 0 #000`;
    }
  };

  return (
    <span
      onClick={onClick}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
      style={base}
    >
      {t(option.labelKey)}
    </span>
  );
};

export default TagChip;
