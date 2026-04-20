import { useTranslation } from "react-i18next";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Language switcher dropdown.
 *
 * IMPORTANT: uses `renderMenuOnMount` + inline portal styling so the dropdown
 * menu escapes the navbar container. Without this, the menu gets clipped /
 * unclickable outside the dark navbar area on some browsers.
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

      {/*
        popperConfig.strategy="fixed" makes the menu render in the viewport,
        not clipped by the navbar's bounding box or z-index stack.
      */}
      <Dropdown.Menu
        renderOnMount
        popperConfig={{ strategy: "fixed" }}
        style={{
          minWidth: "10rem",
          zIndex: 2000,
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
