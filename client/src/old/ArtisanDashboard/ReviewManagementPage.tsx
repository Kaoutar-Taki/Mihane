import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star, Filter, Search, Eye, MessageSquare, Calendar, Award } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import ReviewCard from "../../components/reviews/ReviewCard";
import ReviewStats from "../../components/reviews/ReviewStats";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function ReviewManagementPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    rating: 0,
    approved: "all" as "all" | "approved" | "pending",
    search: ""
  });

  const { 
    reviews, 
    loading, 
    error, 
    stats, 
    deleteReview 
  } = useReviews({
    artisanId: user?.id,
    minRating: filters.rating,
    approvedOnly: filters.approved === "approved",
    pendingOnly: filters.approved === "pending"
  });

  const filteredReviews = reviews.filter(review => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        review.comment.ar.toLowerCase().includes(searchTerm) ||
        review.comment.fr.toLowerCase().includes(searchTerm) ||
        review.clientName.ar.toLowerCase().includes(searchTerm) ||
        review.clientName.fr.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={MessageSquare}
            title={lang === "ar" ? "خطأ في تحميل التقييمات" : "Erreur de chargement"}
            description={lang === "ar" ? "حدث خطأ أثناء تحميل التقييمات" : "Une erreur s'est produite lors du chargement des avis"}
            action={{
              label: lang === "ar" ? "إعادة المحاولة" : "Réessayer",
              onClick: () => window.location.reload()
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {lang === "ar" ? "إدارة التقييمات" : "Gestion des avis"}
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            {lang === "ar" 
              ? "اعرض وأدر جميع التقييمات التي تلقيتها من العملاء. تابع إحصائياتك وتفاعل مع ملاحظات العملاء."
              : "Consultez et gérez tous les avis reçus de vos clients. Suivez vos statistiques et interagissez avec les commentaires des clients."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats and Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics */}
            {stats && <ReviewStats stats={stats} />}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {lang === "ar" ? "التصفية" : "Filtres"}
              </h3>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "ar" ? "البحث" : "Recherche"}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder={lang === "ar" ? "ابحث في التقييمات..." : "Rechercher dans les avis..."}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "ar" ? "التقييم الأدنى" : "Note minimum"}
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={0}>{lang === "ar" ? "جميع التقييمات" : "Toutes les notes"}</option>
                  <option value={1}>1+ ⭐</option>
                  <option value={2}>2+ ⭐</option>
                  <option value={3}>3+ ⭐</option>
                  <option value={4}>4+ ⭐</option>
                  <option value={5}>5 ⭐</option>
                </select>
              </div>

              {/* Approval Status Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "ar" ? "حالة الموافقة" : "Statut d'approbation"}
                </label>
                <select
                  value={filters.approved}
                  onChange={(e) => setFilters(prev => ({ ...prev, approved: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">{lang === "ar" ? "جميع التقييمات" : "Tous les avis"}</option>
                  <option value="approved">{lang === "ar" ? "المعتمدة" : "Approuvés"}</option>
                  <option value="pending">{lang === "ar" ? "في الانتظار" : "En attente"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content - Reviews List */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    {lang === "ar" 
                      ? `${filteredReviews.length} تقييم من أصل ${reviews.length}`
                      : `${filteredReviews.length} avis sur ${reviews.length}`
                    }
                  </span>
                </div>
                
                {stats && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{stats.averageRating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>{stats.verifiedPercentage}% {lang === "ar" ? "موثق" : "vérifiés"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title={lang === "ar" ? "لا توجد تقييمات" : "Aucun avis"}
                description={
                  filters.search || filters.rating > 0 || filters.approved !== "all"
                    ? lang === "ar" ? "لم يتم العثور على تقييمات بالمعايير المحددة" : "Aucun avis trouvé avec les critères spécifiés"
                    : lang === "ar" ? "لم تتلق أي تقييمات بعد" : "Vous n'avez pas encore reçu d'avis"
                }
                action={
                  (filters.search || filters.rating > 0 || filters.approved !== "all") ? {
                    label: lang === "ar" ? "مسح التصفية" : "Effacer les filtres",
                    onClick: () => setFilters({ rating: 0, approved: "all", search: "" })
                  } : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredReviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={deleteReview}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
