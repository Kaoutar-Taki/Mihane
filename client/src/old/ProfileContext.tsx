import { createContext, useContext } from "react";

export type ProfileType = {
  id: number;
  fullName: string;
  profession: number;
  city: number;
  image: string;
  description: string;
  gallery: string[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  reviews: {
    id: number;
    name: string;
    rating: number;
    comment: string;
  }[];
};

export const ProfileContext = createContext<ProfileType | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used inside a ProfileContext.Provider");
  return context;
};
