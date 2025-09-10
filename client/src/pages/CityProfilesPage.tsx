import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";

import cities from "../data/moroccan-cities.json";
import regions from "../data/moroccan-regions.json";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";

// ----- Types (حطّهم فوق) -----

export default function CityProfilesPage() {
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

  // جميع البروفايلات فالمدينة - البحث في العنوان
  const profilesInCity = profiles.filter((p) => 
    p.address.ar.includes(city.ar) || p.address.fr.includes(city.fr)
  );

  // تجميع حسب المهنة
  const groupedByProfession = profilesInCity.reduce<Record<number, any[]>>(
    (acc, p) => {
      (acc[p.professionId] ??= []).push(p);
      return acc;
    },
    {},
  );

  // لائحة المهن اللي فعلا عندها بروفايلات فهاد المدينة (مرتّبة)
  const professionsInCity = professions
    .filter((pro) => groupedByProfession[pro.id]?.length)
    .sort((a, b) => a.title[lang].localeCompare(b.title[lang]));

  return (
    <MainLayout>
      <section className="py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{city[lang]}</h1>
            {region && <p className="text-gray-600">{region[lang]}</p>}
            <p className="text-gray-600">
              {t("city.statsProfiles", "{{count}} بروفايل داخل المدينة", {
                count: profilesInCity.length,
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/city/${cityId}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {t("city.viewProfessions", "عرض المهن في المدينة")}
            </Link>
            <Link
              to="/cities"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              ← {t("city.back", "رجوع إلى المدن")}
            </Link>
          </div>
        </div>

        {/* لا توجد بروفايلات */}
        {professionsInCity.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            {t(
              "city.emptyProfiles",
              "ما كاينينش بروفايلات فهاد المدينة حاليا.",
            )}
          </div>
        ) : (
          <>
            {professionsInCity.map((pro) => (
              <section key={pro.id} className="mb-10">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {pro.title[lang]}
                    <span className="ml-2 align-middle text-xs text-gray-500">
                      ({groupedByProfession[pro.id].length}{" "}
                      {t("professionals", "محترف/ة")})
                    </span>
                  </h2>
                  {/* نمرّرو city كـ query باش صفحة المهنة تقدّر تصفّي بهاد المدينة فقط (اختياري) */}
                  <Link
                    to={`/profession/${pro.id}?city=${cityId}`}
                    className="text-primary text-sm hover:underline"
                  >
                    {t("seeAllProfession", "رؤية كل المحترفين فهاد المهنة")}
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
                          src={p.image}
                          alt={p.fullName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="group-hover:text-primary truncate text-base font-semibold text-gray-800">
                          {p.fullName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {p.description}
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
