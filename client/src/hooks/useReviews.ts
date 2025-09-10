import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Review, ReviewStats, ReviewFormData } from "../types/review";
import reviewsData from "../data/reviews.json";

interface UseReviewsOptions {
  artisanId?: string;
  clientId?: string;
  limit?: number;
  minRating?: number;
  onlyApproved?: boolean;
  onlyVerified?: boolean;
}

export const useReviews = (options: UseReviewsOptions = {}) => {
  const { user } = useAuth();
  const { 
    artisanId, 
    clientId, 
    limit, 
    minRating = 1, 
    onlyApproved = true,
    onlyVerified = false 
  } = options;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filteredReviews = reviewsData as Review[];
        
        // Filter by artisan
        if (artisanId) {
          filteredReviews = filteredReviews.filter(review => review.artisanId === artisanId);
        }
        
        // Filter by client
        if (clientId) {
          filteredReviews = filteredReviews.filter(review => review.clientId === clientId);
        }
        
        // Filter by approval status
        if (onlyApproved) {
          filteredReviews = filteredReviews.filter(review => review.isApproved);
        }
        
        // Filter by verification status
        if (onlyVerified) {
          filteredReviews = filteredReviews.filter(review => review.isVerified);
        }
        
        // Filter by rating
        if (minRating > 1) {
          filteredReviews = filteredReviews.filter(review => review.rating >= minRating);
        }
        
        // Sort by date (newest first)
        filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Apply limit
        if (limit) {
          filteredReviews = filteredReviews.slice(0, limit);
        }
        
        setReviews(filteredReviews);
        setError(null);
      } catch (err) {
        setError("Failed to load reviews");
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [artisanId, clientId, limit, minRating, onlyApproved, onlyVerified]);

  const stats = useMemo((): ReviewStats | null => {
    if (reviews.length === 0) return null;
    
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    
    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length,
    };
    
    const verifiedCount = reviews.filter(r => r.isVerified).length;
    const verifiedPercentage = Math.round((verifiedCount / totalReviews) * 100);
    
    // Reviews from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviews.filter(r => new Date(r.createdAt) > thirtyDaysAgo).length;
    
    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
      verifiedPercentage,
      recentReviews
    };
  }, [reviews]);

  const submitReview = async (reviewData: ReviewFormData): Promise<boolean> => {
    if (!user || user.role !== "CLIENT") {
      throw new Error("Only clients can submit reviews");
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview: Review = {
        id: Date.now().toString(),
        clientId: user.id.toString(),
        artisanId: reviewData.artisanId,
        clientName: {
          ar: user.name,
          fr: user.name
        },
        artisanName: {
          ar: "حرفي", // This would come from artisan data
          fr: "Artisan"
        },
        rating: reviewData.rating,
        comment: {
          ar: reviewData.comment,
          fr: reviewData.comment
        },
        craftType: {
          ar: "حرفة",
          fr: "Artisanat"
        },
        projectType: {
          ar: reviewData.projectType,
          fr: reviewData.projectType
        },
        isApproved: false, // Needs admin approval
        isVerified: false, // Will be verified later
        createdAt: new Date().toISOString(),
        images: [] // Handle image upload separately
      };

      // Save to localStorage (in real app, would send to API)
      const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
      const updatedReviews = [...existingReviews, newReview];
      localStorage.setItem('user_reviews', JSON.stringify(updatedReviews));
      
      // Update local state
      setReviews(prev => [newReview, ...prev]);
      
      return true;
    } catch (err) {
      setError("Failed to submit review");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from localStorage
      const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
      const updatedReviews = existingReviews.filter((r: Review) => r.id !== reviewId);
      localStorage.setItem('user_reviews', JSON.stringify(updatedReviews));
      
      // Update local state
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      
      return true;
    } catch (err) {
      setError("Failed to delete review");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
    error,
    stats,
    submitReview,
    deleteReview,
    refetch: () => {
      setLoading(true);
      setReviews([]);
    }
  };
};
