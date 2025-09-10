import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";

import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";
import cities from "../data/moroccan-cities.json";
import regions from "../data/moroccan-regions.json";

export default function ProfessionDetailsPage() {
  const { i18n, t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const lang = (i18n.language as "ar" | "fr") ?? "ar";
  const professionId = Number(id);

  const regionParam = Number(searchParams.get("region") || 0);
  const cityParam = Number(searchParams.get("city") || 0);

  const profession = professions.find((p) => p.id === professionId);
  if (!profession) {
    return (
      <MainLayout>
        <section className="py-16 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            {t("profession.notFound", "المهنة غير موجودة")}
          </h1>
          <Link
            to="/professions"
            className="bg-primary mt-6 inline-block rounded-lg px-4 py-2 text-white hover:opacity-90"
          >
            {t("categories.title", "جميع الفئات")}
          </Link>
        </section>
      </MainLayout>
    );
  }

  // --- فلترة البروفايلات ---
  let filtered = profiles.filter((p) => p.profession_id === professionId);

  // region ⇒ نحسب المدن التابعة لها ونصفي عليهم
  const regionIsValid =
    regionParam && regions.some((r) => r.id === regionParam);
  if (regionIsValid) {
    const regionCityIds = new Set(
      cities.filter((c) => c.region_id === regionParam).map((c) => c.id),
    );
    filtered = filtered.filter((p) => regionCityIds.has(p.city_id));
  }

  // city ⇒ نضيّق أكثر بالمدينة إذا موجودة
  const cityIsValid = cityParam && cities.some((c) => c.id === cityParam);
  if (cityIsValid) {
    filtered = filtered.filter((p) => p.city_id === cityParam);
  }

  // (اختياري) تنبيه إذا كاين تضارب: city ماشي فـ region
  const mismatch =
    regionIsValid &&
    cityIsValid &&
    !cities.some((c) => c.id === cityParam && c.region_id === regionParam);

  const title = profession.title[lang];

  const getCityAndRegion = (city_id?: number) => {
    const city = cities.find((c) => c.id === city_id);
    const region = city
      ? regions.find((r) => r.id === city.region_id)
      : undefined;
    return {
      cityLabel: city ? city[lang] : "—",
      regionLabel: region ? region[lang] : "",
    };
  };

  const clearFilter = (key: "region" | "city") => {
    searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };

  // ===== Rappel Professions (كيحترم region/city) =====

  // دابا غادي نوجد "قاعدة" ديال البروفايلات داخل نفس النطاق (جهة/مدينة) بلا ما نقيّدها بالمهنة الحالية
  let baseArea = profiles as typeof profiles;

  if (regionIsValid) {
    const regionCityIds = new Set(
      cities.filter((c) => c.region_id === regionParam).map((c) => c.id),
    );
    baseArea = baseArea.filter((p) => regionCityIds.has(p.city_id));
  }
  if (cityIsValid) {
    baseArea = baseArea.filter((p) => p.city_id === cityParam);
  }

  // نحسب عدد المحترفين لكل مهنة (باستثناء المهنة الحالية)
  const countByProfession: Record<number, number> = {};
  for (const p of baseArea) {
    if (p.profession_id === professionId) continue;
    countByProfession[p.profession_id] =
      (countByProfession[p.profession_id] || 0) + 1;
  }

  // لائحة المهن المتوفّرة فالنطاق، مرتّبة حسب العدد ثم الاسم
  const othersInArea = professions
    .filter((pro) => pro.id !== professionId && countByProfession[pro.id])
    .sort((a, b) => {
      const diff =
        (countByProfession[b.id] || 0) - (countByProfession[a.id] || 0);
      return diff !== 0 ? diff : a.title[lang].localeCompare(b.title[lang]);
    })
    .slice(0, 8); // خْتاري أقصى عدد بغيتيه

  // باش نْحافظو على الفلاتر فالنڢيݣاسيون
  const buildSuffix = () => {
    const qs = new URLSearchParams();
    if (regionIsValid) qs.set("region", String(regionParam));
    if (cityIsValid) qs.set("city", String(cityParam));
    const s = qs.toString();
    return s ? `?${s}` : "";
  };

  return (
    <MainLayout>
      <section className="py-10">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-600">
              {t("profession.count", "{{count}} محترف/ة", {
                count: filtered.length,
              })}
            </p>
          </div>

          <Link
            to="/professions"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← {t("categories.title", "جميع الفئات")}
          </Link>
        </div>

        {/* فلاتر مفعّلة */}
        {regionIsValid || cityIsValid ? (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            {regionIsValid && (
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-gray-700">
                {regions.find((r) => r.id === regionParam)?.[lang]}
                <button
                  onClick={() => clearFilter("region")}
                  className="rounded-full bg-orange-100 px-2 py-0.5 text-gray-600 hover:bg-orange-200"
                >
                  ×
                </button>
              </span>
            )}
            {cityIsValid && (
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-gray-700">
                {cities.find((c) => c.id === cityParam)?.[lang]}
                <button
                  onClick={() => clearFilter("city")}
                  className="rounded-full bg-orange-100 px-2 py-0.5 text-gray-600 hover:bg-orange-200"
                >
                  ×
                </button>
              </span>
            )}
            <Link
              to={`/profession/${professionId}`}
              className="ml-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50"
            >
              {t("clearAll", "مسح الكل")}
            </Link>
          </div>
        ) : (
          ""
        )}

        {/* تحذير تضارب (اختياري) */}
        {mismatch ? (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
            {t(
              "profession.mismatch",
              "المدينة المختارة لا تنتمي إلى الجهة المحددة، قد تظهر نتائج قليلة أو منعدمة.",
            )}
          </div>
        ) : (
          ""
        )}

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            {t(
              "profession.empty",
              "لا يوجد محترفون بناءً على الفلاتر الحالية.",
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((profile) => {
              const { cityLabel, regionLabel } = getCityAndRegion(
                profile.city_id,
              );
              return (
                <Link
                  key={profile.id}
                  to={`/profile/${profile.id}`}
                  className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow transition hover:shadow-md"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500">
                    <img
                      src={profile.image}
                      alt={profile.fullName.ar}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="group-hover:text-primary truncate text-base font-semibold text-gray-800">
                      {profile.fullName.ar}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {cityLabel}
                      {regionLabel ? ` — ${regionLabel}` : ""}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {profile.description.ar}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      {/* --- Rappel des professions / مهن أخرى في نفس النطاق --- */}
      {othersInArea.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("profession.otherInArea", "مهن أخرى في نفس النطاق")}
            </h2>
            <Link
              to="/professions"
              className="text-primary text-sm hover:underline"
            >
              {t("categories.title", "جميع الفئات")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {othersInArea.map((pro) => (
              <Link
                key={pro.id}
                to={`/profession/${pro.id}${buildSuffix()}`}
                className="group flex flex-col items-center rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500">
                  <img
                    src={pro.image}
                    alt={pro.title[lang]}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="group-hover:text-primary mt-2 line-clamp-2 text-center text-sm font-medium text-gray-800">
                  {pro.title[lang]}
                </p>
                <span className="mt-1 text-xs text-gray-500">
                  {countByProfession[pro.id]} {t("professionals", "محترف/ة")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </MainLayout>
  );
}
