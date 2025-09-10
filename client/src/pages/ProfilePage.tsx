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

  // Get profile data
  const rawProfile = profiles.find((p) => p.id === Number(id));
  const user = users.find((u) => u.id === rawProfile?.userId);
  const profession = professions.find((p) => p.id === rawProfile?.professionId);

  // Calculate ratings
  const profileReviews = reviews.filter(
    (r) => r.profileId === Number(id) && r.status === "APPROVED",
  );
  const averageRating =
    profileReviews.length > 0
      ? profileReviews.reduce((sum, r) => sum + r.rating, 0) /
        profileReviews.length
      : 0;

  // Get similar profiles
  const similarProfiles = useMemo(() => {
    if (!rawProfile) return [];
    return profiles
      .filter(
        (p) =>
          p.id !== rawProfile.id && p.professionId === rawProfile.professionId,
      )
      .slice(0, 4)
      .map((profile) => {
        const profileUser = users.find((u) => u.id === profile.userId);
        const profileProfession = professions.find(
          (p) => p.id === profile.professionId,
        );
        const profileReviews = reviews.filter(
          (r) => r.profileId === profile.id && r.status === "APPROVED",
        );
        const rating =
          profileReviews.length > 0
            ? profileReviews.reduce((sum, r) => sum + r.rating, 0) /
              profileReviews.length
            : 0;

        return {
          ...profile,
          userName: profileUser?.name[lang],
          professionName: profileProfession?.title[lang],
          rating,
          reviewCount: profileReviews.length,
        };
      });
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
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <User size={32} className="text-gray-400" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {t("profile.notFound", "البروفايل غير موجود")}
            </h2>
            <p className="mb-6 text-gray-600">
              {t(
                "profile.notFoundDescription",
                "لم يتم العثور على البروفايل المطلوب",
              )}
            </p>
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
            >
              <ArrowLeft size={16} />
              {t("common.backToProfiles", "العودة للبروفايلات")}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const displayedReviews = showAllReviews
    ? profileReviews
    : profileReviews.slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600"
            >
              <ArrowLeft size={16} />
              {t("common.backToProfiles", "العودة للبروفايلات")}
            </Link>
          </div>

          {/* Profile Header */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-xl">
                  {rawProfile.gallery &&
                  rawProfile.gallery[currentImageIndex] ? (
                    <img
                      src={rawProfile.gallery[currentImageIndex]}
                      alt={user.name[lang]}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Image Navigation */}
                {rawProfile.gallery && rawProfile.gallery.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? rawProfile.gallery.length - 1 : prev - 1,
                        )
                      }
                      className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === rawProfile.gallery.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                {/* Image Indicators */}
                {rawProfile.gallery && rawProfile.gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
                    {rawProfile.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {user.name[lang]}
                      </h1>
                      {rawProfile.verifyStatus === "VERIFIED" && (
                        <CheckCircle size={24} className="text-green-500" />
                      )}
                    </div>
                    <p className="mb-2 text-xl font-medium text-orange-600">
                      {profession?.title[lang]}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>{rawProfile.address[lang]}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={toggleFavorite}
                      className={`rounded-full p-3 transition-all ${
                        isFavorite
                          ? "bg-red-100 text-red-500 hover:bg-red-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? "fill-current" : ""}
                      />
                    </button>
                    <button className="rounded-full bg-gray-100 p-3 text-gray-400 transition-colors hover:bg-gray-200">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-orange-50 p-4 text-center">
                    <div className="mb-1 flex items-center justify-center gap-1 text-orange-600">
                      <Star size={16} className="fill-current" />
                      <span className="text-lg font-bold">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t("profile.rating", "التقييم")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 text-center">
                    <div className="mb-1 flex items-center justify-center gap-1 text-blue-600">
                      <Eye size={16} />
                      <span className="text-lg font-bold">
                        {profileReviews.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t("profile.reviews", "تقييم")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4 text-center">
                    <div className="mb-1 flex items-center justify-center gap-1 text-green-600">
                      <Award size={16} />
                      <span className="text-lg font-bold">
                        {rawProfile.verifyStatus === "VERIFIED" ? "✓" : "○"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t("profile.verified", "موثق")}
                    </p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <a
                    href={`tel:${user.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-medium text-white transition-all hover:shadow-lg"
                  >
                    <Phone size={18} />
                    {t("profile.call", "اتصال")}
                  </a>
                  <a
                    href={`https://wa.me/${user.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 px-4 py-3 font-medium text-white transition-all hover:shadow-lg"
                  >
                    <MessageCircle size={18} />
                    {t("profile.whatsapp", "واتساب")}
                  </a>
                  <a
                    href={`mailto:${user.email}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-medium text-white transition-all hover:shadow-lg"
                  >
                    <Mail size={18} />
                    {t("profile.email", "إيميل")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {t("profile.about", "نبذة عن المحترف")}
            </h2>
            <div className="rounded-2xl bg-gray-50 p-8">
              <p className="text-lg leading-relaxed text-gray-700">
                {rawProfile.description[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {rawProfile.gallery && rawProfile.gallery.length > 1 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
                {t("profile.gallery", "معرض الأعمال")}
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {rawProfile.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${user.name[lang]} work ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {t("profile.customerReviews", "آراء العملاء")} (
              {profileReviews.length})
            </h2>

            {profileReviews.length > 0 ? (
              <>
                <div className="space-y-6">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="rounded-2xl bg-gray-50 p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {users.find(u => u.id === review.userId)?.name[lang] || "مستخدم مجهول"}
                          </h4>
                          <div className="mt-1 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < review.rating
                                    ? "fill-current text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            lang === "ar" ? "ar-MA" : "fr-FR",
                          )}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {profileReviews.length > 3 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
                    >
                      {showAllReviews
                        ? t("profile.showLess", "عرض أقل")
                        : t("profile.showAllReviews", "عرض جميع التقييمات")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Star size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-600">
                  {t("profile.noReviews", "لا توجد تقييمات بعد")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar Profiles Section */}
      {similarProfiles.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
                {t("profile.similarProfiles", "محترفون مشابهون")}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {similarProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    to={`/profile/${profile.id}`}
                    className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative mx-auto mb-4 h-20 w-20">
                      {profile.gallery && profile.gallery[0] ? (
                        <img
                          src={profile.gallery[0]}
                          alt={profile.userName}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                      {profile.rating > 0 && (
                        <div className="absolute -top-1 -right-1 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white">
                          <Star size={10} className="fill-white" />
                          <span>{profile.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="mb-1 font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                        {profile.userName}
                      </h3>
                      <p className="mb-2 text-sm font-medium text-orange-600">
                        {profile.professionName}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                        <Eye size={10} />
                        <span>
                          {profile.reviewCount}{" "}
                          {t("reviews.review_plural", "تقييم")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
