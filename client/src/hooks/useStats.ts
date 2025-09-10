import { useMemo } from "react";
import professionsData from "../data/artisan-professions.json";
import citiesData from "../data/moroccan-cities.json";
import regionsData from "../data/moroccan-regions.json";
import reviewsData from "../data/artisan-reviews.json";
import usersData from "../data/platform-users.json";

export interface Stats {
  craftsmen: {
    total: number;
    verified: number;
  };
  professions: {
    total: number;
  };
  regions: {
    total: number;
  };
  cities: {
    total: number;
  };
  ratings: {
    average: number;
    total: number;
  };
  support: {
    availability: string;
  };
}

export function useStats() {
  const stats = useMemo((): Stats => {
    // Count only active artisan users
    const activeArtisans = usersData.filter(
      (user) => user.role === "ARTISAN" && user.isActive
    );
    const totalCraftsmen = activeArtisans.length;

    // Count verified craftsmen (those with approved reviews)
    const profilesWithReviews = new Set();
    reviewsData.forEach((review) => {
      if (review.status === "APPROVED") {
        profilesWithReviews.add(review.profileId);
      }
    });
    const verifiedCraftsmen = profilesWithReviews.size;

    // Calculate real ratings from approved reviews
    const approvedReviews = reviewsData.filter(
      (review) => review.status === "APPROVED"
    );
    
    const totalRatings = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
    const totalReviews = approvedReviews.length;
    const averageRating = totalReviews > 0 ? totalRatings / totalReviews : 4.8;

    return {
      craftsmen: {
        total: totalCraftsmen,
        verified: verifiedCraftsmen,
      },
      professions: {
        total: professionsData.length,
      },
      regions: {
        total: regionsData.length,
      },
      cities: {
        total: citiesData.length,
      },
      ratings: {
        average: Math.round(averageRating * 10) / 10,
        total: totalReviews,
      },
      support: {
        availability: "24/7",
      },
    };
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const getVerificationPercentage = (): number => {
    if (stats.craftsmen.total === 0) return 0;
    return Math.round((stats.craftsmen.verified / stats.craftsmen.total) * 100);
  };

  return {
    stats,
    formatNumber,
    getVerificationPercentage,
  };
}
