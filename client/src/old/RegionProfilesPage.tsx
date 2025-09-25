import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../pages/layouts/MainLayout";

import regions from "../data/moroccan-regions.json";
import cities from "../data/moroccan-cities.json";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";

export default function RegionProfilesPage() {
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

  // المدن ديال هاد الجهة
  const regionCities = cities.filter((c) => c.region_id === regionId);

  // جميع البروفايلات فالجهة - البحث في العنوان
  const profilesInRegion = profiles.filter((p) =>
    regionCities.some(
      (city) =>
        p.address.ar.includes(city.ar) || p.address.fr.includes(city.fr),
    ),
  );

  // نجمعوهم حسب المهنة
  const groupedByProfession: Record<number, typeof profiles> = {};
  for (const p of profilesInRegion) {
    if (!groupedByProfession[p.professionId])
      groupedByProfession[p.professionId] = [];
    groupedByProfession[p.professionId].push(p);
  }

  // ترتيب المهن اللي فعلا عندها بروفايلات، حسب الاسم
  const professionsInRegion = professions
    .filter((pro) => groupedByProfession[pro.id]?.length)
    .sort((a, b) => a.title[lang].localeCompare(b.title[lang]));

  const getCityLabel = (address: { ar: string; fr: string }) => {
    const addressText = address[lang];
    const foundCity = cities.find(
      (city) => addressText.includes(city.ar) || addressText.includes(city.fr),
    );
    return foundCity ? foundCity[lang] : "—";
  };

  return (
    <MainLayout>
      <section className="py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{region[lang]}</h1>
            <p className="text-gray-600">
              {t("region.statsProfiles", "{{count}} بروفايل داخل الجهة", {
                count: profilesInRegion.length,
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/region/${regionId}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {t("region.viewProfessions", "عرض المهن")}
            </Link>
            <Link
              to="/regions"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              ← {t("region.back", "رجوع إلى الجهات")}
            </Link>
          </div>
        </div>

        {/* لا توجد بروفايلات */}
        {professionsInRegion.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            {t(
              "region.emptyProfiles",
              "ما كاينينش بروفايلات فهاد الجهة حاليا.",
            )}
          </div>
        ) : (
          <>
            {professionsInRegion.map((pro) => (
              <section key={pro.id} className="mb-10">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {pro.title[lang]}
                    <span className="ml-2 align-middle text-xs text-gray-500">
                      ({groupedByProfession[pro.id].length}{" "}
                      {t("professionals", "محترف/ة")})
                    </span>
                  </h2>
                  <Link
                    to={`/profession/${pro.id}`}
                    className="text-primary text-sm hover:underline"
                  >
                    {t("seeAllProfession", "رؤية جميع هذه المهنة")}
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedByProfession[pro.id].map((p) => (
                    <Link
                      key={p.id}
                      to={`/profile/${p.id}`}
                      className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow transition hover:shadow-md"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500">
                        <img
                          src={p.gallery[0] || "/assets/default-profile.jpg"}
                          alt={p.title.ar}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="group-hover:text-primary truncate text-base font-semibold text-gray-800">
                          {p.title.ar}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-600">
                          {getCityLabel(p.address)} {/* المدينة */}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {p.description.ar}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </section>
    </MainLayout>
  );
}
