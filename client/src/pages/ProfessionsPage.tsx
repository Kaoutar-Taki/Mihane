import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import MainLayout from "./layouts/MainLayout";
import professions from "../data/artisan-professions.json";
import profilesData from "../data/artisan-profiles.json";
import categories from "../data/artisan-categories.json";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, ChevronRight, Users } from "lucide-react";

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

  const professionCounts = useMemo(() => {
    const map = new Map<number, number>();
    (profilesData as any[]).forEach((p: any) => {
      const id = p.professionId as number;
      map.set(id, (map.get(id) || 0) + 1);
    });
    return map;
  }, []);

  const pageTitle = selectedCategory 
    ? selectedCategory.name[lang]
    : t("professions.title");

  const pageDescription = selectedCategory
    ? selectedCategory.description[lang]
    : t("professions.description");

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-80 w-80 animate-pulse rounded-full bg-orange-300/20 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-amber-300/20 blur-3xl delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            {selectedCategory && (
              <div className="mb-6 flex items-center justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600"
                >
                  <ArrowLeft size={16} />
                  {t("common.backToHome")}
                </Link>
              </div>
            )}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-sm font-semibold text-orange-700 backdrop-blur-sm">
              {selectedCategory ? (
                <>
                  <span className="text-lg">{selectedCategory.icon}</span>
                  {t("professions.categoryBadge")}
                </>
              ) : (
                <>
                  <Filter size={16} />
                  {t("professions.allBadge")}
                </>
              )}
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
              {pageTitle}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700">
              {pageDescription}
            </p>

            {selectedCategory && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-orange-700 shadow-lg backdrop-blur-sm">
                <span>{filteredProfessions.length}</span>
                {t("professions.professionsCount")}
              </div>
            )}
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProfessions.map((profession, index) => (
                <Link
                  key={profession.id}
                  to={`/profession/${profession.id}`}
                  className="group relative block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-amber-50/0 transition-all duration-300 group-hover:from-orange-50/50 group-hover:to-amber-50/30"></div>

                    <div className="relative p-6 pb-4">
                      <div className="relative mx-auto h-20 w-20 mb-4">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-10 transition-opacity duration-300 group-hover:opacity-30"></div>
                        <img
                          src={profession.image}
                          alt={profession.title[lang]}
                          className="relative h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute -top-2 -right-2 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                          <Users size={12} className="text-orange-600" />
                          <span>{professionCounts.get(profession.id) || 0}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                          {profession.title[lang]}
                        </h3>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 p-3">
                      <div className="flex items-center justify-center gap-2 text-sm text-orange-600 font-medium group-hover:text-orange-700 transition-colors">
                        <span>{t("common.viewMore")}</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProfessions.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {t("professions.noResults")}
                </h3>
                <p className="text-gray-600">
                  {t("professions.noResultsDescription")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
