import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import MainLayout from "./layouts/MainLayout";
import categoriesData from "../data/artisan-categories.json";
import professionsData from "../data/artisan-professions.json";
import { ArrowRight, Grid3X3, ArrowLeft } from "lucide-react";

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";

  // Get active categories sorted by displayOrder
  const activeCategories = useMemo(() => {
    return categoriesData
      .filter((category) => category.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, []);

  // Get profession count for each category
  const getCategoryProfessionCount = (professionIds: number[]) => {
    return professionIds.filter((id) =>
      professionsData.some((profession) => profession.id === id)
    ).length;
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 h-32 w-32 animate-pulse rounded-full bg-orange-200/30 blur-2xl"></div>
          <div className="absolute right-1/4 bottom-20 h-40 w-40 animate-pulse rounded-full bg-amber-200/30 blur-2xl delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-yellow-200/15 blur-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 h-4 w-4 rounded-full bg-orange-400/30 animate-ping"></div>
        <div className="absolute bottom-32 left-16 h-3 w-3 rounded-full bg-amber-400/40 animate-ping" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600"
              >
                <ArrowLeft size={16} />
                {t("common.backToHome", "العودة للرئيسية")}
              </Link>
            </div>

            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
              <Grid3X3 size={18} className="animate-pulse" />
              <span className="text-sm font-semibold tracking-wider uppercase">
                {t("categories.allBadge", "جميع الفئات")}
              </span>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-black text-transparent md:text-6xl">
              {t("categories.title", "جميع الفئات")}
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
              {t("categories.description", "استكشف جميع الفئات المتوفرة على منصتنا")}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
              <span>{activeCategories.length}</span>
              {t("categories.categoriesCount", "فئة متوفرة")}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {activeCategories.map((category, index) => {
                const professionCount = getCategoryProfessionCount(category.professionIds);
                
                return (
                  <Link
                    to={`/professions?category=${category.id}`}
                    key={category.id}
                    className="group relative transform rounded-3xl border-2 border-orange-100/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-4 hover:border-orange-300 hover:shadow-2xl hover:bg-white/95"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glow effects */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/5 to-amber-400/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"></div>

                    {/* Category Icon */}
                    <div className="relative mb-6 text-center">
                      <div 
                        className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                        style={{ backgroundColor: category.color + '20', border: `3px solid ${category.color}40` }}
                      >
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="relative text-center">
                      <h3 className="mb-3 text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-300 group-hover:from-orange-600 group-hover:to-amber-600">
                        {category.name[lang]}
                      </h3>

                      <p className="mb-4 text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {category.description[lang]}
                      </p>

                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1 text-xs font-medium text-orange-700">
                        <span>{professionCount}</span>
                        <span>{t("landing.categories.professions", "مهن")}</span>
                      </div>

                      <div className="inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent transition-all duration-300 group-hover:gap-3 group-hover:from-orange-700 group-hover:to-amber-700">
                        {t("landing.categories.explore", "استكشف")}
                        <ArrowRight
                          size={14}
                          className="text-orange-600 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-orange-700"
                        />
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-3 right-3 h-3 w-3 rounded-full opacity-20 transition-all duration-300 group-hover:scale-125 group-hover:opacity-80" style={{ backgroundColor: category.color }}></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Link>
                );
              })}
            </div>

            {/* Empty state */}
            {activeCategories.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <Grid3X3 size={32} className="text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {t("categories.noResults", "لا توجد فئات")}
                </h3>
                <p className="text-gray-600">
                  {t("categories.noResultsDescription", "لم يتم العثور على فئات متاحة")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
