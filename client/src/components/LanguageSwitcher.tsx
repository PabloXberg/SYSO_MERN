import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

/**
 * Language switcher with country flags + custom-styled dropdown.
 *
 * IMPORTANT — why createPortal:
 * The navbar (and the NavtrapBar/SubNav) create their own stacking contexts via
 * `position: relative` + `z-index`. Anything rendered inside the navbar — even
 * with z-index 9999 — is trapped in that context and ends up BEHIND the SubNav
 * for hit-testing, which steals all clicks/hover. Rendering the options panel
 * directly into <body> via a portal escapes the trap.
 */

const SpanishFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 3 2"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <rect width="3" height="2" fill="#c60b1e" />
    <rect width="3" height="1" y="0.5" fill="#ffc400" />
  </svg>
);

const UKFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 60 30"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <clipPath id="uk-clip">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
    <path
      d="M0,0 L60,30 M60,0 L0,30"
      stroke="#fff"
      strokeWidth="6"
      clipPath="url(#uk-clip)"
    />
    <path
      d="M0,0 L60,30 M60,0 L0,30"
      stroke="#C8102E"
      strokeWidth="4"
      clipPath="url(#uk-clip)"
    />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const LANGS = [
  { code: "es", label: "ES", Flag: SpanishFlag, key: "spanish" as const },
  { code: "en", label: "EN", Flag: UKFlag, key: "english" as const },
] as const;

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const current = (i18n.resolvedLanguage || "es").split("-")[0];
  const currentLang = LANGS.find((l) => l.code === current) || LANGS[0];

  // Position the panel right under the trigger, right-aligned with it.
  // useLayoutEffect avoids a one-frame flash at the wrong position.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  }, [open]);

  // Reposition on resize/scroll while open
  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  // Click-outside: ignore clicks inside trigger OR panel (panel is in portal,
  // so we have to check both refs explicitly — `contains` on wrapper alone
  // wouldn't include the portaled panel).
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape for keyboard accessibility
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const change = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const triggerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    backgroundColor: "transparent",
    color: "#ffcc00",
    border: "1.5px solid #ffcc00",
    borderRadius: "0.2rem",
    padding: "0.2rem 0.5rem",
    fontFamily: "MiFuente2, MiFuente, cursive",
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "1px 1px 0 rgba(0,0,0,0.6)",
    outline: "none",
  };

  const optionStyle = (code: string): React.CSSProperties => {
    const isActive = code === current;
    const isHovered = code === hoveredCode;
    return {
      display: "flex",
      alignItems: "center",
      gap: "0.55rem",
      width: "100%",
      padding: "0.55rem 0.85rem",
      backgroundColor: isActive
        ? "#3a2a00"
        : isHovered
        ? "#2a2a2a"
        : "transparent",
      color: isActive ? "#ff3b3b" : "#ffcc00",
      border: "none",
      fontFamily: "MiFuente2, MiFuente, cursive",
      fontSize: "0.95rem",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      cursor: "pointer",
      textAlign: "left",
      transition: "background-color 0.12s ease",
    };
  };

  return (
    <div style={{ position: "relative" }} title={t("language.label")}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={triggerStyle}
      >
        <currentLang.Flag />
        <span>{currentLang.label}</span>
        <span style={{ fontSize: "0.7rem", marginLeft: "0.1rem" }}>▾</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            style={{
              position: "fixed",
              top: pos.top,
              right: pos.right,
              minWidth: "9rem",
              backgroundColor: "#1a1a1a",
              border: "2px solid #ffcc00",
              borderRadius: "0.2rem",
              boxShadow:
                "3px 3px 0 rgba(0,0,0,0.85), 0 0 10px rgba(255,204,0,0.25)",
              zIndex: 9999,
              padding: "0.25rem 0",
              overflow: "hidden",
            }}
          >
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={lang.code === current}
                onClick={() => change(lang.code)}
                onMouseEnter={() => setHoveredCode(lang.code)}
                onMouseLeave={() => setHoveredCode(null)}
                style={optionStyle(lang.code)}
              >
                <lang.Flag />
                <span>{lang.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default LanguageSwitcher;
