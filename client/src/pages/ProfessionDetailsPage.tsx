import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowLeft, Filter, MapPin, Search } from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";
import cities from "../data/moroccan-cities.json";
import regions from "../data/moroccan-regions.json";

export default function ProfessionDetailsPage() {
  const { i18n, t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

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
            {t("profession.notFound")}
          </h1>
          <Link
            to="/professions"
            className="bg-primary mt-6 inline-block rounded-lg px-4 py-2 text-white hover:opacity-90"
          >
            {t("categories.title")}
          </Link>
        </section>
      </MainLayout>
    );
  }

  let filtered = profiles.filter((p) => p.professionId === professionId);

  const regionIsValid =
    regionParam && regions.some((r) => r.id === regionParam);
  if (regionIsValid) {
    const regionCities = cities.filter((c) => c.region_id === regionParam);
    filtered = filtered.filter((p) =>
      regionCities.some(
        (city) =>
          p.address.ar.includes(city.ar) || p.address.fr.includes(city.fr),
      ),
    );
  }

  const cityIsValid = cityParam && cities.some((c) => c.id === cityParam);
  if (cityIsValid) {
    const selectedCity = cities.find((c) => c.id === cityParam);
    if (selectedCity) {
      filtered = filtered.filter(
        (p) =>
          p.address.ar.includes(selectedCity.ar) ||
          p.address.fr.includes(selectedCity.fr),
      );
    }
  }

  const mismatch =
    regionIsValid &&
    cityIsValid &&
    !cities.some((c) => c.id === cityParam && c.region_id === regionParam);

  const title = profession.title[lang];

  const getCityAndRegion = (address: { ar: string; fr: string }) => {
    const addressText = address[lang];
    const foundCity = cities.find(
      (city) => addressText.includes(city.ar) || addressText.includes(city.fr),
    );
    const region = foundCity
      ? regions.find((r) => r.id === foundCity.region_id)
      : undefined;
    return {
      cityLabel: foundCity ? foundCity[lang] : "—",
      regionLabel: region ? region[lang] : "",
    };
  };

  const clearFilter = (key: "region" | "city") => {
    searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };


  let baseArea = profiles as typeof profiles;

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

  const countByProfession: Record<number, number> = {};
  for (const p of baseArea) {
    if (p.professionId === professionId) continue;
    countByProfession[p.professionId] =
      (countByProfession[p.professionId] || 0) + 1;
  }

  const othersInArea = professions
    .filter((pro) => pro.id !== professionId && countByProfession[pro.id])
    .sort((a, b) => {
      const diff =
        (countByProfession[b.id] || 0) - (countByProfession[a.id] || 0);
      return diff !== 0 ? diff : a.title[lang].localeCompare(b.title[lang]);
    })
    .slice(0, 8); 

  const buildSuffix = () => {
    const qs = new URLSearchParams();
    if (regionIsValid) qs.set("region", String(regionParam));
    if (cityIsValid) qs.set("city", String(cityParam));
    const s = qs.toString();
    return s ? `?${s}` : "";
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-80 w-80 animate-pulse rounded-full bg-orange-300/20 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-amber-300/20 blur-3xl delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <div className="mb-6">
              <Link
                to="/professions"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600"
              >
                <ArrowLeft size={16} />
                {t("categories.title")}
              </Link>
            </div>

            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
              <Filter size={18} />
              <span className="text-sm font-semibold tracking-wider uppercase">
                {t("professions.title")}
              </span>
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-4xl leading-tight font-black text-transparent md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-gray-700">
              {t("profession.count", { count: filtered.length })}
            </p>
          </div>

          <div className="mx-auto mt-2 max-w-4xl">
            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("profiles.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3 pr-4 pl-12 text-base shadow-sm transition-all focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("region")}
                </label>
                <select
                  value={regionIsValid ? String(regionParam) : ""}
                  onChange={(e) => {
                    const next = new URLSearchParams(searchParams);
                    const val = e.target.value;
                    if (val) next.set("region", val); else next.delete("region");
                    next.delete("city");
                    setSearchParams(next, { replace: true });
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t("allRegions")}</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r[lang]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("city")}
                </label>
                <select
                  value={cityIsValid ? String(cityParam) : ""}
                  onChange={(e) => {
                    const next = new URLSearchParams(searchParams);
                    const val = e.target.value;
                    if (val) next.set("city", val); else next.delete("city");
                    setSearchParams(next, { replace: true });
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  disabled={!regionIsValid}
                >
                  <option value="">{t("allCities")}</option>
                  {(regionIsValid ? cities.filter(c => c.region_id === regionParam) : [])
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c[lang]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">

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
              {t("clearAll")}
            </Link>
          </div>
        ) : (
          ""
        )}

        {mismatch ? (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
            {t(
              "profession.mismatch"
            )}
          </div>
        ) : (
          ""
        )}

        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-gray-200 p-10 text-center text-gray-600 bg-white">
            {t("profession.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((profile) => {
              const { cityLabel, regionLabel } = getCityAndRegion(
                profile.address,
              );
              return (
                <Link
                  key={profile.id}
                  to={`/profile/${profile.id}`}
                  className="group relative block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-amber-50/0 transition-all duration-300 group-hover:from-orange-50/50 group-hover:to-amber-50/30"></div>
                    <div className="relative p-6 pb-4">
                      <div className="relative mx-auto h-20 w-20 mb-4">
                        {profile.gallery && profile.gallery[0] ? (
                          <img
                            src={profile.gallery[0]}
                            alt={profile.title[lang]}
                            className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                          {profile.title[lang]}
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-2">
                          <MapPin size={10} />
                          <span className="line-clamp-1">{cityLabel}{regionLabel ? ` — ${regionLabel}` : ""}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{profile.description[lang]}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 p-3">
                      <div className="text-center text-sm text-orange-600 font-medium group-hover:text-orange-700 transition-colors">
                        {t("profiles.clickToView")}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </section>
      {othersInArea.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8">
          <div className="container mx-auto px-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("profession.otherInArea")}
              </h2>
              <Link
                to="/professions"
                className="text-orange-600 text-sm hover:underline"
              >
                {t("categories.title")}
              </Link>
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center gap-4 min-w-max">
                {othersInArea.map((pro) => (
                  <Link
                    key={pro.id}
                    to={`/profession/${pro.id}${buildSuffix()}`}
                    className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    <img
                      src={pro.image}
                      alt={pro.title[lang]}
                      className="h-8 w-8 rounded-full border-2 border-orange-500 object-cover"
                      loading="lazy"
                    />
                    <span className="max-w-[220px] truncate font-medium">{pro.title[lang]}</span>
                    <span className="rounded-full bg-orange-100 text-orange-700 text-sm px-2.5 py-0.5">
                      {countByProfession[pro.id]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
