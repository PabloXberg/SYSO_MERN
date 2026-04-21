import { useTranslation } from "react-i18next";
import { findTag } from "../constants/tags";

interface TagChipProps {
  tag: string;
  size?: "sm" | "md";
  onClick?: () => void;
  active?: boolean;
}

/**
 * Graffiti-style tag chip designed to sit on a brick wall background.
 * Dark background + vibrant colored border (spray-can on wall effect),
 * graffiti font, slight rotation. Hover/active: glow + scale.
 */
const TagChip = ({ tag, size = "sm", onClick, active }: TagChipProps) => {
  const { t } = useTranslation();
  const option = findTag(tag);
  if (!option) return null;

  const cfg =
    size === "sm"
      ? { fontSize: "0.95rem", padding: "0.1rem 0.7rem", border: "2px" }
      : { fontSize: "1.15rem", padding: "0.3rem 0.9rem", border: "2.5px" };

  const color = option.color;

  // Style: dark inner BG so chips are readable over any wall texture,
  // colored border mimics a spray outline, strong shadow for depth.
  const base: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: active ? color : "rgba(10, 10, 10, 0.92)",
    color: active ? "#0a0a0a" : color,
    padding: cfg.padding,
    borderRadius: "0.25rem",
    fontFamily: "MiFuente2, MiFuente, cursive",
    fontSize: cfg.fontSize,
    letterSpacing: "0.05em",
    cursor: onClick ? "pointer" : "default",
    border: `${cfg.border} solid ${color}`,
    boxShadow: active
      ? `0 0 12px ${color}, 0 0 24px ${color}66, 3px 3px 0 rgba(0,0,0,0.85)`
      : `3px 3px 0 rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)`,
    transition: "all 0.2s ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    transform: active ? "rotate(-1.5deg) scale(1.05)" : "rotate(-0.5deg)",
    textShadow: active ? "none" : `0 0 2px ${color}66`,
  };

  const handleHover = (
    e: React.MouseEvent<HTMLSpanElement>,
    entering: boolean
  ) => {
    if (!onClick || active) return;
    const el = e.currentTarget;
    if (entering) {
      el.style.transform = "rotate(1deg) scale(1.08)";
      el.style.boxShadow = `0 0 10px ${color}aa, 3px 3px 0 rgba(0,0,0,0.85)`;
    } else {
      el.style.transform = "rotate(-0.5deg)";
      el.style.boxShadow = `3px 3px 0 rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)`;
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
