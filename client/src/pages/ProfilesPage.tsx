import {
  Search,
  Star,
  MapPin,
  User,
  ArrowLeft,
  Grid,
  Heart,
  Eye,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import professions from "../data/artisan-professions.json";
import profiles from "../data/artisan-profiles.json";
import reviews from "../data/artisan-reviews.json";
import cities from "../data/moroccan-cities.json";
import regions from "../data/moroccan-regions.json";
import users from "../data/platform-users.json";

type RawProfile = (typeof profiles)[number];
type RawProfession = (typeof professions)[number];
type RawReview = (typeof reviews)[number];
type RawCity = (typeof cities)[number];
type RawRegion = (typeof regions)[number];
type RawUser = (typeof users)[number];

type ProfileCardProps = {
  profile: ProcessedProfile;
  rating: number;
  reviewCount: number;
  professionName: string | undefined;
  userName: string | undefined;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  lang: "ar" | "fr";
};

type ProcessedProfile = RawProfile & {
  professionName?: string;
  userName?: string;
  rating: number;
  reviewCount: number;
  cityId: number | null;
  cityName?: string;
  regionId: number | null;
  regionName?: string;
};

const ProfileCard = ({
  profile,
  rating,
  reviewCount,
  professionName,
  userName,
  isFavorite,
  onToggleFavorite,
  lang,
}: ProfileCardProps) => {
  const { t } = useTranslation();

  return (
    <Link to={`/profile/${profile.id}`} className="relative block group">
      <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer rounded-2xl hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
        <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-br from-orange-50/0 to-amber-50/0 group-hover:from-orange-50/50 group-hover:to-amber-50/30"></div>

        <div className="relative p-6 pb-4">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {profile.gallery && profile.gallery[0] ? (
              <img
                src={profile.gallery[0]}
                alt={profile.title.ar}
                className="object-cover w-full h-full transition-transform duration-300 rounded-xl group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/assets/profiles/default.png";
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                <User size={24} className="text-gray-400" />
              </div>
            )}

            {rating > 0 && (
              <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500">
                <Star size={10} className="fill-white" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="mb-1 font-bold text-gray-900 transition-colors duration-300 line-clamp-1 group-hover:text-orange-600">
              {userName}
            </h3>

            <p className="mb-2 text-sm font-medium text-orange-600">
              {professionName}
            </p>

            <div className="flex items-center justify-center gap-1 mb-3 text-xs text-gray-500">
              <MapPin size={10} />
              <span className="line-clamp-1">{profile.address[lang]}</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400" />
                <span>{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Eye size={10} />
                <span>
                  {reviewCount} {t("reviews.review_plural")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-orange-600 transition-colors group-hover:text-orange-700">
              {t("profiles.clickToView")}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(profile.id);
              }}
              className={`rounded-full p-2 transition-all duration-200 hover:scale-110 ${
                isFavorite
                  ? "bg-red-100 text-red-500 hover:bg-red-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400"
              }`}
            >
              <Heart size={16} className={isFavorite ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ProfilesPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialRegionId = searchParams.get("region") || "";
  const initialCityId = searchParams.get("city") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(initialCityId);
  const [selectedRegionId, setSelectedRegionId] = useState(initialRegionId);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("favoriteProfiles");
    return saved ? JSON.parse(saved) : [];
  });
  const itemsPerPage = 12;
  const lang = i18n.language as "ar" | "fr";

  const profileRatings = useMemo(() => {
    const ratingsMap = new Map<number, { average: number; count: number }>();

    reviews.forEach((review: RawReview) => {
      if (review.status === "APPROVED") {
        const current = ratingsMap.get(review.profileId) || {
          average: 0,
          count: 0,
        };
        const newTotal = current.average * current.count + review.rating;
        const newCount = current.count + 1;
        ratingsMap.set(review.profileId, {
          average: newTotal / newCount,
          count: newCount,
        });
      }
    });

    return ratingsMap;
  }, []);

  const processedProfiles = useMemo<ProcessedProfile[]>(() => {
    return profiles.map((profile: RawProfile) => {
      const profession: RawProfession | undefined = professions.find((p) => p.id === profile.professionId);
      const rating = profileRatings.get(profile.id);
      const user: RawUser | undefined = users.find((u) => u.id === profile.userId);

      const profileCity: RawCity | undefined = cities.find(
        (city) =>
          profile.address?.ar?.includes(city.ar) ||
          profile.address?.fr?.includes(city.fr),
      );
      const profileRegion: RawRegion | undefined = profileCity
        ? regions.find((region) => region.id === profileCity.region_id)
        : undefined;

      return {
        ...profile,
        professionName: profession?.title[lang],
        userName: user?.name[lang],
        rating: rating?.average || 0,
        reviewCount: rating?.count || 0,
        cityId: profileCity?.id ?? null,
        cityName: profileCity?.[lang],
        regionId: profileRegion?.id ?? null,
        regionName: profileRegion?.[lang],
      };
    });
  }, [lang, profileRatings]);

  const filteredProfiles = useMemo(() => {
    let filtered = processedProfiles;

    if (searchTerm) {
      filtered = filtered.filter(
        (profile) => {
          const term = searchTerm.toLowerCase();
          const userName = (profile.userName ?? "").toLowerCase();
          const professionName = (profile.professionName ?? "").toLowerCase();
          const cityName = (profile.cityName ?? "").toLowerCase();
          const regionName = (profile.regionName ?? "").toLowerCase();

          return (
            userName.includes(term) ||
            professionName.includes(term) ||
            cityName.includes(term) ||
            regionName.includes(term)
          );
        },
      );
    }

    if (selectedProfession) {
      filtered = filtered.filter(
        (profile) => profile.professionName === selectedProfession,
      );
    }

    if (selectedCityId) {
      filtered = filtered.filter(
        (profile) => profile.cityId === parseInt(selectedCityId),
      );
    }

    if (selectedRegionId) {
      filtered = filtered.filter(
        (profile) => profile.regionId === parseInt(selectedRegionId),
      );
    }

    return filtered;
  }, [
    processedProfiles,
    searchTerm,
    selectedProfession,
    selectedCityId,
    selectedRegionId,
  ]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const uniqueProfessions = useMemo(() => {
    return Array.from(
      new Set(processedProfiles.map((p) => p.professionName)),
    ).sort();
  }, [processedProfiles]);

  const availableCities = useMemo(() => {
    let filteredCities = cities.filter((city) =>
      processedProfiles.some((profile) => profile.cityId === city.id),
    );

    if (selectedRegionId) {
      const regionCities = filteredCities.filter(
        (city) => city.region_id === parseInt(selectedRegionId),
      );
      const otherCities = filteredCities.filter(
        (city) => city.region_id !== parseInt(selectedRegionId),
      );
      filteredCities = [...regionCities, ...otherCities];
    }

    return filteredCities.sort((a, b) => a[lang].localeCompare(b[lang]));
  }, [processedProfiles, lang, selectedRegionId]);

  const availableRegions = useMemo(() => {
    return regions
      .filter((region) =>
        processedProfiles.some((profile) => profile.regionId === region.id),
      )
      .sort((a, b) => a[lang].localeCompare(b[lang]));
  }, [processedProfiles, lang]);

  const toggleFavorite = (profileId: number) => {
    const newFavorites = favorites.includes(profileId)
      ? favorites.filter((id) => id !== profileId)
      : [...favorites, profileId];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteProfiles", JSON.stringify(newFavorites));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProfession("");
    setSelectedCityId("");
    setSelectedRegionId("");
    setCurrentPage(1);
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedCityId("");
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="absolute inset-0">
          <div className="absolute rounded-full top-1/4 left-1/4 h-96 w-96 animate-pulse bg-orange-300/20 blur-3xl"></div>
          <div className="absolute delay-1000 rounded-full right-1/4 bottom-1/4 h-80 w-80 animate-pulse bg-amber-300/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-all rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white hover:text-orange-600"
              >
                <ArrowLeft size={16} />
                {t("common.backToHome")}
              </Link>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 text-orange-700 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm">
              <Grid size={18} className="animate-pulse" />
              <span className="text-sm font-semibold tracking-wider uppercase">
                {t("profiles.discover")}
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-black leading-tight text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text md:text-5xl">
              {t("profiles.title")}
            </h1>
            <p className="max-w-2xl mx-auto mb-6 text-lg text-gray-700">
              {t("profiles.description")}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
              <span className="font-bold">{filteredProfiles.length}</span>
              <span>{t("profiles.available")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 top-1/2 left-4" />
              <input
                type="text"
                placeholder={t("profiles.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-lg transition-all bg-white border-2 border-gray-200 shadow-sm rounded-2xl focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("profession.label")}
                </label>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t("allProfessions")}</option>
                  {uniqueProfessions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("region")}
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t("allRegions")}</option>
                  {availableRegions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("city")}
                </label>
                <select
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:border-transparent focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t("allCities")}</option>
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city[lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(selectedProfession || selectedRegionId || selectedCityId) && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="mr-2 text-sm font-medium text-gray-700">
                  {t("activeFilters")}:
                </span>
                {selectedProfession && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-800 border border-orange-300 rounded-full bg-gradient-to-r from-orange-100 to-orange-200">
                    {selectedProfession}
                    <button
                      onClick={() => setSelectedProfession("")}
                      className="ml-2 text-orange-600 transition-colors hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedRegionId && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 border border-blue-300 rounded-full bg-gradient-to-r from-blue-100 to-blue-200">
                    {
                      regions.find(
                        (r) => r.id === parseInt(selectedRegionId),
                      )?.[lang]
                    }
                    <button
                      onClick={() => handleRegionChange("")}
                      className="ml-2 text-blue-600 transition-colors hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCityId && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 border border-green-300 rounded-full bg-gradient-to-r from-green-100 to-green-200">
                    {
                      cities.find((c) => c.id === parseInt(selectedCityId))?.[
                        lang
                      ]
                    }
                    <button
                      onClick={() => setSelectedCityId("")}
                      className="ml-2 text-green-600 transition-colors hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {t("clearAll")}
                </button>
              </div>
            )}

            <div className="text-sm text-center text-gray-600">
              {t("profiles.showing", "عرض {{count}} من أصل {{total}} محترف", {
                count: filteredProfiles.length,
                total: profiles.length,
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container px-4 mx-auto">
          {paginatedProfiles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProfiles.map((profile, index) => (
                  <div
                    key={profile.id}
                    className="duration-500 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProfileCard
                      profile={profile}
                      rating={profile.rating}
                      reviewCount={profile.reviewCount}
                      professionName={profile.professionName}
                      userName={profile.userName}
                      isFavorite={favorites.includes(profile.id)}
                      onToggleFavorite={toggleFavorite}
                      lang={lang}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 font-medium transition-all bg-white border border-gray-300 shadow-sm rounded-xl hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("common.previous")}
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-xl px-4 py-2 font-medium transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                              : "border border-gray-300 bg-white shadow-sm hover:bg-white"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 font-medium transition-all bg-white border border-gray-300 shadow-sm rounded-xl hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("common.next")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-white border-2 border-gray-200 rounded-full">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {t("profiles.noResults")}
              </h3>
              <p className="max-w-md mx-auto mb-6 text-gray-600">
                {t("profiles.noResultsDescription")}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 font-medium text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 hover:shadow-xl"
              >
                {t("profiles.clearFilters")}
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
