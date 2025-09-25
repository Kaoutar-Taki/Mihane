import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../pages/layouts/MainLayout";
import cities from "../data/moroccan-cities.json";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";
import regions from "../data/moroccan-regions.json";

export default function CityDetailsPage() {
  const { i18n, t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const lang = (i18n.language as "ar" | "fr") ?? "ar";
  const cityId = Number(id);

  const city = cities.find((c) => c.id === cityId);
  if (!city) {
    return (
      <MainLayout>
        <section className="py-16 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            {t("city.notFound", "المدينة غير موجودة")}
          </h1>
          <Link
            to="/cities"
            className="bg-primary mt-4 inline-block rounded-lg px-4 py-2 text-white hover:opacity-90"
          >
            {t("city.back", "رجوع إلى المدن")}
          </Link>
        </section>
      </MainLayout>
    );
  }

  const region = regions.find((r) => r.id === city.region_id);

  // البروفايلات داخل هاد المدينة - البحث في العنوان
  const profilesInCity = profiles.filter((p) => 
    p.address.ar.includes(city.ar) || p.address.fr.includes(city.fr)
  );

  // عدد البروفايلات لكل مهنة
  const countPerProfession: Record<number, number> = {};
  for (const p of profilesInCity) {
    countPerProfession[p.professionId] =
      (countPerProfession[p.professionId] || 0) + 1;
  }

  // المهن المتوفرة فعلاً فالمدينة
  const professionsInCity = professions
    .filter((pro) => countPerProfession[pro.id])
    .sort((a, b) => {
      const diff =
        (countPerProfession[b.id] || 0) - (countPerProfession[a.id] || 0);
      return diff !== 0 ? diff : a.title[lang].localeCompare(b.title[lang]);
    });

  return (
    <MainLayout>
      <section className="py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{city[lang]}</h1>
            {region && <p className="text-gray-600">{region[lang]}</p>}
            <p className="text-gray-600">
              {t("city.stats", "{{profCount}} مهنة • {{peopleCount}} محترف/ة", {
                profCount: professionsInCity.length,
                peopleCount: profilesInCity.length,
              })}
            </p>
          </div>

          <Link
            to="/cities"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← {t("city.back", "رجوع إلى المدن")}
          </Link>
        </div>

        {/* Professions grid */}
        {professionsInCity.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            {t("city.empty", "ما كايناش مهن متوفرة حالياً فهاد المدينة.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {professionsInCity.map((pro) => (
              <Link
                key={pro.id}
                // كنمرّرو cityId فـ query param باش تْقدري تصفي بروفايلات المهنة بهاد المدينة فقط (اختياري)
                to={`/profession/${pro.id}?city=${cityId}`}
                className="group flex flex-col items-center rounded-xl bg-white p-4 shadow transition hover:shadow-md"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-orange-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={pro.image}
                    alt={pro.title[lang]}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="group-hover:text-primary mt-3 line-clamp-2 text-center text-sm font-semibold text-gray-800">
                  {pro.title[lang]}
                </p>
                <span className="mt-1 text-xs text-gray-500">
                  {countPerProfession[pro.id]} {t("professionals", "محترف/ة")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
