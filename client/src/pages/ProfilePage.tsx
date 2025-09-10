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
  Calendar,
  Clock,
  Award,
  Eye,
  Camera,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
} from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import profiles from "../data/artisan-profiles.json";
import professions from "../data/artisan-professions.json";
import reviews from "../data/artisan-reviews.json";
import cities from "../data/moroccan-cities.json";
import regions from "../data/moroccan-regions.json";
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
  const profileCity = cities.find((city) =>
    rawProfile?.address?.ar?.includes(city.ar) || rawProfile?.address?.fr?.includes(city.fr)
  );
  const profileRegion = profileCity ? regions.find((region) => region.id === profileCity.region_id) : null;

  // Calculate ratings
  const profileReviews = reviews.filter((r) => r.profileId === Number(id) && r.status === "APPROVED");
  const averageRating = profileReviews.length > 0 
    ? profileReviews.reduce((sum, r) => sum + r.rating, 0) / profileReviews.length 
    : 0;

  // Get similar profiles
  const similarProfiles = useMemo(() => {
    if (!rawProfile) return [];
    return profiles
      .filter((p) => p.id !== rawProfile.id && p.professionId === rawProfile.professionId)
      .slice(0, 4)
      .map((profile) => {
        const profileUser = users.find((u) => u.id === profile.userId);
        const profileProfession = professions.find((p) => p.id === profile.professionId);
        const profileReviews = reviews.filter((r) => r.profileId === profile.id && r.status === "APPROVED");
        const rating = profileReviews.length > 0 
          ? profileReviews.reduce((sum, r) => sum + r.rating, 0) / profileReviews.length 
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("profile.notFound", "البروفايل غير موجود")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("profile.notFoundDescription", "لم يتم العثور على البروفايل المطلوب")}
            </p>
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <ArrowLeft size={16} />
              {t("common.backToProfiles", "العودة للبروفايلات")}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const displayedReviews = showAllReviews ? profileReviews : profileReviews.slice(0, 3);

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
                  {rawProfile.gallery && rawProfile.gallery[currentImageIndex] ? (
                    <img
                      src={rawProfile.gallery[currentImageIndex]}
                      alt={user.name[lang]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Image Navigation */}
                {rawProfile.gallery && rawProfile.gallery.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? rawProfile.gallery.length - 1 : prev - 1
                      )}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === rawProfile.gallery.length - 1 ? 0 : prev + 1
                      )}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                {/* Image Indicators */}
                {rawProfile.gallery && rawProfile.gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {rawProfile.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {user.name[lang]}
                      </h1>
                      {rawProfile.verifyStatus === "VERIFIED" && (
                        <CheckCircle size={24} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-xl text-orange-600 font-medium mb-2">
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
                      className={`p-3 rounded-full transition-all ${
                        isFavorite 
                          ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400'
                      }`}
                    >
                      <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                    <button className="p-3 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                      <Star size={16} className="fill-current" />
                      <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t("profile.rating", "التقييم")}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Eye size={16} />
                      <span className="font-bold text-lg">{profileReviews.length}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t("profile.reviews", "تقييم")}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Award size={16} />
                      <span className="font-bold text-lg">{rawProfile.verifyStatus === "VERIFIED" ? "✓" : "○"}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t("profile.verified", "موثق")}</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href={`tel:${user.phone}`}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <Phone size={18} />
                    {t("profile.call", "اتصال")}
                  </a>
                  <a
                    href={`https://wa.me/${user.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <MessageCircle size={18} />
                    {t("profile.whatsapp", "واتساب")}
                  </a>
                  <a
                    href={`mailto:${user.email}`}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all"
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("profile.about", "نبذة عن المحترف")}
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {rawProfile.description[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {rawProfile.gallery && rawProfile.gallery.length > 1 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t("profile.gallery", "معرض الأعمال")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rawProfile.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${user.name[lang]} work ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t("profile.customerReviews", "آراء العملاء")} ({profileReviews.length})
            </h2>
            
            {profileReviews.length > 0 ? (
              <>
                <div className="space-y-6">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                {profileReviews.length > 3 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      {showAllReviews 
                        ? t("profile.showLess", "عرض أقل")
                        : t("profile.showAllReviews", "عرض جميع التقييمات")
                      }
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
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
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t("profile.similarProfiles", "محترفون مشابهون")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    to={`/profile/${profile.id}`}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="relative mx-auto h-20 w-20 mb-4">
                      {profile.gallery && profile.gallery[0] ? (
                        <img
                          src={profile.gallery[0]}
                          alt={profile.userName}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                      {profile.rating > 0 && (
                        <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <Star size={10} className="fill-white" />
                          <span>{profile.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                        {profile.userName}
                      </h3>
                      <p className="text-sm text-orange-600 font-medium mb-2">
                        {profile.professionName}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                        <Eye size={10} />
                        <span>{profile.reviewCount} {t("reviews.review_plural", "تقييم")}</span>
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
