import { ArrowLeft, Filter, ChevronRight, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import categories from "../data/artisan-categories.json";
import professions from "../data/artisan-professions.json";
import profilesData from "../data/artisan-profiles.json";
import cities from "../data/moroccan-cities.json";
import regions from "../data/moroccan-regions.json";

type Profile = (typeof profilesData)[number];

export default function ProfessionsPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const regionParam = Number(searchParams.get("region") || 0);
  const cityParam = Number(searchParams.get("city") || 0);
  const lang = i18n.language as "ar" | "fr";

  const { filteredProfessions, selectedCategory, professionCounts } = useMemo(() => {
    const regionIsValid = regionParam && regions.some((r) => r.id === regionParam);
    const cityIsValid = cityParam && cities.some((c) => c.id === cityParam);

    let baseArea = profilesData as typeof profilesData;

    if (regionIsValid) {
      const regionCities = cities.filter((c) => c.region_id === regionParam);
      baseArea = baseArea.filter((p) =>
        regionCities.some(
          (city) =>
            p.address.ar.includes(city.ar) || p.address.fr.includes(city.fr),
        ),
      );
    }

    if (cityIsValid) {
      const selectedCity = cities.find((c) => c.id === cityParam);
      if (selectedCity) {
        baseArea = baseArea.filter(
          (p) =>
            p.address.ar.includes(selectedCity.ar) ||
            p.address.fr.includes(selectedCity.fr),
        );
      }
    }

    const professionCountsMap = new Map<number, number>();
    baseArea.forEach((p: Profile) => {
      const id = p.professionId as number;
      professionCountsMap.set(id, (professionCountsMap.get(id) || 0) + 1);
    });

    let selectedCategoryLocal: (typeof categories)[number] | null = null;
    let list = professions as typeof professions;

    if (categoryId) {
      const category = categories.find((cat) => cat.id === parseInt(categoryId));
      if (category) {
        selectedCategoryLocal = category;
        list = list.filter((profession) =>
          category.professionIds.includes(profession.id),
        );
      }
    }

    if (regionIsValid || cityIsValid) {
      list = list.filter((profession) => professionCountsMap.get(profession.id));
    }

    return {
      filteredProfessions: list,
      selectedCategory: selectedCategoryLocal,
      professionCounts: professionCountsMap,
    };
  }, [categoryId, regionParam, cityParam]);

  const pageTitle = selectedCategory 
    ? selectedCategory.name[lang]
    : t("professions.title");

  const pageDescription = selectedCategory
    ? selectedCategory.description[lang]
    : t("professions.description");

  return (
    <MainLayout>
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="absolute inset-0">
          <div className="absolute rounded-full top-1/4 left-1/4 h-80 w-80 animate-pulse bg-orange-300/20 blur-3xl"></div>
          <div className="absolute delay-1000 rounded-full right-1/4 bottom-1/4 h-72 w-72 animate-pulse bg-amber-300/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="mb-16 text-center">
            {selectedCategory && (
              <div className="flex items-center justify-center mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-all rounded-full shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white hover:text-orange-600"
                >
                  <ArrowLeft size={16} />
                  {t("common.backToHome")}
                </Link>
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 text-sm font-semibold text-orange-700 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm">
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

            <h1 className="mb-4 text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text md:text-5xl">
              {pageTitle}
            </h1>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-700">
              {pageDescription}
            </p>

            {selectedCategory && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mt-6 text-sm font-medium text-orange-700 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
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
                  className="relative block group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl hover:border-orange-200 hover:-translate-y-1">
                    <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-br from-orange-50/0 to-amber-50/0 group-hover:from-orange-50/50 group-hover:to-amber-50/30"></div>

                    <div className="relative p-6 pb-4">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 transition-opacity duration-300 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-10 group-hover:opacity-30"></div>
                        <img
                          src={profession.image}
                          alt={profession.title[lang]}
                          className="relative object-cover w-full h-full transition-transform duration-300 rounded-xl group-hover:scale-105"
                        />
                        <div className="absolute -top-2 -right-2 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                          <Users size={12} className="text-orange-600" />
                          <span>{professionCounts.get(profession.id) || 0}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="mb-1 font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600 line-clamp-1">
                          {profession.title[lang]}
                        </h3>
                      </div>
                    </div>

                    <div className="p-3 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-orange-600 transition-colors group-hover:text-orange-700">
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
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-white border-2 border-gray-200 rounded-full">
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
