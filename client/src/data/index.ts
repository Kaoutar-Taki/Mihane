import rawRegions from "../data/moroccan-regions.json";
import rawCities from "../data/moroccan-cities.json";
import rawProfessions from "../data/artisan-professions.json";
import rawProfiles from "../data/artisan-profiles.json";
import { z } from "zod";
import {
  RegionSchema,
  CitySchema,
  ProfessionSchema,
  ProfileSchema,
  type Region,
  type City,
  type Profession,
  type Profile,
} from "./types";

export const regions: Region[] = z.array(RegionSchema).parse(rawRegions);
export const cities: City[] = z.array(CitySchema).parse(rawCities);
export const professions: Profession[] = z
  .array(ProfessionSchema)
  .parse(rawProfessions);
export const profiles: Profile[] = z.array(ProfileSchema).parse(rawProfiles);
