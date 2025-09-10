import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";

import regions from "../data/moroccan-regions.json";
import cities from "../data/moroccan-cities.json";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";

export default function RegionDetailsPage() {
  const { i18n, t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const lang = (i18n.language as "ar" | "fr") ?? "ar";
  const regionId = Number(id);
  const region = regions.find((r) => r.id === regionId);

  if (!region) {
    return (
      <MainLayout>
        <section className="py-16 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            {t("region.notFound", "الجهة غير موجودة")}
          </h1>
          <Link
            to="/regions"
            className="bg-primary mt-4 inline-block rounded-lg px-4 py-2 text-white hover:opacity-90"
          >
            {t("region.back", "رجوع إلى الجهات")}
          </Link>
        </section>
      </MainLayout>
    );
  }

  // المدن التابعة للجهة
  const regionCities = cities.filter((c) => c.region_id === regionId);

  // البروفايلات داخل هاد الجهة - البحث في العنوان
  const profilesInRegion = profiles.filter((p) =>
    regionCities.some(
      (city) =>
        p.address.ar.includes(city.ar) || p.address.fr.includes(city.fr),
    ),
  );

  // عدد البروفايلات لكل مهنة
  const countPerProfession: Record<number, number> = {};
  for (const p of profilesInRegion) {
    countPerProfession[p.professionId] =
      (countPerProfession[p.professionId] || 0) + 1;
  }

  // المهن المتوفرة فعلاً فهاد الجهة
  const professionsInRegion = professions
    .filter((pro) => countPerProfession[pro.id])
    .sort((a, b) => a.title[lang].localeCompare(b.title[lang]));

  return (
    <MainLayout>
      <section className="py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{region[lang]}</h1>
            <p className="text-gray-600">
              {t(
                "region.stats",
                "{{profCount}} مهنة • {{peopleCount}} محترف/ة",
                {
                  profCount: professionsInRegion.length,
                  peopleCount: profilesInRegion.length,
                },
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/region/${regionId}/profiles`}
              className="bg-primary rounded-lg px-3 py-1.5 text-sm text-white hover:opacity-90"
            >
              عرض البروفايلات
            </Link>
            <Link
              to="/regions"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              ← {t("region.back", "رجوع إلى الجهات")}
            </Link>
          </div>
        </div>
        {/* Cities chips (اختياري للتوضيح) */}
        {regionCities.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {regionCities.map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
              >
                {c[lang]}
              </span>
            ))}
          </div>
        )}

        {/* Professions grid */}
        {professionsInRegion.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            {t("region.empty", "ما كايناش مهن متوفرة حالياً فهاد الجهة.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {professionsInRegion.map((pro) => (
              <Link
                key={pro.id}
                to={`/profession/${pro.id}`}
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
