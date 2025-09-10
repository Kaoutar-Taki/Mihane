export interface LocalizedText {
  ar: string;
  fr: string;
}

export interface Testimonial {
  id: string;
  userId: string;
  userType: "client" | "artisan";
  name: {
    ar: string;
    fr: string;
  };
  city: {
    ar: string;
    fr: string;
  };
  rating: number;
  comment: {
    ar: string;
    fr: string;
  };
  avatar: string;
  date: string;
  isVerified: boolean;
}
