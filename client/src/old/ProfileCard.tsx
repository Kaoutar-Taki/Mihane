import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface ProfileCardProps {
  id: string;
  name: string;
  profession: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
}

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
  const { t } = useTranslation();
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="text-yellow-400 text-xs">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="text-yellow-400 text-xs">☆</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300 text-xs">☆</span>);
    }
  }

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
      <span className="text-gray-500">
        {reviewCount} {reviewCount === 1 ? t("reviews.review") : t("reviews.review_plural")}
      </span>
    </div>
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  profession,
  location,
  image,
  rating,
  reviewCount,
}) => {
  return (
    <Link
      to={`/profile/${id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/assets/profiles/default.png";
            }}
          />
        </div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>
        <p className="text-orange-600 font-medium text-xs mb-1">{profession}</p>
        <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
          <span>📍</span>
          <span className="line-clamp-1">{location}</span>
        </p>
        <div className="pt-2 border-t border-gray-100">
          <StarRating rating={rating} reviewCount={reviewCount} />
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
