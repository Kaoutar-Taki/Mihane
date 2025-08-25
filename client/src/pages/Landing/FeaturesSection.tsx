import { useTranslation } from "react-i18next";
import {
  Shield,
  Clock,
  Users,
  Search,
  Star,
  MapPin,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("landing.features.trust.title"),
      description: t("landing.features.trust.desc"),
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Clock,
      title: t("landing.features.speed.title"),
      description: t("landing.features.speed.desc"),
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Search,
      title: t("landing.features.search.title"),
      description: t("landing.features.search.desc"),
      color: "from-orange-600 to-red-500",
    },
    {
      icon: Star,
      title: t("landing.features.quality.title"),
      description: t("landing.features.quality.desc"),
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: MapPin,
      title: t("landing.features.coverage.title"),
      description: t("landing.features.coverage.desc"),
      color: "from-amber-600 to-orange-600",
    },
    {
      icon: Users,
      title: t("landing.features.community.title"),
      description: t("landing.features.community.desc"),
      color: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/20 to-amber-50/20 py-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-orange-100/20 via-transparent to-amber-100/20"></div>
        <div className="absolute top-1/3 right-1/4 h-64 w-64 animate-pulse rounded-full bg-orange-200/15 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 h-80 w-80 animate-pulse rounded-full bg-amber-200/15 blur-3xl delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <CheckCircle size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.features.badge")}
            </span>
            <Sparkles size={18} className="animate-spin" />
          </div>

          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl">
            {t("landing.features.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            {t("landing.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative transform rounded-3xl border-2 border-orange-100/50 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:border-orange-200 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/10 to-amber-400/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

                <div className="relative">
                  <div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <IconComponent size={28} className="text-white" />
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed text-gray-700">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-orange-100/60 to-amber-100/60 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              {t("landing.features.cta.title")}
            </h3>
            <p className="mb-6 text-gray-700">
              {t("landing.features.cta.subtitle")}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="inline-flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-amber-700 hover:shadow-xl"
              >
                <Users size={20} />
                {t("register.title")}
              </a>
              <a
                href="/profiles"
                className="inline-flex transform items-center justify-center gap-2 rounded-xl border-2 border-orange-600 bg-white px-8 py-4 font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl"
              >
                <Search size={20} />
                {t("navbar.profiles")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
