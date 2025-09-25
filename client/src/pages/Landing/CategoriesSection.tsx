import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, Grid3X3 } from "lucide-react";
import { useMemo } from "react";
import categoriesData from "@/data/artisan-categories.json";
import professionsData from "@/data/artisan-professions.json";

export default function CategoriesSection() {
  const { t, i18n } = useTranslation();

  const activeCategories = useMemo(() => {
    return categoriesData
      .filter((category) => category.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, []);

  const getCategoryProfessionCount = (professionIds: number[]) => {
    return professionIds.filter((id) =>
      professionsData.some((profession) => profession.id === id),
    ).length;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 animate-pulse rounded-full bg-orange-200/20 blur-3xl"></div>
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-200/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 h-64 w-64 animate-bounce rounded-full bg-yellow-200/15 blur-2xl"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        ></div>
      </div>

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
            <Grid3X3 size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.categories.badge")}
            </span>
            <Sparkles size={18} className="animate-spin" />
          </div>

          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl">
            {t("landing.categories.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            {t("landing.categories.subtitle")}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activeCategories.slice(0, 3).map((category, index) => {
            const professionCount = getCategoryProfessionCount(
              category.professionIds,
            );

            return (
              <Link
                to={`/professions?category=${category.id}`}
                key={category.id}
                className="group relative transform rounded-3xl border-2 border-orange-100/50 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-4 hover:border-orange-300 hover:bg-white/95 hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/5 to-amber-400/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"></div>

                <div className="relative mb-6 text-center">
                  <div
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{
                      backgroundColor: category.color + "20",
                      border: `3px solid ${category.color}40`,
                    }}
                  >
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                </div>

                <div className="relative text-center">
                  <h3 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-orange-600 group-hover:to-amber-600">
                    {category.name[i18n.language as "ar" | "fr"]}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {category.description[i18n.language as "ar" | "fr"]}
                  </p>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 text-sm font-medium text-orange-700">
                    <span>{professionCount}</span>
                    <span>{t("landing.categories.professions")}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-sm font-semibold text-transparent transition-all duration-300 group-hover:gap-3 group-hover:from-orange-700 group-hover:to-amber-700">
                    {t("landing.categories.explore")}
                    <ArrowRight
                      size={16}
                      className="text-orange-600 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-orange-700"
                    />
                  </div>
                </div>

                <div
                  className="absolute top-3 right-3 h-3 w-3 rounded-full opacity-20 transition-all duration-300 group-hover:scale-125 group-hover:opacity-80"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/categories"
            className="group relative inline-flex transform items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-10 py-5 font-bold text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:from-orange-700 hover:to-amber-700 hover:shadow-orange-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <Grid3X3
              size={20}
              className="relative transition-transform duration-300 group-hover:scale-110"
            />
            <span className="relative">{t("landing.categories.viewAll")}</span>
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
