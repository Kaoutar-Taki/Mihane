import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";
import ProfileCard from "../components/ProfileCard";
import ProfilesGrid from "../components/ProfilesGrid";
import profiles from "../data/profiles.json";
import professions from "../data/professions.json";
import cities from "../data/cities.json";
import regions from "../data/regions.json";

type Lang = "ar" | "fr";
type Profession = { id: number; title: Record<Lang, string> };
type City = { id: number; region_id: number } & Record<Lang, string>;
type Region = { id: number } & Record<Lang, string>;
type Profile = {
  id: number;
  fullName: Record<Lang, string>; 
  profession_id: number;
  city_id: number;
  image: string;
  genre_id: 1 | 2;
};

export default function ProfilesPage() {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith("ar") ? "ar" : "fr";

  const items = useMemo(() => {
    const pMap = new Map<number, Profession>(professions.map((p) => [p.id, p as Profession]));
    const cMap = new Map<number, City>(cities.map((c) => [c.id, c as City]));
    const rMap = new Map<number, Region>(regions.map((r) => [r.id, r as Region]));

    return (profiles as Profile[]).map((p) => {
      const profession = pMap.get(p.profession_id);
      const city = cMap.get(p.city_id);
      const region = city ? rMap.get(city.region_id) : undefined;

      return {
        id: p.id,
        fullName: p.fullName[lang],      
        image: p.image,
        profession: profession?.title?.[lang] ?? "—",
        city: city?.[lang] ?? "—",
        region: region?.[lang] ?? "",
        genre_id: p.genre_id,
      };
    });
  }, [lang]);

  if (!items.length) {
    return (
      <MainLayout>
        <section className="py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary">
            {t("profiles.title")}
          </h1>
          <p className="text-gray-600">
            {t("profiles.empty")}
          </p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-16">
        <header className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-primary">
            {t("profiles.title")}
          </h1>
          <p className="text-gray-600">
            {t("profiles.description")}
          </p>
        </header>

        <ProfilesGrid>
          {items.map((p) => (
            <li key={p.id}>
              <ProfileCard
                id={p.id}
                fullName={p.fullName}
                image={p.image}
                profession={p.profession}
                city={p.city}
                region={p.region}
                genre_id={p.genre_id}
              />
            </li>
          ))}
        </ProfilesGrid>
      </section>
    </MainLayout>
  );
}
