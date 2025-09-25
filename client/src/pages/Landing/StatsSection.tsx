import { useTranslation } from "react-i18next";
import {
  Users,
  Wrench,
  MapPin,
  Sparkles,
  BarChart3,
  UserCheck,
  Award,
} from "lucide-react";
import { useMemo } from "react";
import profilesData from "@/data/artisan-profiles.json";
import usersData from "@/data/platform-users.json";
import reviewsData from "@/data/artisan-reviews.json";

export default function StatsSection() {
  const { t } = useTranslation();

  const realStats = useMemo(() => {
    const artisanUsers = usersData.filter(
      (user) => user.role === "ARTISAN" && user.isActive,
    );
    const totalArtisans = artisanUsers.length;
    const activeCityIds = new Set(
      usersData.filter((user) => user.isActive).map((user) => user.cityId),
    );
    const totalActiveCities = activeCityIds.size;

    const activeProfessionIds = new Set(
      profilesData.map((profile) => profile.professionId),
    );
    const totalActiveProfessions = activeProfessionIds.size;

    const activeUsers = usersData.filter((user) => user.isActive);
    const totalActiveUsers = activeUsers.length;

    const approvedReviews = reviewsData.filter(
      (review) => review.status === "APPROVED",
    );
    const averageRating =
      approvedReviews.length > 0
        ? (
            approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
            approvedReviews.length
          ).toFixed(1)
        : "4.8";

    return {
      artisans: totalArtisans,
      professions: totalActiveProfessions,
      cities: totalActiveCities,
      activeUsers: totalActiveUsers,
      rating: averageRating,
    };
  }, []);

  const stats = [
    {
      icon: Users,
      number: `${realStats.artisans}+`,
      label: t("landing.stats.artisans"),
      description: t("landing.stats.artisansDesc"),
    },
    {
      icon: Wrench,
      number: `${realStats.professions}+`,
      label: t("landing.stats.professions"),
      description: t("landing.stats.professionsDesc"),
    },
    {
      icon: MapPin,
      number: `${realStats.cities}+`,
      label: t("landing.stats.cities"),
      description: t("landing.stats.citiesDesc"),
    },
    {
      icon: UserCheck,
      number: `${realStats.activeUsers}+`,
      label: t("landing.stats.activeUsers"),
      description: t("landing.stats.activeUsersDesc"),
    },
    {
      icon: Award,
      number: `${realStats.rating}/5`,
      label: t("landing.stats.rating"),
      description: t("landing.stats.ratingDesc"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
      <div className="absolute top-0 left-1/4 h-72 w-72 animate-pulse rounded-full bg-orange-200/20 blur-3xl"></div>
      <div
        className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-amber-200/20 blur-3xl"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 h-64 w-64 animate-bounce rounded-full bg-yellow-200/15 blur-2xl"
        style={{ animationDelay: "2s", animationDuration: "3s" }}
      ></div>
      <div className="absolute top-20 right-20 h-4 w-4 animate-ping rounded-full bg-orange-400/30"></div>
      <div
        className="absolute bottom-32 left-16 h-3 w-3 animate-ping rounded-full bg-amber-400/40"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-40 left-1/3 h-2 w-2 animate-ping rounded-full bg-yellow-400/50"
        style={{ animationDelay: "3s" }}
      ></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <BarChart3 size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.stats.badge")}
            </span>
            <Sparkles size={18} className="animate-spin" />
          </div>

          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {t("landing.stats.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700 md:text-xl">
            {t("landing.stats.subtitle")}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="group">
                <div className="relative rounded-2xl border border-orange-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-orange-300 hover:bg-white/90 hover:shadow-2xl">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/5 to-amber-400/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                  <div className="relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-200/20 to-amber-200/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <IconComponent
                      size={28}
                      className="relative text-orange-600 transition-all duration-300 group-hover:text-orange-700"
                    />
                  </div>

                  <div className="relative mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-3xl font-bold text-transparent transition-all duration-300 group-hover:from-orange-700 group-hover:to-amber-700 md:text-4xl">
                    {stat.number}
                  </div>

                  <div className="mb-2 text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                    {stat.label}
                  </div>

                  <div className="text-xs leading-relaxed text-orange-600/80 transition-colors duration-300 group-hover:text-orange-700/90">
                    {stat.description}
                  </div>

                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 opacity-20 transition-opacity duration-300 group-hover:opacity-60"></div>
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
