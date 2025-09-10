import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import MainLayout from "./layouts/MainLayout";
import professions from "../data/artisan-professions.json";
import categories from "../data/artisan-categories.json";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";

export default function ProfessionsPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const lang = i18n.language as "ar" | "fr";

  const { filteredProfessions, selectedCategory } = useMemo(() => {
    if (!categoryId) {
      return { filteredProfessions: professions, selectedCategory: null };
    }

    const category = categories.find(cat => cat.id === parseInt(categoryId));
    if (!category) {
      return { filteredProfessions: professions, selectedCategory: null };
    }

    const filtered = professions.filter(profession => 
      category.professionIds.includes(profession.id)
    );

    return { filteredProfessions: filtered, selectedCategory: category };
  }, [categoryId]);

  const pageTitle = selectedCategory 
    ? selectedCategory.name[lang]
    : t("professions.title", "جميع المهن");

  const pageDescription = selectedCategory
    ? selectedCategory.description[lang]
    : t("professions.description", "استكشف جميع المهن المتوفرة على منصتنا");

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 h-32 w-32 animate-pulse rounded-full bg-orange-200/30 blur-2xl"></div>
          <div className="absolute right-1/4 bottom-20 h-40 w-40 animate-pulse rounded-full bg-amber-200/30 blur-2xl delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Header */}
          <div className="mb-16 text-center">
            {selectedCategory && (
              <div className="mb-6 flex items-center justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600"
                >
                  <ArrowLeft size={16} />
                  {t("common.backToHome", "العودة للرئيسية")}
                </Link>
              </div>
            )}

            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-6 py-3 text-sm font-medium text-orange-700 shadow-lg">
              {selectedCategory ? (
                <>
                  <span className="text-lg">{selectedCategory.icon}</span>
                  {t("professions.categoryBadge", "فئة")}
                </>
              ) : (
                <>
                  <Filter size={16} />
                  {t("professions.allBadge", "جميع المهن")}
                </>
              )}
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-4xl font-black text-transparent md:text-6xl">
              {pageTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              {pageDescription}
            </p>

            {selectedCategory && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                <span>{filteredProfessions.length}</span>
                {t("professions.professionsCount", "مهنة متوفرة")}
              </div>
            )}
          </div>

          {/* Professions Grid */}
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProfessions.map((profession, index) => (
                <Link
                  key={profession.id}
                  to={`/profession/${profession.id}`}
                  className="group relative transform transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-3xl border-2 border-transparent bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-500 hover:border-orange-200 hover:shadow-2xl">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

                    {/* Image container */}
                    <div className="relative mb-6">
                      <div className="relative mx-auto h-24 w-24">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-20 transition-opacity duration-300 group-hover:opacity-40"></div>
                        <img
                          src={profession.image}
                          alt={profession.title[lang]}
                          className="relative h-full w-full rounded-2xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Sparkle effect */}
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <span className="text-xs text-white">✨</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="relative text-center">
                      <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                        {profession.title[lang]}
                      </h3>
                      {/* Underline effect */}
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 group-hover:w-full"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty state */}
            {filteredProfessions.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {t("professions.noResults", "لا توجد مهن")}
                </h3>
                <p className="text-gray-600">
                  {t("professions.noResultsDescription", "لم يتم العثور على مهن في هذه الفئة")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
