import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Language switcher with country flags + fully custom dropdown so we can
 * apply the graffiti font to BOTH the trigger and the option list.
 *
 * Native <select> options can't be styled with custom fonts in most browsers,
 * so this rolls a small custom <button> + popup pattern instead.
 */

const SpanishFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 3 2"
    style={{ display: "inline-block", verticalAlign: "middle" }}
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
    style={{ display: "inline-block", verticalAlign: "middle" }}
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
  { code: "es", label: "ES", Flag: SpanishFlag },
  { code: "en", label: "EN", Flag: UKFlag },
] as const;

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const current = (i18n.resolvedLanguage || "es").split("-")[0];
  const currentLang = LANGS.find((l) => l.code === current) || LANGS[0];

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative" }}
      title={t("language.label")}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={triggerStyle}
        aria-label={t("language.label")}
        aria-expanded={open}
      >
        <currentLang.Flag />
        <span>{currentLang.label}</span>
        <span style={{ fontSize: "0.7rem", marginLeft: "0.1rem" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.3rem)",
            right: 0,
            minWidth: "100%",
            backgroundColor: "#1a1a1a",
            border: "2px solid #ffcc00",
            boxShadow:
              "3px 3px 0 rgba(0,0,0,0.85), 0 0 8px rgba(255,204,0,0.25)",
            zIndex: 1500,
            overflow: "hidden",
          }}
        >
          {LANGS.map(({ code, label, Flag }) => {
            const isActive = code === current;
            return (
              <button
                key={code}
                type="button"
                onClick={() => change(code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.4rem 0.7rem",
                  backgroundColor: isActive ? "rgba(255,204,0,0.15)" : "transparent",
                  color: isActive ? "#ffcc00" : "#f0f0f0",
                  border: "none",
                  borderBottom: code === LANGS[LANGS.length - 1].code ? "none" : "1px solid #333",
                  fontFamily: "MiFuente2, MiFuente, cursive",
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,204,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? "rgba(255,204,0,0.15)"
                    : "transparent";
                }}
              >
                <Flag />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
