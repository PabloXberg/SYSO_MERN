import { useTranslation } from "react-i18next";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Compact language switcher that works in both desktop and mobile navbars.
 * - On mobile: shows only the globe icon + current language code (very narrow).
 * - Dropdown opens below, right-aligned, so it doesn't get cut off by screen edges.
 */
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const current = i18n.resolvedLanguage || "es";
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
        style={{
          fontSize: "0.75rem",
          padding: "0.25rem 0.5rem",
          minWidth: "auto",
          whiteSpace: "nowrap",
        }}
      >
        🌐 {display}
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{
          minWidth: "10rem",
          // Ensure menu stays on screen on small phones
          right: 0,
          left: "auto",
        }}
      >
        <Dropdown.Item
          onClick={() => changeLanguage("es")}
          active={current.startsWith("es")}
        >
          <span style={{ fontWeight: "bold", marginRight: "0.4rem" }}>ES</span>
          {t("language.spanish")}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => changeLanguage("en")}
          active={current.startsWith("en")}
        >
          <span style={{ fontWeight: "bold", marginRight: "0.4rem" }}>EN</span>
          {t("language.english")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
