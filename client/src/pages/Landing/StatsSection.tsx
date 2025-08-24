import { useTranslation } from "react-i18next";
import { Users, Wrench, MapPin, Star } from "lucide-react";
import { useMemo } from "react";

import professionsData from "../../data/professions.json";
import profilesData from "../../data/profiles.json";
import regionsData from "../../data/regions.json";

export default function StatsSection() {
  const { t } = useTranslation();

  const realStats = useMemo(() => {
    const totalProfiles = profilesData.length;
    const totalProfessions = professionsData.length;
    const totalRegions = regionsData.length;

    const allReviews = profilesData.flatMap((profile) => profile.reviews || []);
    const averageRating =
      allReviews.length > 0
        ? (
            allReviews.reduce((sum, review) => sum + review.rating, 0) /
            allReviews.length
          ).toFixed(1)
        : "4.8";

    return {
      profiles: totalProfiles,
      professions: totalProfessions,
      regions: totalRegions,
      rating: averageRating,
    };
  }, []);

  const stats = [
    {
      icon: Users,
      number: `${realStats.profiles}+`,
      label: t("landing.stats.artisans"),
    },
    {
      icon: Wrench,
      number: `${realStats.professions}+`,
      label: t("landing.stats.professions"),
    },
    {
      icon: MapPin,
      number: realStats.regions,
      label: t("landing.stats.regions"),
    },
    {
      icon: Star,
      number: realStats.rating,
      label: t("landing.stats.rating"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {t("landing.stats.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700 md:text-xl">
            {t("landing.stats.subtitle")}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className="rounded-3xl border-2 border-orange-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl">
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 transition-transform duration-300 group-hover:scale-110">
                    <IconComponent size={36} className="text-orange-600" />
                  </div>

                  <div className="mb-3 text-4xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-orange-600 md:text-5xl">
                    {stat.number}
                  </div>

                  <div className="text-sm leading-tight font-semibold text-gray-600 md:text-base">
                    {stat.label}
                  </div>

                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="mb-6 text-lg text-gray-600">{t("landing.stats.cta")}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="inline-flex transform items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-orange-700 hover:to-amber-700 hover:shadow-xl"
            >
              {t("register.title")}
            </a>
            <a
              href="/profiles"
              className="inline-flex transform items-center justify-center rounded-xl border-2 border-orange-600 bg-white px-8 py-4 font-semibold text-orange-600 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl"
            >
              {t("navbar.profiles")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
