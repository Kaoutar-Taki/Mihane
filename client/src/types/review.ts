export interface LocalizedText {
  ar: string;
  fr: string;
}

export interface Review {
  id: string;
  clientId: string;
  artisanId: string;
  clientName: LocalizedText;
  artisanName: LocalizedText;
  rating: number;
  comment: LocalizedText;
  craftType: LocalizedText;
  projectType: LocalizedText;
  isApproved: boolean;
  isVerified: boolean;
  createdAt: string;
  images: string[];
}

export interface ReviewFormData {
  artisanId: string;
  rating: number;
  comment: string;
  projectType: string;
  images?: File[];
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPercentage: number;
  recentReviews: number;
}
