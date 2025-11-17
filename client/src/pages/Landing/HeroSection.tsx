import { Sparkles, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import LandingSearch from "./LandingSearch";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 md:py-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/30 via-transparent to-amber-100/30 dark:from-slate-900/60 dark:via-transparent dark:to-slate-900/40"></div>
        <div className="absolute rounded-full top-1/4 left-1/4 h-72 w-72 md:h-96 md:w-96 animate-pulse bg-orange-300/20 blur-3xl"></div>
        <div className="absolute w-64 h-64 delay-1000 rounded-full right-1/4 bottom-1/4 md:h-80 md:w-80 animate-pulse bg-amber-300/20 blur-3xl"></div>
        <div className="absolute w-56 h-56 delay-500 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 md:h-64 md:w-64 animate-pulse bg-yellow-300/16 blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-2 h-2 rounded-full top-20 left-10 animate-bounce bg-orange-400/60 delay-0"></div>
        <div className="absolute top-40 right-20 h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400/60 delay-300"></div>
        <div className="absolute w-1 h-1 delay-700 rounded-full bottom-32 left-1/4 animate-bounce bg-yellow-400/60"></div>
        <div className="absolute right-1/3 bottom-20 h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400/60 delay-1000"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/20 px-5 py-2.5 text-orange-700 backdrop-blur-sm dark:from-orange-500/20 dark:to-amber-500/25">
            <Sparkles size={18} className="animate-spin" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.hero.badge")}
            </span>
            <Star size={18} className="animate-pulse" />
          </div>

          <h1 className="mb-4 text-4xl font-black leading-snug text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text md:mb-6 md:text-6xl md:leading-tight dark:from-orange-400 dark:via-amber-400 dark:to-orange-300">
            {t("landing.title")}
          </h1>
          <p className="max-w-3xl mx-auto mb-10 text-base leading-relaxed text-gray-700 md:text-xl md:leading-relaxed dark:text-slate-100">
            {t("landing.subtitle")}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto group">
          <div className="absolute inset-0 transition-opacity duration-500 opacity-0 rounded-3xl bg-gradient-to-r from-orange-400/20 to-amber-400/20 blur-xl group-hover:opacity-100"></div>

          <div className="relative p-4 transition-all duration-500 border-2 shadow-2xl rounded-3xl border-orange-200/50 bg-white/95 backdrop-blur-xl hover:border-orange-300/70 hover:shadow-3xl md:p-6 dark:border-slate-700 dark:bg-slate-900/95">
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 rounded-3xl bg-gradient-to-r from-orange-500/0 via-orange-500/25 to-orange-500/0 group-hover:opacity-100"></div>

            <LandingSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
