import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle, Clock, Star, Filter, Search, Eye, AlertTriangle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function ReviewApprovalPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    status: "pending" as "all" | "pending" | "approved" | "rejected",
    rating: 0,
    search: ""
  });
  
  const [actionConfirm, setActionConfirm] = useState<{
    reviewId: string;
    action: "approve" | "reject";
  } | null>(null);
  
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const { 
    reviews, 
    loading, 
    error, 
    approveReview,
    rejectReview 
  } = useReviews({
    adminView: true,
    approvedOnly: filters.status === "approved",
    pendingOnly: filters.status === "pending"
  });

  // Filter reviews based on search and rating
  const filteredReviews = reviews.filter(review => {
    // Status filter
    if (filters.status === "pending" && review.isApproved) return false;
    if (filters.status === "approved" && !review.isApproved) return false;
    
    // Rating filter
    if (filters.rating > 0 && review.rating < filters.rating) return false;
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        review.comment.ar.toLowerCase().includes(searchTerm) ||
        review.comment.fr.toLowerCase().includes(searchTerm) ||
        review.clientName.ar.toLowerCase().includes(searchTerm) ||
        review.clientName.fr.toLowerCase().includes(searchTerm) ||
        review.artisanName.ar.toLowerCase().includes(searchTerm) ||
        review.artisanName.fr.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });

  const handleSingleAction = async (reviewId: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await approveReview(reviewId);
      } else {
        await rejectReview(reviewId);
      }
      setActionConfirm(null);
    } catch (error) {
      console.error(`Failed to ${action} review:`, error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedReviews.length === 0) return;
    
    try {
      for (const reviewId of selectedReviews) {
        if (bulkAction === "approve") {
          await approveReview(reviewId);
        } else {
          await rejectReview(reviewId);
        }
      }
      setSelectedReviews([]);
      setBulkAction(null);
    } catch (error) {
      console.error(`Failed to ${bulkAction} reviews:`, error);
    }
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const selectAllReviews = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(r => r.id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (review: any) => {
    if (review.isApproved) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          <CheckCircle className="w-3 h-3" />
          {lang === "ar" ? "معتمد" : "Approuvé"}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          <Clock className="w-3 h-3" />
          {lang === "ar" ? "في الانتظار" : "En attente"}
        </span>
      );
    }
  };

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
            icon={AlertTriangle}
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
            <CheckCircle className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {lang === "ar" ? "إدارة موافقة التقييمات" : "Gestion d'approbation des avis"}
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            {lang === "ar" 
              ? "راجع واعتمد أو ارفض التقييمات المقدمة من العملاء. تأكد من جودة المحتوى قبل النشر العام."
              : "Examinez et approuvez ou rejetez les avis soumis par les clients. Assurez-vous de la qualité du contenu avant la publication publique."
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => !r.isApproved).length}
                </p>
                <p className="text-sm text-gray-600">
                  {lang === "ar" ? "في الانتظار" : "En attente"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.isApproved).length}
                </p>
                <p className="text-sm text-gray-600">
                  {lang === "ar" ? "معتمد" : "Approuvés"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0"}
                </p>
                <p className="text-sm text-gray-600">
                  {lang === "ar" ? "متوسط التقييم" : "Note moyenne"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-sm text-gray-600">
                  {lang === "ar" ? "إجمالي التقييمات" : "Total des avis"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {lang === "ar" ? "التصفية" : "Filtres"}
              </h3>

              {/* Status Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "ar" ? "الحالة" : "Statut"}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">{lang === "ar" ? "جميع التقييمات" : "Tous les avis"}</option>
                  <option value="pending">{lang === "ar" ? "في الانتظار" : "En attente"}</option>
                  <option value="approved">{lang === "ar" ? "معتمد" : "Approuvés"}</option>
                </select>
              </div>

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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Bulk Actions */}
            {selectedReviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedReviews.length} {lang === "ar" ? "تقييم محدد" : "avis sélectionnés"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBulkAction("approve")}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      {lang === "ar" ? "اعتماد الكل" : "Approuver tout"}
                    </button>
                    <button
                      onClick={() => setBulkAction("reject")}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      {lang === "ar" ? "رفض الكل" : "Rejeter tout"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                    onChange={selectAllReviews}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-700">
                    {lang === "ar" 
                      ? `${filteredReviews.length} تقييم من أصل ${reviews.length}`
                      : `${filteredReviews.length} avis sur ${reviews.length}`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <EmptyState
                icon={Clock}
                title={lang === "ar" ? "لا توجد تقييمات" : "Aucun avis"}
                description={
                  filters.search || filters.rating > 0 || filters.status !== "all"
                    ? lang === "ar" ? "لم يتم العثور على تقييمات بالمعايير المحددة" : "Aucun avis trouvé avec les critères spécifiés"
                    : lang === "ar" ? "لا توجد تقييمات للمراجعة" : "Aucun avis à examiner"
                }
                action={
                  (filters.search || filters.rating > 0 || filters.status !== "all") ? {
                    label: lang === "ar" ? "مسح التصفية" : "Effacer les filtres",
                    onClick: () => setFilters({ status: "pending", rating: 0, search: "" })
                  } : undefined
                }
              />
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6">
                    {/* Review Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => toggleReviewSelection(review.id)}
                        className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {lang === "ar" ? review.clientName.ar : review.clientName.fr}
                            </h3>
                            <span className="text-gray-500">→</span>
                            <span className="text-gray-700">
                              {lang === "ar" ? review.artisanName.ar : review.artisanName.fr}
                            </span>
                            {getStatusBadge(review)}
                          </div>
                          
                          {!review.isApproved && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setActionConfirm({ reviewId: review.id, action: "approve" })}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
                              >
                                {lang === "ar" ? "اعتماد" : "Approuver"}
                              </button>
                              <button
                                onClick={() => setActionConfirm({ reviewId: review.id, action: "reject" })}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                              >
                                {lang === "ar" ? "رفض" : "Rejeter"}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1">{review.rating}/5</span>
                          </div>
                          <span>{formatDate(review.createdAt)}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {lang === "ar" ? review.craftType.ar : review.craftType.fr}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-3">
                          {lang === "ar" ? review.comment.ar : review.comment.fr}
                        </p>
                        
                        {review.projectType && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-600">
                              {lang === "ar" ? "نوع المشروع: " : "Type de projet: "}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {lang === "ar" ? review.projectType.ar : review.projectType.fr}
                            </span>
                          </div>
                        )}
                        
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Confirmation Dialog */}
        {actionConfirm && (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setActionConfirm(null)}
            onConfirm={() => handleSingleAction(actionConfirm.reviewId, actionConfirm.action)}
            title={
              actionConfirm.action === "approve" 
                ? (lang === "ar" ? "اعتماد التقييم" : "Approuver l'avis")
                : (lang === "ar" ? "رفض التقييم" : "Rejeter l'avis")
            }
            message={
              actionConfirm.action === "approve"
                ? (lang === "ar" ? "هل أنت متأكد من اعتماد هذا التقييم؟ سيصبح مرئياً للجمهور." : "Êtes-vous sûr d'approuver cet avis ? Il deviendra visible au public.")
                : (lang === "ar" ? "هل أنت متأكد من رفض هذا التقييم؟ لن يظهر للجمهور." : "Êtes-vous sûr de rejeter cet avis ? Il ne sera pas visible au public.")
            }
            confirmText={actionConfirm.action === "approve" ? (lang === "ar" ? "اعتماد" : "Approuver") : (lang === "ar" ? "رفض" : "Rejeter")}
            type={actionConfirm.action === "approve" ? "success" : "danger"}
          />
        )}

        {/* Bulk Action Confirmation Dialog */}
        {bulkAction && (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setBulkAction(null)}
            onConfirm={handleBulkAction}
            title={
              bulkAction === "approve" 
                ? (lang === "ar" ? "اعتماد التقييمات المحددة" : "Approuver les avis sélectionnés")
                : (lang === "ar" ? "رفض التقييمات المحددة" : "Rejeter les avis sélectionnés")
            }
            message={
              bulkAction === "approve"
                ? (lang === "ar" ? `هل أنت متأكد من اعتماد ${selectedReviews.length} تقييم؟` : `Êtes-vous sûr d'approuver ${selectedReviews.length} avis ?`)
                : (lang === "ar" ? `هل أنت متأكد من رفض ${selectedReviews.length} تقييم؟` : `Êtes-vous sûr de rejeter ${selectedReviews.length} avis ?`)
            }
            confirmText={bulkAction === "approve" ? (lang === "ar" ? "اعتماد الكل" : "Approuver tout") : (lang === "ar" ? "رفض الكل" : "Rejeter tout")}
            type={bulkAction === "approve" ? "success" : "danger"}
          />
        )}
      </div>
    </div>
  );
}
