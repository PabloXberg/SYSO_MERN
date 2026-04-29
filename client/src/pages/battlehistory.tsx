import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SubBattleNav from "../components/SubBattleNav";
import BattleStateBadge from "../components/BattleStateBadge";
import WinnerCard from "../components/WinnerCard";
import SpraySpinner from "../components/SprySpinner";
import { serverURL } from "../serverURL";

interface BattleSketch {
  _id: string;
  name: string;
  url: string;
  likes?: any[];
  owner?: { username?: string; avatar?: string };
}

interface Battle {
  _id: string;
  theme: string;
  description: string;
  state: "open" | "voting" | "finished";
  submissionDeadline: string;
  votingDeadline: string;
  prizes: string;
  judges: string;
  popularWinners: BattleSketch[];
  juryWinners: BattleSketch[];
}

const formatDate = (iso: string, locale: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * /battlehistory — list of past (finished) battles with their winners.
 *
 * Fetches all battles, filters to state === "finished", newest first.
 * Each battle gets its own card with theme, dates, and the winner cards
 * (popular + jury) stacked side by side.
 */
const BattleHistory = () => {
  const { t, i18n } = useTranslation();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${serverURL}battles`)
      .then((r) => r.json())
      .then((data: Battle[]) => {
        if (cancelled) return;
        // Only finished battles belong in history. Sort newest-first by votingDeadline.
        const finished = (Array.isArray(data) ? data : [])
          .filter((b) => b.state === "finished")
          .sort(
            (a, b) =>
              new Date(b.votingDeadline).getTime() -
              new Date(a.votingDeadline).getTime()
          );
        setBattles(finished);
      })
      .catch((err) => console.error("Failed to load battle history:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <SpraySpinner />;

  const lang = i18n.resolvedLanguage?.split("-")[0] || "es";

  return (
    <>
      <SubBattleNav />
      <div className="Battle-container">
        <div className="battleText">
          <h2 className="tituloFuente" style={{ marginBottom: "1.5rem" }}>
            🏆 {t("battle.previousBattles")} 🏆
          </h2>

          {battles.length === 0 && (
            <h5>
              <i>{t("battle.noPastBattles")}</i>
            </h5>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.5rem",
            }}
          >
            {battles.map((battle) => {
              const popular = battle.popularWinners?.[0];
              const jury = battle.juryWinners?.[0];

              return (
                <div
                  key={battle._id}
                  style={{
                    padding: "1.5rem",
                    border: "2px solid #ffcc00",
                    borderRadius: "0.4rem",
                    backgroundColor: "#1a1a1a",
                    boxShadow: "3px 3px 0 rgba(0,0,0,0.7)",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 className="tituloFuente" style={{ margin: 0 }}>
                      ⚔ {battle.theme}
                    </h3>
                    <BattleStateBadge state={battle.state} size="sm" />
                  </div>

                  {battle.description && (
                    <h5 style={{ marginBottom: "0.75rem" }}>
                      {battle.description}
                    </h5>
                  )}

                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#aaa",
                      marginBottom: "1.5rem",
                    }}
                  >
                    📅 {formatDate(battle.votingDeadline, lang)}
                  </div>

                  {/* Winners side by side */}
                  {(popular || jury) ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "1.5rem",
                      }}
                    >
                      {jury && <WinnerCard sketch={jury} type="jury" />}
                      {popular && (
                        <WinnerCard sketch={popular} type="popular" />
                      )}
                    </div>
                  ) : (
                    <h5 style={{ color: "#888", fontStyle: "italic" }}>
                      {t("battle.noWinnersAnnounced")}
                    </h5>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BattleHistory;
