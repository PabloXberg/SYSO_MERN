import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import BattleStateBadge from "../components/BattleStateBadge";
import SpraySpinner from "../components/SprySpinner";
import { serverURL } from "../serverURL";

interface BattleSketch {
  _id: string;
  name: string;
  url: string;
  likes: any[];
  owner?: { username: string };
}

interface Battle {
  _id?: string;
  theme: string;
  description: string;
  state: "open" | "voting" | "finished";
  submissionDeadline: string;
  votingDeadline: string;
  prizes: string;
  judges: string;
  isCurrent: boolean;
  popularWinners: (string | BattleSketch)[];
  juryWinners: (string | BattleSketch)[];
}

const emptyBattle: Battle = {
  theme: "",
  description: "",
  state: "open",
  submissionDeadline: "",
  votingDeadline: "",
  prizes: "",
  judges: "",
  isCurrent: true,
  popularWinners: [],
  juryWinners: [],
};

/** Convert ISO datetime → "YYYY-MM-DDTHH:mm" for <input type=datetime-local> */
const toLocalInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

/**
 * /admin/battles — admin-only dashboard.
 *
 * IMPORTANT: All hooks (useState, useEffect, useContext) MUST be called
 * unconditionally and in the same order on every render. The non-admin
 * redirect happens AFTER all hooks have run, not before.
 */
const BattleAdmin = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Battle | null>(null);
  const [editingSketches, setEditingSketches] = useState<BattleSketch[]>([]);
  const [saving, setSaving] = useState(false);

  const authHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverURL}battles`);
      const data = await res.json();
      setBattles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load battles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load battles on mount. Skipped for non-admins via the early return below,
  // but the hook itself still runs unconditionally to satisfy rules-of-hooks.
  useEffect(() => {
    if (user && !user.isAdmin) return; // skip the fetch for non-admins
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⚠️ EARLY RETURN goes AFTER all hooks. This is the rules-of-hooks fix.
  if (user && !user.isAdmin) return <Navigate to="/homepage" replace />;

  const startEdit = async (battle: Battle) => {
    setEditing({
      ...battle,
      submissionDeadline: toLocalInputValue(battle.submissionDeadline),
      votingDeadline: toLocalInputValue(battle.votingDeadline),
    });
    if (battle._id) {
      try {
        const r = await fetch(`${serverURL}battles/${battle._id}`);
        const d = await r.json();
        setEditingSketches(d.sketches || []);
      } catch (err) {
        console.error("Failed to load battle sketches:", err);
        setEditingSketches([]);
      }
    } else {
      setEditingSketches([]);
    }
  };

  const startNew = () => {
    setEditing({ ...emptyBattle });
    setEditingSketches([]);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditingSketches([]);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editing.theme || !editing.submissionDeadline || !editing.votingDeadline) {
      alert(t("admin.battle.missingFields"));
      return;
    }
    setSaving(true);
    try {
      const isNew = !editing._id;
      const url = isNew
        ? `${serverURL}battles`
        : `${serverURL}battles/${editing._id}`;
      const method = isNew ? "POST" : "PUT";

      const body = {
        ...editing,
        submissionDeadline: new Date(editing.submissionDeadline).toISOString(),
        votingDeadline: new Date(editing.votingDeadline).toISOString(),
        popularWinners: (editing.popularWinners || []).map((w: any) =>
          typeof w === "string" ? w : w._id
        ),
        juryWinners: (editing.juryWinners || []).map((w: any) =>
          typeof w === "string" ? w : w._id
        ),
      };

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || t("admin.battle.saveError"));
        return;
      }
      cancelEdit();
      await reload();
    } catch (err) {
      console.error("saveEdit error:", err);
      alert(t("admin.battle.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const deleteBattle = async (id?: string) => {
    if (!id) return;
    if (!window.confirm(t("admin.battle.deleteConfirm"))) return;
    try {
      const res = await fetch(`${serverURL}battles/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Delete failed");
      await reload();
    } catch (err) {
      console.error(err);
      alert(t("admin.battle.deleteError"));
    }
  };

  const runTransitions = async () => {
    try {
      const res = await fetch(`${serverURL}battles/run-transitions`, {
        method: "POST",
        headers: authHeaders(),
      });
      const result = await res.json();
      alert(
        `${t("admin.battle.transitionsRan")}\n` +
          `→ voting: ${result.opened || 0}\n` +
          `→ finished: ${result.closed || 0}`
      );
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <SpraySpinner />;

  // ----- EDIT FORM -----
  if (editing) {
    return (
      <div className="Battle-container">
        <div className="battleText">
          <h2 className="tituloFuente">
            {editing._id ? t("admin.battle.editTitle") : t("admin.battle.newTitle")}
          </h2>

          <Form.Group className="mb-3">
            <Form.Label>{t("admin.battle.theme")}*</Form.Label>
            <Form.Control
              type="text"
              value={editing.theme}
              onChange={(e) => setEditing({ ...editing, theme: e.target.value })}
              placeholder={t("admin.battle.themePlaceholder")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("admin.battle.description")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
          </Form.Group>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Form.Group className="mb-3" style={{ flex: 1, minWidth: "15rem" }}>
              <Form.Label>{t("admin.battle.submissionDeadline")}*</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editing.submissionDeadline}
                onChange={(e) =>
                  setEditing({ ...editing, submissionDeadline: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" style={{ flex: 1, minWidth: "15rem" }}>
              <Form.Label>{t("admin.battle.votingDeadline")}*</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editing.votingDeadline}
                onChange={(e) =>
                  setEditing({ ...editing, votingDeadline: e.target.value })
                }
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>{t("admin.battle.prizes")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={editing.prizes}
              onChange={(e) => setEditing({ ...editing, prizes: e.target.value })}
              placeholder={t("admin.battle.prizesPlaceholder")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("admin.battle.judges")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={editing.judges}
              onChange={(e) => setEditing({ ...editing, judges: e.target.value })}
              placeholder={t("admin.battle.judgesPlaceholder")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("admin.battle.state")}</Form.Label>
            <Form.Select
              value={editing.state}
              onChange={(e) =>
                setEditing({ ...editing, state: e.target.value as any })
              }
            >
              <option value="open">open</option>
              <option value="voting">voting</option>
              <option value="finished">finished</option>
            </Form.Select>
          </Form.Group>

          <Form.Check
            type="switch"
            id="is-current-switch"
            label={t("admin.battle.isCurrent")}
            checked={editing.isCurrent}
            onChange={(e) =>
              setEditing({ ...editing, isCurrent: e.target.checked })
            }
            className="mb-3"
          />

          {editing._id && editingSketches.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>{t("admin.battle.juryWinnerPick")}</Form.Label>
              <Form.Select
                value={
                  editing.juryWinners?.[0]
                    ? typeof editing.juryWinners[0] === "string"
                      ? editing.juryWinners[0]
                      : (editing.juryWinners[0] as BattleSketch)._id
                    : ""
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    juryWinners: e.target.value ? [e.target.value] : [],
                  })
                }
              >
                <option value="">{t("admin.battle.noJuryWinner")}</option>
                {editingSketches.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.owner?.username || "?"} ({s.likes?.length || 0} ❤)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Button variant="success" onClick={saveEdit} disabled={saving}>
              {saving ? "..." : t("admin.battle.save")}
            </Button>
            <Button variant="secondary" onClick={cancelEdit} disabled={saving}>
              {t("mySketches.cancel")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----- LIST -----
  return (
    <div className="Battle-container">
      <div className="battleText">
        <h2 className="tituloFuente">{t("admin.battle.title")}</h2>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <Button variant="success" onClick={startNew}>
            ➕ {t("admin.battle.newBattle")}
          </Button>
          <Button variant="warning" onClick={runTransitions}>
            🔄 {t("admin.battle.runTransitions")}
          </Button>
        </div>

        {battles.length === 0 && (
          <h5>
            <i>{t("admin.battle.noBattles")}</i>
          </h5>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {battles.map((b) => (
            <div
              key={b._id}
              style={{
                padding: "1rem",
                border: b.isCurrent ? "2px solid #ffcc00" : "1px solid #444",
                borderRadius: "0.3rem",
                backgroundColor: "#1a1a1a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.75rem",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <h4 style={{ margin: 0 }}>{b.theme}</h4>
                  <BattleStateBadge state={b.state} size="sm" />
                  {b.isCurrent && (
                    <span
                      style={{
                        padding: "0.15rem 0.5rem",
                        backgroundColor: "#ffcc00",
                        color: "#000",
                        fontWeight: "bold",
                        borderRadius: "0.2rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      {t("admin.battle.currentTag")}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button size="sm" variant="primary" onClick={() => startEdit(b)}>
                    {t("admin.battle.edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteBattle(b._id)}
                  >
                    {t("admin.battle.delete")}
                  </Button>
                </div>
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#aaa" }}>
                📅 {new Date(b.submissionDeadline).toLocaleString()} →{" "}
                {new Date(b.votingDeadline).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleAdmin;
