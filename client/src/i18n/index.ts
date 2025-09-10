import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "../locales/ar.json";
import fr from "../locales/fr.json";

export const SUPPORTED_LANGS = ["ar", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const STORAGE_KEY = "lang";

function detectInitialLang(): Lang {
  const saved = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
  if (SUPPORTED_LANGS.includes(saved as Lang)) return saved as Lang;

  const nav = (navigator.language || "ar").toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  return "ar"; // Default to Arabic
}

function applyDirFor(lang: Lang) {
  const isRTL = lang === "ar";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

i18n
  .use(initReactI18next)
  .init({
    lng: detectInitialLang(),
    fallbackLng: "ar",
    resources: {
      ar: { translation: ar },
      fr: { translation: fr },
    },
    interpolation: { escapeValue: false },
  });

applyDirFor(i18n.language as Lang);

i18n.on("languageChanged", (lng) => {
  const next = (lng || "ar").toLowerCase() as Lang;
  localStorage.setItem(STORAGE_KEY, next);
  applyDirFor(next);
});

export default i18n;
