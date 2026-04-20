import { useTranslation } from "react-i18next";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Simple dropdown to switch between available languages.
 * The choice is persisted in localStorage (by i18next-browser-languagedetector).
 */
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = i18n.resolvedLanguage || "es";
  // Show just the base language code (e.g. "es-ES" → "ES")
  const display = current.split("-")[0].toUpperCase();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="outline-light"
        size="sm"
        title={t("language.label")}
        style={{ marginRight: "0.5rem", fontSize: "0.85rem" }}
      >
        🌐 {display}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => changeLanguage("es")}
          active={current.startsWith("es")}
        >
          🇪🇸 {t("language.spanish")}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => changeLanguage("en")}
          active={current.startsWith("en")}
        >
          🇬🇧 {t("language.english")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
