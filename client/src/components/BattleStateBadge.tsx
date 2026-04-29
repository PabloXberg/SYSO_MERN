import { useTranslation } from "react-i18next";

interface Props {
  state: "open" | "voting" | "finished";
  size?: "sm" | "md";
}

/**
 * Visual badge for battle state. Three colors map to three life-cycle phases:
 *   open     → green (submissions accepted)
 *   voting   → yellow (decision time)
 *   finished → red   (closed, winners announced)
 */
const BattleStateBadge = ({ state, size = "md" }: Props) => {
  const { t } = useTranslation();

  const palette: Record<typeof state, { bg: string; fg: string; border: string }> = {
    open: { bg: "#0a3a1a", fg: "#39ff14", border: "#39ff14" },
    voting: { bg: "#3a2a00", fg: "#ffcc00", border: "#ffcc00" },
    finished: { bg: "#3a0a0a", fg: "#ff3b3b", border: "#ff3b3b" },
  };
  const colors = palette[state];

  const isLarge = size === "md";

  return (
    <span
      style={{
        display: "inline-block",
        padding: isLarge ? "0.4rem 0.9rem" : "0.2rem 0.6rem",
        backgroundColor: colors.bg,
        color: colors.fg,
        border: `2px solid ${colors.border}`,
        borderRadius: "0.3rem",
        fontFamily: "MiFuente2, MiFuente, cursive",
        fontSize: isLarge ? "1rem" : "0.75rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.6)`,
      }}
    >
      {t(`battle.state.${state}`)}
    </span>
  );
};

export default BattleStateBadge;
