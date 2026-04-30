import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

/**
 * Language switcher with 6 country flags + custom-styled dropdown.
 *
 * IMPORTANT — why createPortal:
 * The navbar (and the NavtrapBar/SubNav) create their own stacking contexts via
 * `position: relative` + `z-index`. Anything rendered inside the navbar — even
 * with z-index 9999 — is trapped in that context and ends up BEHIND the SubNav
 * for hit-testing, which steals all clicks/hover. Rendering the options panel
 * directly into <body> via a portal escapes the trap.
 */

// =============================================================================
// FLAG COMPONENTS
// All flags are inline SVG so they render identically across OS/browsers
// without depending on emoji fonts. Each is 20x14 viewBox to fit in the navbar.
// =============================================================================

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

const GermanFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 5 3"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <rect width="5" height="1" y="0" fill="#000" />
    <rect width="5" height="1" y="1" fill="#dd0000" />
    <rect width="5" height="1" y="2" fill="#ffce00" />
  </svg>
);

const FrenchFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 3 2"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <rect width="1" height="2" x="0" fill="#002654" />
    <rect width="1" height="2" x="1" fill="#ffffff" />
    <rect width="1" height="2" x="2" fill="#ce1126" />
  </svg>
);

const ItalianFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 3 2"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <rect width="1" height="2" x="0" fill="#009246" />
    <rect width="1" height="2" x="1" fill="#ffffff" />
    <rect width="1" height="2" x="2" fill="#ce2b37" />
  </svg>
);

const PortugueseFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 5 3"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <rect width="2" height="3" x="0" fill="#006600" />
    <rect width="3" height="3" x="2" fill="#ff0000" />
    {/* Simple yellow disk to suggest the armillary sphere without
        getting into heraldic detail at this size */}
    <circle cx="2" cy="1.5" r="0.55" fill="#ffd700" stroke="#000" strokeWidth="0.05" />
    <circle cx="2" cy="1.5" r="0.3" fill="#ffffff" stroke="#000" strokeWidth="0.04" />
  </svg>
);

// =============================================================================
// LANGUAGE LIST
// To disable a language: comment out its entry below.
// To add a new one: add a flag component above + an entry here + update i18n.ts.
// =============================================================================

const LANGS = [
  { code: "es", label: "ES", Flag: SpanishFlag, key: "spanish" as const },
  { code: "en", label: "EN", Flag: UKFlag, key: "english" as const },
  { code: "de", label: "DE", Flag: GermanFlag, key: "german" as const },
  { code: "fr", label: "FR", Flag: FrenchFlag, key: "french" as const },
  { code: "it", label: "IT", Flag: ItalianFlag, key: "italian" as const },
  { code: "pt", label: "PT", Flag: PortugueseFlag, key: "portuguese" as const },
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

  // Click-outside: ignore clicks inside trigger OR panel
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

  // Close on Escape
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
              maxHeight: "min(70vh, 22rem)",
              overflowY: "auto",
              backgroundColor: "#1a1a1a",
              border: "2px solid #ffcc00",
              borderRadius: "0.2rem",
              boxShadow:
                "3px 3px 0 rgba(0,0,0,0.85), 0 0 10px rgba(255,204,0,0.25)",
              zIndex: 9999,
              padding: "0.25rem 0",
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
