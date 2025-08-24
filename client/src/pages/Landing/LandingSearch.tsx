import { Search, MapPin, Wrench, Map } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import professionsData from "../../data/professions.json";
import regionsData from "../../data/regions.json";
import citiesData from "../../data/cities.json";

type Lang = "ar" | "fr";
type Profession = { id: number; title: Record<Lang, string>; image?: string };
type Region = { id: number; ar: string; fr: string };
type City = { id: number; ar: string; fr: string; region_id: number };

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

  const professions = professionsData as Profession[];
  const regions = regionsData as Region[];
  const cities = citiesData as City[];

  const sortedProfessions = useMemo(
    () =>
      [...professions].sort((a, b) =>
        a.title[lang].localeCompare(b.title[lang]),
      ),
    [professions, lang],
  );

  const sortedRegions = useMemo(
    () => [...regions].sort((a, b) => a[lang].localeCompare(b[lang])),
    [regions, lang],
  );

  const filteredCities = useMemo(() => {
    const list =
      typeof regionId === "number"
        ? cities.filter((c) => c.region_id === regionId)
        : cities;
    return [...list].sort((a, b) => a[lang].localeCompare(b[lang]));
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

    if (professionId !== "") {
      const qs = new URLSearchParams();
      if (regionId !== "") qs.set("region", String(regionId));
      if (cityId !== "") qs.set("city", String(cityId));
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      navigate(`/profession/${professionId}${suffix}`);
      return;
    }

    if (cityId !== "") {
      navigate(`/city/${cityId}`);
      return;
    }

    if (regionId !== "") {
      navigate(`/region/${regionId}`);
      return;
    }

    navigate("/professions");
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="relative mx-auto flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-center"
    >
      <div className="group relative w-full md:max-w-sm">
        <select
          value={professionId}
          onChange={(e) =>
            setProfessionId(e.target.value ? Number(e.target.value) : "")
          }
          className={`w-full appearance-none rounded-2xl border-2 border-orange-200/60 bg-white/95 py-4 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${padX}`}
        >
          <option value="">{t("landing.search.service")}</option>
          {sortedProfessions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title[lang]}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${iconSide}`}
        >
          <Wrench size={20} />
        </span>
      </div>

      <div className="group relative w-full md:max-w-sm">
        <select
          value={regionId}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={`w-full appearance-none rounded-2xl border-2 border-orange-200/60 bg-white/95 py-4 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${padX}`}
        >
          <option value="">{t("landing.search.region")}</option>
          {sortedRegions.map((r) => (
            <option key={r.id} value={r.id}>
              {r[lang]}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${iconSide}`}
        >
          <Map size={20} />
        </span>
      </div>

      <div className="group relative w-full md:max-w-sm">
        <select
          value={cityId}
          onChange={(e) =>
            setCityId(e.target.value ? Number(e.target.value) : "")
          }
          className={`w-full appearance-none rounded-2xl border-2 border-orange-200/60 bg-white/95 py-4 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${padX}`}
        >
          <option value="">{t("landing.search.city")}</option>
          {filteredCities.map((c) => (
            <option key={c.id} value={c.id}>
              {c[lang]}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${iconSide}`}
        >
          <MapPin size={20} />
        </span>
      </div>

      <button
        type="submit"
        className="group relative inline-flex w-full transform items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-8 py-4 font-bold text-white shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:from-orange-700 hover:to-amber-700 hover:shadow-orange-500/50 focus:ring-4 focus:ring-orange-500/30 focus:outline-none md:w-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <Search
          size={20}
          className="relative transition-transform duration-300 group-hover:scale-110"
        />
        <span className="relative">{t("landing.search.button")}</span>
        <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100"></div>
      </button>
    </form>
  );
}
