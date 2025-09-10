import { memo } from "react";
import { Star, Award, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReviewStats as ReviewStatsType } from "../../types/review";

interface ReviewStatsProps {
  stats: ReviewStatsType;
  className?: string;
}

const ReviewStats = memo(({ stats, className = "" }: ReviewStatsProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
    
    return (
      <div key={rating} className="flex items-center gap-3">
        <div className="flex items-center gap-1 w-12">
          <span className="text-sm font-medium">{rating}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {lang === "ar" ? "إحصائيات التقييمات" : "Statistiques des avis"}
      </h3>

      {/* Overall Rating */}
      <div className="text-center mb-6 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {stats.averageRating}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(stats.averageRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {lang === "ar" ? "من أصل" : "sur"} 5 ({stats.totalReviews} {lang === "ar" ? "تقييم" : "avis"})
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          {lang === "ar" ? "توزيع التقييمات" : "Distribution des notes"}
        </h4>
        {[5, 4, 3, 2, 1].map(rating => 
          renderRatingBar(rating, stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Award className="w-4 h-4 text-green-500" />
            <span className="text-lg font-semibold text-gray-900">
              {stats.verifiedPercentage}%
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {lang === "ar" ? "موثق" : "Vérifiés"}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-semibold text-gray-900">
              {stats.recentReviews}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {lang === "ar" ? "هذا الشهر" : "Ce mois"}
          </p>
        </div>
      </div>
    </div>
  );
});

ReviewStats.displayName = "ReviewStats";

export default ReviewStats;
