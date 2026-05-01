import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
 * IMPORTANT FIX (HTML validity):
 * Earlier version wrapped the entire card in <Link>, but the WinnerCard
 * component renders its own <Link> internally. Nesting <a> inside <a> is
 * invalid HTML and React warns about it.
 *
 * Solution: keep the card as a plain <div> with a "Ver detalle" button
 * that uses useNavigate(). The WinnerCard links keep working as expected
 * (clicking a winner takes you to the sketch). Clicking the "Ver detalle"
 * button takes you to the battle page.
 */
const BattleHistory = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${serverURL}battles`)
      .then((r) => r.json())
      .then((data: Battle[]) => {
        if (cancelled) return;
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

  const goToBattle = (battleId: string) => {
    navigate(`/battle/${battleId}`);
  };

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
                      justifyContent: "space-between",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3 className="tituloFuente" style={{ margin: 0 }}>
                        ⚔ {battle.theme}
                      </h3>
                      <BattleStateBadge state={battle.state} size="sm" />
                    </div>
                    <button
                      onClick={() => goToBattle(battle._id)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#ffcc00",
                        fontSize: "0.85rem",
                        fontFamily: "MiFuente2, MiFuente, cursive",
                        letterSpacing: "0.05em",
                        border: "2px solid #ffcc00",
                        borderRadius: "0.3rem",
                        padding: "0.35rem 0.9rem",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#3a2a00";
                        e.currentTarget.style.boxShadow =
                          "0 0 8px rgba(255,204,0,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {t("battle.viewDetails", "Ver detalle")} →
                    </button>
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
