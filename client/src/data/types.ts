import { z } from "zod";

export const Lang = z.enum(["ar", "fr"]);
export type Lang = z.infer<typeof Lang>;

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

export interface FAQ {
  id: number;
  category: string;
  priority: number;
  isActive: boolean;
  question: {
    ar: string;
    fr: string;
  };
  answer: {
    ar: string;
    fr: string;
  };
}

export const RegionSchema = z.object({
  id: z.number(),
  ar: z.string(),
  fr: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;

export const CitySchema = z.object({
  id: z.number(),
  ar: z.string(),
  fr: z.string(),
  region_id: z.number(),
});
export type City = z.infer<typeof CitySchema>;

export const ProfessionSchema = z.object({
  id: z.number(),
  title: z.object({ ar: z.string(), fr: z.string() }),
  image: z.string().optional(),
});
export type Profession = z.infer<typeof ProfessionSchema>;

export const ProfileSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  profession_id: z.number(),
  city_id: z.number(),
  genre_id: z.number().optional(),
  image: z.string(),
  description: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  contact: z.object({
    whatsapp: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  reviews: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        rating: z.number(),
        comment: z.string(),
      }),
    )
    .default([]),
});
export type Profile = z.infer<typeof ProfileSchema>;
