import { useMemo } from "react";
import profilesData from "../data/profiles.json";
import professionsData from "../data/professions.json";
import citiesData from "../data/cities.json";
import regionsData from "../data/regions.json";

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
    const totalCraftsmen = profilesData.length;

    const verifiedCraftsmen = profilesData.filter(
      (profile) => profile.reviews && profile.reviews.length > 0,
    ).length;

    let totalRatings = 0;
    let totalReviews = 0;

    profilesData.forEach((profile) => {
      if (profile.reviews && profile.reviews.length > 0) {
        profile.reviews.forEach((review) => {
          totalRatings += review.rating;
          totalReviews++;
        });
      }
    });

    const averageRating = totalReviews > 0 ? totalRatings / totalReviews : 0;

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
