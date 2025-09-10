import type { Lang } from "../data/types";
import { cities, regions } from "../data";

export function getCityRegionLabels(cityId?: number, lang: Lang = "ar") {
  const city = cities.find((c) => c.id === cityId);
  const region = city
    ? regions.find((r) => r.id === city.region_id)
    : undefined;
  return {
    cityLabel: city ? city[lang as "ar" | "fr"] : "",
    regionLabel: region ? region[lang as "ar" | "fr"] : "",
  };
}
