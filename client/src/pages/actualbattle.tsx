import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SubBattleNav from "../components/SubBattleNav";
import BattleStateBadge from "../components/BattleStateBadge";
import WinnerCard from "../components/WinnerCard";
import SketchCard from "../components/SketchCard";
import SpraySpinner from "../components/SprySpinner";
import { serverURL } from "../serverURL";

interface BattleSketch {
  _id: string;
  name: string;
  url: string;
  comment: string;
  likes: any[];
  comments: any[];
  tags: string[];
  createdAt: string;
  owner: { _id: string; username: string; avatar: string };
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
 * /actualbattle — the heart of the new battle system.
 *
 * Fetches the current battle and its participating sketches in two requests:
 *   1. /api/battles/current → battle metadata + winner refs (populated)
 *   2. /api/battles/:id     → battle + all participating sketches sorted by likes
 *
 * UI changes by state:
 *   open     → "submission deadline X, get your sketch in"
 *   voting   → "voting deadline X, like your favorites"
 *   finished → winners on top, full gallery below
 */
const ActualBattle = () => {
  const { t, i18n } = useTranslation();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [sketches, setSketches] = useState<BattleSketch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${serverURL}battles/current`);
        const current: Battle | null = await res.json();
        if (cancelled) return;

        if (!current) {
          setBattle(null);
          setSketches([]);
          return;
        }

        const detailRes = await fetch(`${serverURL}battles/${current._id}`);
        const detail = await detailRes.json();
        if (cancelled) return;

        setBattle(detail.battle);
        setSketches(detail.sketches || []);
      } catch (err) {
        console.error("Failed to load current battle:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <SpraySpinner />;

  // No battle configured — graceful fallback
  if (!battle) {
    return (
      <>
        <SubBattleNav />
        <div className="Battle-container">
          <div className="battleText" style={{ textAlign: "center" }}>
            <h2 className="tituloFuente">{t("battle.noActiveBattle")}</h2>
            <h4>{t("battle.checkBackSoon")}</h4>
          </div>
        </div>
      </>
    );
  }

  const lang = i18n.resolvedLanguage?.split("-")[0] || "es";
  const popular = battle.popularWinners?.[0];
  const jury = battle.juryWinners?.[0];

  return (
    <>
      <SubBattleNav />
      <div className="Battle-container">
        <div className="battleText">
          {/* Header: theme + status badge */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2 className="tituloFuente" style={{ margin: 0 }}>
              ⚔ {battle.theme}
            </h2>
            <BattleStateBadge state={battle.state} />
          </div>

          {battle.description && (
            <h5 style={{ marginBottom: "1.5rem" }}>{battle.description}</h5>
          )}

          {/* Key dates and rules */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 className="tituloFuente">{t("battle.rules")}</h3>
            <h5>
              * {t("battle.submissionDeadline")}:{" "}
              <b>{formatDate(battle.submissionDeadline, lang)}</b>
              <br />
              * {t("battle.votingDeadline")}:{" "}
              <b>{formatDate(battle.votingDeadline, lang)}</b>
              <br />
              * {t("battle.format")}: {t("battle.formatDescription")}
            </h5>
          </div>

          {battle.prizes && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="tituloFuente">{t("battle.prizes")}:</h3>
              <h5 style={{ whiteSpace: "pre-line" }}>{battle.prizes}</h5>
            </div>
          )}

          {battle.judges && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="tituloFuente">{t("battle.judges")}:</h3>
              <h5 style={{ whiteSpace: "pre-line" }}>{battle.judges}</h5>
            </div>
          )}

          {/* WINNERS — only when finished */}
          {battle.state === "finished" && (popular || jury) && (
            <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <h3 className="tituloFuente" style={{ textAlign: "center" }}>
                🏆 {t("battle.winners")} 🏆
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "2rem",
                  marginTop: "1rem",
                }}
              >
                {jury && <WinnerCard sketch={jury} type="jury" />}
                {popular && <WinnerCard sketch={popular} type="popular" />}
              </div>
            </div>
          )}

          {/* GALLERY of participating sketches, sorted by likes */}
          {sketches.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 className="tituloFuente">
                {battle.state === "finished"
                  ? t("battle.allParticipants")
                  : t("battle.currentParticipants")}{" "}
                ({sketches.length})
              </h3>
              {battle.state === "voting" && (
                <h5
                  style={{
                    color: "#ffcc00",
                    marginTop: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  ❤ {t("battle.voteHint")}
                </h5>
              )}
              <div className="cardcontainer">
                {sketches.map((s) => (
                  <SketchCard key={s._id} props={s} />
                ))}
              </div>
            </div>
          )}

          {sketches.length === 0 && battle.state === "open" && (
            <h5 style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
              <i>{t("battle.noSubmissionsYet")}</i>
            </h5>
          )}
        </div>
      </div>
    </>
  );
};

export default ActualBattle;
