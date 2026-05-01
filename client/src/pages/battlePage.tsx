import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  isCurrent: boolean;
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
 * /battle/:id — view of any specific battle by its ID.
 *
 * Sister to /actualbattle, but works for ANY battle (past, current, or future).
 * Used by:
 *   - battle history (each finished battle links here)
 *   - notification clicks (pre-battle-current)
 *   - actualbattle page (link "ver detalle")
 *
 * If the battle is the current one, we show a hint that they could go to
 * /actualbattle for the live experience (this distinguishes the static
 * detail view from the live battle page).
 */
const BattlePage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [battle, setBattle] = useState<Battle | null>(null);
  const [sketches, setSketches] = useState<BattleSketch[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);

    fetch(`${serverURL}battles/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((detail) => {
        if (cancelled) return;
        if (!detail?.battle) {
          setErrorMsg(t("battle.notFound", "Battle no encontrado"));
          return;
        }
        setBattle(detail.battle);
        setSketches(detail.sketches || []);
      })
      .catch((err) => {
        console.error("Failed to load battle:", err);
        if (!cancelled) setErrorMsg(t("battle.loadError", "Error al cargar el battle"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, t]);

  if (loading) return <SpraySpinner />;

  if (errorMsg || !battle) {
    return (
      <>
        <SubBattleNav />
        <div className="Battle-container">
          <div className="battleText" style={{ textAlign: "center" }}>
            <h2 className="tituloFuente">
              {errorMsg || t("battle.notFound", "Battle no encontrado")}
            </h2>
            <button
              onClick={() => navigate("/battlehistory")}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                backgroundColor: "transparent",
                border: "2px solid #ffcc00",
                color: "#ffcc00",
                fontFamily: "MiFuente2, MiFuente, cursive",
                fontSize: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "0.3rem",
              }}
            >
              ← {t("battle.backToHistory", "Volver al historial")}
            </button>
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
          {/* Back link */}
          <Link
            to="/battlehistory"
            style={{
              display: "inline-block",
              marginBottom: "1rem",
              color: "#aaa",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            ← {t("battle.backToHistory", "Volver al historial")}
          </Link>

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
            <h2 className="tituloFuente" style={{ margin: 0 }}>
              ⚔ {battle.theme}
            </h2>
            <BattleStateBadge state={battle.state} />
          </div>

          {/* If this is the current battle, hint to go to the live page */}
          {battle.isCurrent && (
            <div
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                backgroundColor: "#3a2a00",
                border: "2px solid #ffcc00",
                borderRadius: "0.3rem",
                color: "#ffcc00",
                fontSize: "0.95rem",
              }}
            >
              ⚡{" "}
              <Link
                to="/actualbattle"
                style={{
                  color: "#ffcc00",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {t(
                  "battle.viewLive",
                  "Este es el battle actual — entrá a la página en vivo"
                )}
              </Link>
            </div>
          )}

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
              <div className="cardcontainer">
                {sketches.map((s) => (
                  <SketchCard key={s._id} props={s} />
                ))}
              </div>
            </div>
          )}

          {sketches.length === 0 && (
            <h5
              style={{
                textAlign: "center",
                marginTop: "2rem",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              {t("battle.noSubmissionsYet")}
            </h5>
          )}
        </div>
      </div>
    </>
  );
};

export default BattlePage;
