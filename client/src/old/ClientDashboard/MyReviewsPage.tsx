import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Star, Clock, CheckCircle, XCircle, Edit, Trash2, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useReviews } from "../../hooks/useReviews";
import ReviewSubmissionForm from "../../components/reviews/ReviewSubmissionForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function MyReviewsPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";
  const { user } = useAuth();
  
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { 
    reviews, 
    loading, 
    error, 
    deleteReview 
  } = useReviews({
    clientId: user?.id
  });

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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
            icon={MessageSquare}
            title={lang === "ar" ? "خطأ في تحميل التقييمات" : "Erreur de chargement"}
            description={lang === "ar" ? "حدث خطأ أثناء تحميل تقييماتك" : "Une erreur s'est produite lors du chargement de vos avis"}
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                {lang === "ar" ? "تقييماتي" : "Mes avis"}
              </h1>
            </div>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {lang === "ar" ? "إضافة تقييم" : "Ajouter un avis"}
            </button>
          </div>
          <p className="text-gray-600 max-w-2xl">
            {lang === "ar" 
              ? "اعرض وأدر جميع التقييمات التي قدمتها للحرفيين. تابع حالة الموافقة وقم بتعديل تقييماتك."
              : "Consultez et gérez tous les avis que vous avez soumis aux artisans. Suivez le statut d'approbation et modifiez vos avis."
            }
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-sm text-gray-600">
                  {lang === "ar" ? "إجمالي التقييمات" : "Total des avis"}
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
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={lang === "ar" ? "لا توجد تقييمات" : "Aucun avis"}
            description={lang === "ar" ? "لم تقم بإضافة أي تقييمات بعد" : "Vous n'avez pas encore ajouté d'avis"}
            action={{
              label: lang === "ar" ? "إضافة تقييم" : "Ajouter un avis",
              onClick: () => setShowSubmissionForm(true)
            }}
          />
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lang === "ar" ? review.artisanName.ar : review.artisanName.fr}
                      </h3>
                      {getStatusBadge(review)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        {review.rating}/5
                      </span>
                      <span>{formatDate(review.createdAt)}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {lang === "ar" ? review.craftType.ar : review.craftType.fr}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteConfirm(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={lang === "ar" ? "حذف التقييم" : "Supprimer l'avis"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {lang === "ar" ? review.comment.ar : review.comment.fr}
                  </p>
                </div>

                {/* Project Type */}
                {review.projectType && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">
                      {lang === "ar" ? "نوع المشروع: " : "Type de projet: "}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {lang === "ar" ? review.projectType.ar : review.projectType.fr}
                    </span>
                  </div>
                )}

                {/* Images */}
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

                {/* Verification Badge */}
                {review.isVerified && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {lang === "ar" ? "تقييم موثق" : "Avis vérifié"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review Submission Form Modal */}
        {showSubmissionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {lang === "ar" ? "إضافة تقييم جديد" : "Ajouter un nouvel avis"}
                  </h2>
                  <button
                    onClick={() => setShowSubmissionForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <ReviewSubmissionForm
                  onSuccess={() => {
                    setShowSubmissionForm(false);
                    window.location.reload(); // Refresh to show new review
                  }}
                  onCancel={() => setShowSubmissionForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={() => handleDeleteReview(deleteConfirm)}
            title={lang === "ar" ? "حذف التقييم" : "Supprimer l'avis"}
            message={lang === "ar" ? "هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء." : "Êtes-vous sûr de vouloir supprimer cet avis ? Cette action ne peut pas être annulée."}
            confirmText={lang === "ar" ? "حذف" : "Supprimer"}
            type="danger"
          />
        )}
      </div>
    </div>
  );
}
