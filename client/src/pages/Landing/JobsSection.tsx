import { Link } from "react-router-dom";
import profiles from "../../data/profiles.json";
import professions from "../../data/professions.json";
import cities from "../../data/cities.json";
import regions from "../../data/regions.json";
import { useTranslation } from "react-i18next";
import { MapPin, Star, ArrowRight, Sparkles, Users } from "lucide-react";

export default function JobsSection() {
  const { t, i18n } = useTranslation();
  const topProfiles = profiles.slice(0, 6);

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return "0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-orange-100/30 via-transparent to-amber-100/30"></div>
        <div className="absolute top-1/4 left-1/4 h-80 w-80 animate-pulse rounded-full bg-orange-200/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-200/20 blur-3xl delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <Users size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.topProfessionals.badge")}
            </span>
            <Sparkles size={18} className="animate-spin" />
          </div>

          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl">
            {t("landing.topProfessionals.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            {t("landing.topProfessionals.subtitle")}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topProfiles.map((profile, index) => {
            const professionData = professions.find(
              (p) => p.id === profile.profession_id,
            );

            const cityData = cities.find((c) => c.id === profile.city_id);
            const regionData = cityData
              ? regions.find((r) => r.id === cityData.region_id)
              : null;

            const averageRating = calculateAverageRating(profile.reviews);
            const ratingNumber = parseFloat(averageRating);
            const fullStars = Math.floor(ratingNumber);
            const hasHalfStar = ratingNumber % 1 >= 0.5;

            return (
              <Link
                to={`/profile/${profile.id}`}
                key={profile.id}
                className="group relative transform rounded-3xl border-2 border-orange-100/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:border-orange-200 hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/10 to-amber-400/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

                <div className="relative mb-6">
                  <div className="relative mx-auto h-24 w-24">
                    <img
                      src={profile.image}
                      alt={profile.fullName[i18n.language as "ar" | "fr"]}
                      className="h-full w-full rounded-2xl border-4 border-orange-200/60 object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-orange-300"
                    />
                    <div className="absolute -right-2 -bottom-2 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 p-2 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Star size={16} className="fill-current" />
                    </div>
                  </div>
                </div>

                <div className="relative text-center">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                    {profile.fullName[i18n.language as "ar" | "fr"]}
                  </h3>

                  <p className="mb-3 font-semibold text-orange-600">
                    {professionData?.title[i18n.language as "ar" | "fr"] || "—"}
                  </p>

                  <div className="mb-4 flex items-center justify-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-orange-500" />
                    <span className="text-sm">
                      {cityData?.[i18n.language as "ar" | "fr"] || "—"}
                      {regionData &&
                        `, ${regionData[i18n.language as "ar" | "fr"]}`}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < fullStars
                            ? "fill-current text-yellow-400"
                            : i === fullStars && hasHalfStar
                              ? "fill-current text-yellow-400 opacity-50"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {averageRating === "0" ? "—" : averageRating}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-all duration-300 group-hover:gap-3">
                    {t("common.viewProfile")}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/profiles"
            className="group relative inline-flex transform items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-10 py-5 font-bold text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:from-orange-700 hover:to-amber-700 hover:shadow-orange-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <Users
              size={20}
              className="relative transition-transform duration-300 group-hover:scale-110"
            />
            <span className="relative">
              {t("landing.topProfessionals.viewAll")}
            </span>
            <ArrowRight
              size={20}
              className="relative transition-transform duration-300 group-hover:translate-x-1"
            />
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
