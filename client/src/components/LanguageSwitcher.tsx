import { useTranslation } from "react-i18next";

/**
 * Language switcher with real flags rendered as inline SVG.
 * Using SVG instead of emoji flags so they display correctly on Windows too.
 */

const SpanishFlag = () => (
  <svg width="20" height="14" viewBox="0 0 3 2" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <rect width="3" height="2" fill="#c60b1e" />
    <rect width="3" height="1" y="0.5" fill="#ffc400" />
  </svg>
);

const UKFlag = () => (
  <svg width="20" height="14" viewBox="0 0 60 30" style={{ display: "inline-block", verticalAlign: "middle" }}>
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

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = (i18n.resolvedLanguage || "es").split("-")[0];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
      title={t("language.label")}
    >
      {current === "en" ? <UKFlag /> : <SpanishFlag />}
      <select
        value={current}
        onChange={handleChange}
        aria-label={t("language.label")}
        style={{
          backgroundColor: "transparent",
          color: "white",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: "0.25rem",
          padding: "0.2rem 0.4rem",
          fontSize: "0.8rem",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="es" style={{ color: "black" }}>ES</option>
        <option value="en" style={{ color: "black" }}>EN</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
