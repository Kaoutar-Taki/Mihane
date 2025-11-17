import { Search, MapPin, Wrench, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getCities, type City as ApiCity } from "@/services/cities";
import { getProfessions, type Profession as ApiProfession } from "@/services/professions";
import { getRegions, type Region as ApiRegion } from "@/services/regions";

type Lang = "ar" | "fr";

export default function LandingSearch() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dir = i18n.dir();
  const lang: Lang = (i18n.language as Lang) ?? "ar";

  const iconSide = dir === "rtl" ? "left-3" : "right-3";
  const padX = dir === "rtl" ? "pl-10 pr-4" : "pr-10 pl-4";

  const [professionId, setProfessionId] = useState<number | "">("");
  const [regionId, setRegionId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");

  const [professions, setProfessions] = useState<ApiProfession[]>([]);
  const [regions, setRegions] = useState<ApiRegion[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [prof, regs, cits] = await Promise.all([
          getProfessions("active"),
          getRegions("active"),
          getCities("active"),
        ]);
        if (cancelled) return;
        setProfessions(prof);
        setRegions(regs);
        setCities(cits);
      } catch (err) {
        console.error("Failed to load search data", err);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedProfessions = useMemo(
    () => {
      const label = (p: ApiProfession) =>
        lang === "ar" ? p.name_ar : p.name_fr || p.name_ar;
      return [...professions].sort((a, b) => label(a).localeCompare(label(b)));
    },
    [professions, lang],
  );

  const sortedRegions = useMemo(
    () => {
      const label = (r: ApiRegion) =>
        lang === "ar" ? r.name_ar : r.name_fr;
      return [...regions].sort((a, b) => label(a).localeCompare(label(b)));
    },
    [regions, lang],
  );

  const filteredCities = useMemo(() => {
    const list =
      typeof regionId === "number"
        ? cities.filter((c) => c.region_id === regionId)
        : cities;
    const label = (c: ApiCity) =>
      lang === "ar" ? c.name_ar : c.name_fr;
    return [...list].sort((a, b) => label(a).localeCompare(label(b)));
  }, [cities, regionId, lang]);

  const handleRegionChange = (val: string) => {
    const id = val ? Number(val) : "";
    setRegionId(id);

    if (id === "") return;
    if (cityId !== "") {
      const stillValid = cities.some(
        (c) => c.id === cityId && c.region_id === id,
      );
      if (!stillValid) setCityId("");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (regionId !== "") qs.set("region", String(regionId));
    if (cityId !== "") qs.set("city", String(cityId));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";

    if (professionId !== "") {
      navigate(`/profession/${professionId}${suffix}`);
      return;
    }

    if (regionId !== "" || cityId !== "") {
      navigate(`/profiles${suffix}`);
      return;
    }

    navigate("/professions");
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="relative flex flex-col w-full gap-3 mx-auto md:flex-row md:items-center md:justify-center"
    >
      <div className="relative w-full group md:max-w-sm">
        <select
          value={professionId}
          onChange={(e) =>
            setProfessionId(e.target.value ? Number(e.target.value) : "")
          }
          className={`w-full appearance-none rounded-2xl border-2 border-orange-200/60 bg-white/95 py-3.5 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 ${padX}`}
        >
          <option value="">{t("landing.search.service")}</option>
          {sortedProfessions.map((p) => (
            <option key={p.id} value={p.id}>
              {lang === "ar" ? p.name_ar : p.name_fr || p.name_ar}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${iconSide}`}
        >
          <Wrench size={20} />
        </span>
      </div>

      <div className="relative w-full group md:max-w-sm">
        <select
          value={regionId}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={`w-full appearance-none rounded-2xl border-2 border-orange-200/60 bg-white/95 py-3.5 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 ${padX}`}
        >
          <option value="">{t("landing.search.region")}</option>
          {sortedRegions.map((r) => (
            <option key={r.id} value={r.id}>
              {lang === "ar" ? r.name_ar : r.name_fr}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${iconSide}`}
        >
          <Map size={20} />
        </span>
      </div>

      <div className="relative w-full group md:max-w-sm">
        <select
          value={cityId}
          onChange={(e) =>
            setCityId(e.target.value ? Number(e.target.value) : "")
          }
          className={`w-full appearance-none rounded-2xl border-2 border-orange-200/60 bg-white/95 py-3.5 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 ${padX}`}
        >
          <option value="">{t("landing.search.city")}</option>
          {filteredCities.map((c) => (
            <option key={c.id} value={c.id}>
              {lang === "ar" ? c.name_ar : c.name_fr}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${iconSide}`}
        >
          <MapPin size={20} />
        </span>
      </div>

      <div className="flex justify-center w-full md:max-w-xs">
        <button
          type="submit"
          className="group relative inline-flex w-full transform items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-8 py-3.5 font-bold text-white shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:from-orange-700 hover:to-amber-700 hover:shadow-orange-500/50 focus:outline-none focus:ring-4 focus:ring-orange-500/30 md:w-auto dark:from-orange-500 dark:via-amber-500 dark:to-orange-600"
        >
          <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:opacity-100"></div>
          <Search
            size={20}
            className="relative transition-transform duration-300 group-hover:scale-110"
          />
          <span className="relative">{t("landing.search.button")}</span>
          <div className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-0 -top-1 -right-1 animate-ping group-hover:opacity-100"></div>
        </button>
      </div>
    </form>
  );
}
