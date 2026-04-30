import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es.json";
import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";

/**
 * i18n setup.
 *
 * SUPPORTED LANGUAGES (6):
 *   - es: Español (default fallback)
 *   - en: English
 *   - de: Deutsch
 *   - fr: Français
 *   - it: Italiano
 *   - pt: Português
 *
 * BROWSER DETECTION:
 * The detector inspects the user's browser language on first visit
 * (e.g. "de-DE" → "de"). After that, the choice is persisted in
 * localStorage so subsequent visits remember the language.
 *
 * Detection priority order:
 *   1. localStorage (the user's previously chosen language)
 *   2. navigator (browser's preferred language)
 *
 * If the detected language isn't in supportedLngs, we fall back to "es".
 *
 * GRAFFITI TERMS:
 * Words like "sketch battle", "wildstyle", "tag", "throw-up", "judges",
 * "deadline", "voting", and "sponsors" are intentionally kept in English
 * across ALL languages, because that's how they're used in the actual
 * graffiti/hip-hop scene worldwide.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      pt: { translation: pt },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "en", "de", "fr", "it", "pt"],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
