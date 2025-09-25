import { memo } from "react";
import { Star, CheckCircle, Calendar, Image as ImageIcon, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/auth/AuthContext";
import type { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: string) => void;
  showArtisanName?: boolean;
  showClientName?: boolean;
  className?: string;
}

const ReviewCard = memo(({ 
  review, 
  onDelete, 
  showArtisanName = false,
  showClientName = true,
  className = "" 
}: ReviewCardProps) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const lang = i18n.language as "ar" | "fr";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const canDelete = user && (
    user.role === "SUPER_ADMIN" || 
    user.role === "ADMIN" || 
    (user.role === "CLIENT" && user.id.toString() === review.clientId.toString())
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              ({review.rating}/5)
            </span>
            {review.isVerified && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {lang === "ar" ? "موثق" : "Vérifié"}
                </span>
              </div>
            )}
          </div>

          {/* Names */}
          <div className="space-y-1">
            {showClientName && (
              <h4 className="font-semibold text-gray-900 text-sm">
                {review.clientName[lang]}
              </h4>
            )}
            {showArtisanName && (
              <p className="text-sm text-gray-600">
                {lang === "ar" ? "الحرفي: " : "Artisan: "}
                <span className="font-medium">{review.artisanName[lang]}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!review.isApproved && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              {lang === "ar" ? "في الانتظار" : "En attente"}
            </span>
          )}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title={lang === "ar" ? "حذف" : "Supprimer"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Project Type & Craft Type */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
          {review.craftType[lang]}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {review.projectType[lang]}
        </span>
      </div>

      {/* Comment */}
      <blockquote className="text-gray-700 leading-relaxed mb-4 text-sm">
        "{review.comment[lang]}"
      </blockquote>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              {lang === "ar" ? "صور المشروع" : "Photos du projet"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {review.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${review.projectType[lang]} ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(review.createdAt)}</span>
        </div>
        
        {review.isApproved && (
          <span className="text-xs text-green-600 font-medium">
            {lang === "ar" ? "منشور" : "Publié"}
          </span>
        )}
      </div>
    </div>
  );
});

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
