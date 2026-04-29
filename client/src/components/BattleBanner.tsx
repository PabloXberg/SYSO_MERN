import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrentBattle } from "../hooks/useCurrentBattle";

const SESSION_KEY = "battle-banner-dismissed-id";

/**
 * Promo banner shown above the navbar when there's an active battle.
 *
 * Visibility rules:
 *   - Hidden if there's no current battle, or if it's already finished
 *   - Hidden if the user dismissed THIS battle (by id) in this session
 *
 * The dismissal uses sessionStorage (not localStorage) on purpose: when the
 * user closes the browser and comes back later, the banner reappears so
 * they don't forget the battle is happening. We keyed it by battle._id so
 * that when a NEW battle starts, the dismissal resets automatically.
 */
const BattleBanner = () => {
  const { t } = useTranslation();
  const { battle } = useCurrentBattle();
  const [dismissed, setDismissed] = useState<string | null>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null
  );

  if (!battle) return null;
  if (battle.state === "finished") return null;
  if (dismissed === battle._id) return null;

  const isOpen = battle.state === "open";
  const deadline = isOpen ? battle.submissionDeadline : battle.votingDeadline;
  const msLeft = new Date(deadline).getTime() - Date.now();
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

  // Three cases per state to keep the message natural:
  //   ≤0 days → "last chance"
  //    1 day  → "1 day left" (singular)
  //   ≥2 days → "X days left"
  const messageKey = (() => {
    const prefix = isOpen ? "open" : "voting";
    if (daysLeft <= 0) return `battleBanner.${prefix}LastChance`;
    if (daysLeft === 1) return `battleBanner.${prefix}OneDay`;
    return `battleBanner.${prefix}ManyDays`;
  })();

  const message = t(messageKey, { theme: battle.theme, days: daysLeft });

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(SESSION_KEY, battle._id);
    setDismissed(battle._id);
  };

  return (
    <Link
      to="/actualbattle"
      style={{
        display: "block",
        textDecoration: "none",
        background: isOpen
          ? "linear-gradient(90deg, #ffcc00 0%, #ff9900 100%)"
          : "linear-gradient(90deg, #ff9900 0%, #ff3b3b 100%)",
        color: "#000",
        textAlign: "center",
        padding: "0.5rem 2.5rem 0.5rem 1rem",
        fontFamily: "MiFuente2, MiFuente, cursive",
        fontWeight: "bold",
        letterSpacing: "0.05em",
        fontSize: "0.95rem",
        position: "relative",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      }}
      title={t("battleBanner.clickHint")}
    >
      ⚔ {message} ⚔
      <span
        onClick={handleDismiss}
        role="button"
        aria-label={t("battleBanner.dismiss")}
        title={t("battleBanner.dismiss")}
        style={{
          position: "absolute",
          right: "0.6rem",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "0 0.5rem",
          fontSize: "1.1rem",
          opacity: 0.65,
          fontWeight: "normal",
        }}
      >
        ✕
      </span>
    </Link>
  );
};

export default BattleBanner;
