import { useTranslation } from "react-i18next";
import { Sparkles, Star } from "lucide-react";
import LandingSearch from "./LandingSearch";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 md:py-28">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-orange-100/30 via-transparent to-amber-100/30"></div>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-300/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-amber-300/20 blur-3xl delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-yellow-300/20 blur-3xl delay-500"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-2 w-2 animate-bounce rounded-full bg-orange-400/60 delay-0"></div>
        <div className="absolute top-40 right-20 h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400/60 delay-300"></div>
        <div className="absolute bottom-32 left-1/4 h-1 w-1 animate-bounce rounded-full bg-yellow-400/60 delay-700"></div>
        <div className="absolute right-1/3 bottom-20 h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400/60 delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <Sparkles size={18} className="animate-spin" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.hero.badge")}
            </span>
            <Star size={18} className="animate-pulse" />
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-5xl leading-tight font-black text-transparent md:text-7xl">
            {t("landing.title")}
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl">
            {t("landing.subtitle")}
          </p>
        </div>

        <div className="group relative mx-auto max-w-5xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

          <div className="hover:shadow-3xl relative rounded-3xl border-2 border-orange-200/50 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-orange-300/70 md:p-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/0 via-orange-500/30 to-orange-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

            <LandingSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
