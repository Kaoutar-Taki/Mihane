import type { ArtisanProfile } from "../types";

export function filterProfiles({
  profiles,
  professionId,
  regionId,
  cityId,
}: {
  profiles: ArtisanProfile[];
  professionId?: number;
  regionId?: number;
  cityId?: number;
}) {
  let list = profiles;
  if (professionId) list = list.filter((p) => p.craftType.includes(professionId.toString()));
  if (regionId) {
    list = list.filter((p) => p.region.includes(regionId.toString()));
  }
  if (cityId) list = list.filter((p) => p.city.includes(cityId.toString()));
  return list;
}
