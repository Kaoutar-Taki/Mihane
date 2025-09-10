import { profiles } from "../data";

export function filterProfiles({
  professionId,
  regionId,
  cityId,
}: {
  professionId?: number;
  regionId?: number;
  cityId?: number;
}) {
  let list = profiles;
  if (professionId) list = list.filter((p) => p.profession_id === professionId);
  if (regionId) {
    const cityIds = new Set(
      (await import("../data")).cities
        .filter((c) => c.region_id === regionId)
        .map((c) => c.id),
    );
    list = list.filter((p) => cityIds.has(p.city_id));
  }
  if (cityId) list = list.filter((p) => p.city_id === cityId);
  return list;
}
