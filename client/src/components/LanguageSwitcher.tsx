import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = (i18n.resolvedLanguage || "es").split("-")[0];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      title={t("language.label")}
      aria-label={t("language.label")}
      style={{
        backgroundColor: "transparent",
        color: "white",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: "0.25rem",
        padding: "0.25rem 0.5rem",
        fontSize: "0.85rem",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <option value="es" style={{ color: "black" }}>
        🌐 ES
      </option>
      <option value="en" style={{ color: "black" }}>
        🌐 EN
      </option>
    </select>
  );
};

export default LanguageSwitcher;