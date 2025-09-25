import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, UserPlus, Sparkles, Star, Users } from "lucide-react";
import { useStats } from "@/hooks";

export default function CTASection() {
  const { t } = useTranslation();
  const { stats } = useStats();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 py-24">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/20"></div>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-400/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-orange-300/30 blur-3xl delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 animate-spin rounded-full bg-amber-400/10 blur-2xl" style={{ animationDuration: '20s' }}></div>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-bounce">
          <Sparkles size={24} className="text-yellow-300/60" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce delay-500">
          <Star size={20} className="text-orange-200/50" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-1000">
          <Sparkles size={16} className="text-amber-200/40" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/20 px-6 py-3 text-white backdrop-blur-sm">
          <Users size={18} className="animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            {t("landing.cta.badge")}
          </span>
          <Sparkles size={18} className="animate-spin" />
        </div>
        
        <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
          {t("landing.cta.title")}
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90">
          {t("landing.cta.subtitle")}
        </p>
        
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            to="/register"
            className="group relative inline-flex transform items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-5 font-bold text-orange-600 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-white/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <UserPlus size={20} className="relative transition-transform duration-300 group-hover:scale-110" />
            <span className="relative">{t("landing.cta.joinNow")}</span>
            <ArrowRight size={20} className="relative transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-orange-400 opacity-0 group-hover:opacity-100"></div>
          </Link>
          
          <Link
            to="/profiles"
            className="group relative inline-flex transform items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-white/80 px-10 py-5 font-bold text-white backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:border-white hover:bg-white/10"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <Users size={20} className="relative transition-transform duration-300 group-hover:scale-110" />
            <span className="relative">{t("landing.cta.browseProfessionals")}</span>
            <ArrowRight size={20} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/70">
          <div className="flex items-center gap-2">
            <Star className="fill-current text-yellow-300" size={16} />
            <span className="text-sm font-medium">
              {stats.craftsmen.total} {t("landing.cta.trustIndicators.professionals")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span className="text-sm font-medium">
              {stats.professions.total} {t("landing.cta.trustIndicators.professions")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-sm font-medium">
              {stats.regions.total} {t("landing.cta.trustIndicators.regions")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
