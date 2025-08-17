import { z } from "zod";

export const placeCreateSchema = z.object({
  city: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  neighborhood: z.string().optional(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  website: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  priceLevel: z.string().optional().nullable(),
  features: z.record(z.string(), z.string()).optional(),
  hours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string()
  })).optional(),
  activity: z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.any())
  }).optional()
});
