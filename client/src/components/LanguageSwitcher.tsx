import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type Props = { className?: string };

export default function LanguageSwitcher({ className = "" }: Props) {
  const { i18n } = useTranslation();
  const current: "ar" | "fr" = i18n.language === "fr" ? "fr" : "ar";

  useEffect(() => {
    const saved = localStorage.getItem("lang") as "ar" | "fr" | null;
    const initial = saved ?? current;
    if (saved && saved !== current) i18n.changeLanguage(saved);
    document.documentElement.dir = i18n.dir(initial);
  }, []);

  const setLang = (lang: "ar" | "fr") => {
    if (lang === current) return;
    i18n.changeLanguage(lang);
    document.documentElement.dir = i18n.dir(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div
      role="tablist"
      aria-label="Language switcher"
      className={`inline-flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-sm ${className}`}
    >
      <button
        type="button"
        role="tab"
        aria-pressed={current === "ar"}
        onClick={() => setLang("ar")}
        className={`focus-visible:ring-primary rounded-full px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          current === "ar"
            ? "bg-primary text-white shadow"
            : "hover:text-primary text-gray-600"
        }`}
      >
        <span className="mr-1">🇲🇦</span> العربية
      </button>

      <button
        type="button"
        role="tab"
        aria-pressed={current === "fr"}
        onClick={() => setLang("fr")}
        className={`focus-visible:ring-primary rounded-full px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          current === "fr"
            ? "bg-primary text-white shadow"
            : "hover:text-primary text-gray-600"
        }`}
      >
        <span className="mr-1">🇫🇷</span> Français
      </button>
    </div>
  );
}
