import { Link } from "react-router-dom";
import profiles from "../../data/profiles.json";
import professions from "../../data/professions.json";
import cities from "../../data/cities.json";
import regions from "../../data/regions.json";
import { useTranslation } from "react-i18next";
import { MapPin, Star, ArrowRight } from "lucide-react";

export default function JobsSection() {
  const { t, i18n } = useTranslation();
  const topProfiles = profiles.slice(0, 6);

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return "0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("landing.topProfessionals.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("landing.topProfessionals.subtitle")}
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topProfiles.map((profile) => {
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
                className="group transform rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative mb-6">
                  <img
                    src={profile.image}
                    alt={profile.fullName[i18n.language as "ar" | "fr"]}
                    className="border-primary/20 group-hover:border-primary/40 mx-auto h-20 w-20 rounded-2xl border-4 object-cover transition-colors duration-300"
                  />
                  <div className="bg-primary absolute -right-2 -bottom-2 rounded-full p-2 text-white shadow-lg">
                    <Star size={16} className="fill-current" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="group-hover:text-primary mb-2 text-xl font-bold text-gray-900 transition-colors duration-300">
                    {profile.fullName[i18n.language as "ar" | "fr"]}
                  </h3>

                  <p className="text-primary mb-3 font-semibold">
                    {professionData?.title[i18n.language as "ar" | "fr"] || "—"}
                  </p>

                  <div className="mb-4 flex items-center justify-center gap-2 text-gray-500">
                    <MapPin size={16} />
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
                        size={14}
                        className={`${
                          i < fullStars
                            ? "fill-current text-yellow-400"
                            : i === fullStars && hasHalfStar
                              ? "fill-current text-yellow-400 opacity-50"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {averageRating === "0" ? "—" : averageRating}
                    </span>
                  </div>

                  <div className="text-primary inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3">
                    {t("common.viewProfile")}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/profiles"
            className="bg-primary inline-flex transform items-center gap-3 rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl"
          >
            {t("landing.topProfessionals.viewAll")}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
