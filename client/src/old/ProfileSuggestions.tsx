import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import profilesData from "../data/artisan-profiles.json";
import citiesData from "../data/moroccan-cities.json";
import regionsData from "../data/moroccan-regions.json";

type Lang = "ar" | "fr";
type Review = { id: number; name: string; rating: number; comment: string };
type ProfileLite = {
  id: number;
  fullName: string;
  profession_id: number;
  city_id: number;
  genre_id?: number;
  image: string;
  description: string;
  reviews?: Review[];
};

type City = {
  id: number;
  ar: string;
  fr: string;
  region_id: number;
};

type Region = {
  id: number;
  ar: string;
  fr: string;
};

type Props = {
  currentId: number;
  professionId: number;
  cityId: number;
  genreId?: number;
  limit?: number;
};

export default function ProfileSuggestions({
  currentId,
  professionId,
  cityId,
  genreId,
  limit = 8,
}: Props) {
  const { i18n, t } = useTranslation();
  const lang: Lang = (i18n.language as Lang) ?? "ar";

  const [loading, setLoading] = useState(true);

  const profiles = profilesData as ProfileLite[];
  const cities = citiesData as City[];
  const regions = regionsData as Region[];

  useEffect(() => {
    // Skeleton طريف صغير
    const id = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(id);
  }, [currentId, professionId, cityId, genreId]);

  const currentCity = cities.find((c) => c.id === cityId);
  const currentRegionId = currentCity?.region_id;

  // حسابات مساعدة
  const avg = (p: ProfileLite) =>
    (p.reviews?.reduce((s, r) => s + r.rating, 0) || 0) /
    (p.reviews?.length || 1);
  const count = (p: ProfileLite) => p.reviews?.length || 0;
  const scoreCmp = (a: ProfileLite, b: ProfileLite) =>
    avg(b) - avg(a) || count(b) - count(a);

  const fallbackByGenre = (g?: number) =>
    g === 2 ? "/profiles/defaultWomen.png" : "/profiles/defaultMan.png";

  // المرشحين: نفس المهنة، غير البروفايل الحالي
  const candidatesBase = useMemo(
    () =>
      profiles.filter(
        (p) => p.id !== currentId && p.profession_id === professionId,
      ),
    [profiles, currentId, professionId],
  );

  // فلترة genre إذا متوفر
  const candidates = useMemo(
    () =>
      typeof genreId === "number"
        ? candidatesBase.filter((p) => p.genre_id === genreId)
        : candidatesBase,
    [candidatesBase, genreId],
  );

  // تقسيم حسب المدينة/الجهة
  const sameCity = useMemo(
    () => candidates.filter((p) => p.city_id === cityId).sort(scoreCmp),
    [candidates, cityId],
  );

  const sameRegion = useMemo(() => {
    if (!currentRegionId) return [] as ProfileLite[];
    return candidates
      .filter((p) => {
        const c = cities.find((x) => x.id === p.city_id);
        return c?.region_id === currentRegionId && p.city_id !== cityId;
      })
      .sort(scoreCmp);
  }, [candidates, currentRegionId, cityId, cities]);

  const others = useMemo(() => {
    if (!currentRegionId)
      return candidates.filter((p) => p.city_id !== cityId).sort(scoreCmp);
    return candidates
      .filter((p) => {
        const c = cities.find((x) => x.id === p.city_id);
        return c?.region_id !== currentRegionId;
      })
      .sort(scoreCmp);
  }, [candidates, currentRegionId, cityId, cities]);

  const ordered = useMemo(
    () => [...sameCity, ...sameRegion, ...others],
    [sameCity, sameRegion, others],
  );

  const suggestions = ordered.slice(0, limit);

  const cityLabel = (cid: number) => {
    const c = cities.find((x) => x.id === cid);
    const r = c ? regions.find((rr) => rr.id === c.region_id) : undefined;
    return `${c ? c[lang] : "—"}${r ? ` — ${r[lang]}` : ""}`;
  };

  if (loading) {
    return (
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {t("profile.suggestions.title", "مقترحات مشابهة")}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: Math.min(4, limit) }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow"
            >
              <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        {t("profile.suggestions.title", "مقترحات مشابهة")}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {suggestions.map((p) => (
          <Link
            key={p.id}
            to={`/profile/${p.id}`}
            className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow ring-1 ring-gray-100 transition hover:shadow-md"
          >
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500">
              <img
                src={p.image}
                alt={p.fullName}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackByGenre(p.genre_id);
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="group-hover:text-primary truncate text-base font-semibold text-gray-900">
                {p.fullName}
              </h3>
              <p className="mt-0.5 truncate text-sm text-gray-600">
                {cityLabel(p.city_id)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ⭐ {avg(p).toFixed(1)} • {count(p)} {t("reviews", "تقييم")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
