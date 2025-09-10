import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  Share2,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
} from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";
import reviews from "../data/artisan-reviews.json";
import users from "../data/platform-users.json";

function clamp(text: string, max = 220) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export default function ProfilePage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    const saved = localStorage.getItem("favoriteProfiles");
    const favorites = saved ? JSON.parse(saved) : [];
    return favorites.includes(Number(id));
  });
  const lang = i18n.language as "ar" | "fr";

  const rawProfile = profiles.find((p) => p.id === Number(id));
  const user = users.find((u) => u.id === rawProfile?.userId);
  const profession = professions.find((p) => p.id === rawProfile?.professionId);

  const profileReviews = reviews.filter(
    (r) => r.profileId === Number(id) && r.status === "APPROVED",
  );
  const averageRating =
    profileReviews.length > 0
      ? profileReviews.reduce((sum, r) => sum + r.rating, 0) /
        profileReviews.length
      : 0;

  const suggestedProfiles = useMemo(() => {
    if (!rawProfile) return [] as Array<any>;

    const sameProfession = profiles
      .filter(
        (p) => p.id !== rawProfile.id && p.professionId === rawProfile.professionId,
      )
      .slice(0, 6);

    const sameLocation = profiles
      .filter(
        (p) =>
          p.id !== rawProfile.id &&
          p.professionId !== rawProfile.professionId &&
          p.address[lang]?.includes(rawProfile.address[lang]?.split(",")[0] || ""),
      )
      .slice(0, 4);

    const topRated = profiles
      .filter((p) => p.id !== rawProfile.id)
      .map((profile) => {
        const pReviews = reviews.filter(
          (r) => r.profileId === profile.id && r.status === "APPROVED",
        );
        const rating =
          pReviews.length > 0
            ? pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length
            : 0;
        return { ...profile, calculatedRating: rating, reviewCount: pReviews.length };
      })
      .filter((p) => p.calculatedRating >= 4.0 && p.reviewCount >= 2)
      .sort((a, b) => b.calculatedRating - a.calculatedRating)
      .slice(0, 3);

    const uniqueProfiles = [...sameProfession, ...sameLocation, ...topRated]
      .filter((profile, index, self) => index === self.findIndex((p) => p.id === profile.id))
      .slice(0, 8)
      .map((profile) => {
        const profileUser = users.find((u) => u.id === profile.userId);
        const profileProfession = professions.find((p) => p.id === profile.professionId);
        const pReviews = reviews.filter(
          (r) => r.profileId === profile.id && r.status === "APPROVED",
        );
        const rating =
          pReviews.length > 0
            ? pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length
            : 0;

        return {
          ...profile,
          userName: profileUser?.name[lang],
          professionName: profileProfession?.title[lang],
          rating,
          reviewCount: pReviews.length,
          avatar: profileUser?.avatar,
        };
      });

    return uniqueProfiles;
  }, [rawProfile, lang]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem("favoriteProfiles");
    const favorites = saved ? JSON.parse(saved) : [];
    const newFavorites = isFavorite
      ? favorites.filter((fId: number) => fId !== Number(id))
      : [...favorites, Number(id)];

    localStorage.setItem("favoriteProfiles", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (!rawProfile || !user) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
              <User size={28} className="text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">{t("profile.notFound")}</h2>
            <p className="mb-5 text-gray-600">{t("profile.notFoundDescription")}</p>
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-600"
            >
              <ArrowLeft size={16} />
              {t("common.backToProfiles")}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const displayedReviews = showAllReviews ? profileReviews : profileReviews.slice(0, 3);

  const DESKTOP_CARD_H = "lg:h-[520px]";

  return (
    <MainLayout>
      <section className="relative py-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container px-4 mx-auto">
          <div className="mb-4">
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-full shadow bg-white/90 hover:bg-white hover:text-orange-600"
            >
              <ArrowLeft size={16} />
              {t("common.backToProfiles")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className={`relative rounded-2xl bg-white p-3 shadow ${DESKTOP_CARD_H}`}>
              <div className="relative w-full h-full overflow-hidden rounded-xl">
                {rawProfile.gallery && rawProfile.gallery[currentImageIndex] ? (
                  <img
                    src={rawProfile.gallery[currentImageIndex]}
                    alt={user.name[lang]}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <User size={56} className="text-gray-400" />
                  </div>
                )}

                {rawProfile.gallery && rawProfile.gallery.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? rawProfile.gallery!.length - 1 : prev - 1,
                        )
                      }
                      className="p-2 text-white rounded-full pointer-events-auto bg-black/50 hover:bg-black/70"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === rawProfile.gallery!.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="p-2 text-white rounded-full pointer-events-auto bg-black/50 hover:bg-black/70"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {rawProfile.gallery && rawProfile.gallery.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform gap-1.5">
                    {rawProfile.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`lg:col-span-2 rounded-2xl bg-white p-6 shadow ${DESKTOP_CARD_H} flex flex-col`}>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 overflow-hidden bg-white border-4 border-white rounded-full shadow">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name[lang]} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-orange-100 to-amber-100">
                      <User size={28} className="text-orange-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">{user.name[lang]}</h1>
                    {rawProfile.verifyStatus === "VERIFIED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle size={14} /> {t("profile.verified")}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-orange-600">{profession?.title[lang]}</div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span className="truncate">{rawProfile.address[lang]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`rounded-full p-2 transition-all ${
                      isFavorite
                        ? "bg-red-100 text-red-500 hover:bg-red-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400"
                    }`}
                    aria-label="favorite"
                  >
                    <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                  </button>
                  <button className="p-2 text-gray-500 transition-colors bg-gray-100 rounded-full hover:bg-gray-200" aria-label="share">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 text-center rounded-xl bg-orange-50">
                  <div className="flex items-center justify-center gap-1 mb-1 text-orange-600">
                    <Star size={14} className="fill-current" />
                    <span className="text-base font-bold">{averageRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t("profile.rating")}</p>
                </div>
                <div className="p-3 text-center rounded-xl bg-blue-50">
                  <div className="flex items-center justify-center gap-1 mb-1 text-blue-600">
                    <Eye size={14} />
                    <span className="text-base font-bold">{profileReviews.length}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t("profile.reviews")}</p>
                </div>
                <div className="p-3 text-center rounded-xl bg-green-50">
                  <div className="flex items-center justify-center gap-1 mb-1 text-green-600">
                    <Award size={14} />
                    <span className="text-base font-bold">
                      {rawProfile.verifyStatus === "VERIFIED" ? "✓" : "○"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{t("profile.verified")}</p>
                </div>
              </div>

              {rawProfile.description?.[lang] && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-bold text-gray-900">{t("profile.about")}</h3>
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-sm leading-relaxed text-gray-700">{clamp(rawProfile.description[lang], 320)}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-3 lg:mt-auto">
                <a
                  href={`tel:${user.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow"
                >
                  <Phone size={18} />
                  {t("profile.call")}
                </a>
                <a
                  href={`https://wa.me/${user.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 px-4 py-2.5 text-sm font-medium text-white hover:shadow"
                >
                  <MessageCircle size={18} />
                  {t("profile.whatsapp")}
                </a>
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow"
                >
                  <Mail size={18} />
                  {t("profile.email")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {t("profile.customerReviews")} ({profileReviews.length})
              </h2>
              {profileReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
                >
                  {showAllReviews ? t("profile.showLess") : t("profile.showAllReviews")}
                </button>
              )}
            </div>

            {profileReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {displayedReviews.map((review) => {
                  const reviewUser = users.find((u) => u.id === review.userId);
                  return (
                    <div key={review.id} className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="overflow-hidden rounded-full h-11 w-11 bg-orange-50">
                          {reviewUser?.avatar ? (
                            <img src={reviewUser.avatar} alt={reviewUser.name[lang]} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <User size={18} className="text-orange-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {reviewUser?.name[lang] || t("reviews.anonymousUser")}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={`${i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                                <span className="ml-1 text-xs text-gray-600">({review.rating}/5)</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 shrink-0">
                              {new Date(review.createdAt).toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR")}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-gray-700">{clamp(review.comment, 260)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="flex items-center justify-center mx-auto mb-2 bg-gray-100 rounded-full h-14 w-14">
                  <Star size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-600">{t("profile.noReviews")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {suggestedProfiles.length > 0 && (
        <section className="py-10">
          <div className="container px-4 mx-auto">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{t("profile.similarProfiles")}</h3>
                <Link to="/profiles" className="text-sm font-medium text-orange-600 hover:underline">
                  {t("common.seeAll")}
                </Link>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="grid grid-flow-col auto-cols-[75%] gap-4 sm:auto-cols-[45%] md:auto-cols-[33%] lg:auto-cols-[25%]">
                  {suggestedProfiles.map((profile) => (
                    <Link
                      key={profile.id}
                      to={`/profile/${profile.id}`}
                      className="relative block p-4 transition bg-white border border-gray-100 shadow-sm group rounded-2xl hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative overflow-hidden h-14 w-14 rounded-xl bg-orange-50">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.userName} className="object-cover w-full h-full transition group-hover:scale-105" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <User size={20} className="text-orange-500" />
                            </div>
                          )}
                          {profile.rating > 0 && (
                            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-[10px] font-bold text-white shadow">
                              <Star size={10} className="mr-0.5 fill-white" />
                              {profile.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600">
                            {profile.userName}
                          </h4>
                          <p className="text-xs font-medium text-orange-600 truncate">{profile.professionName}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye size={12} className="text-gray-400" />
                          <span>
                            {profile.reviewCount} {t("reviews.review_plural")}
                          </span>
                        </div>
                        <span className="flex-1 block h-px mx-2 bg-gradient-to-r from-orange-200 to-transparent" />
                        <span className="text-orange-600">{t("common.view")}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
