
import * as z from "zod";

export const communityFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  communityType: z.enum(["tech", "creative", "wellness", "professional", "social-impact", "education", "social", "other"], {
    required_error: "Please select a community type",
  }),
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  targetAudience: z.string().min(2, "Target audience is required"),
  format: z.enum(["irl", "url", "hybrid"], {
    required_error: "Please select a format",
  }),
  size: z.number().min(0, "Size must be a positive number"),
  eventFrequency: z.enum([
    "daily",
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "adhoc"
  ], {
    required_error: "Please select event frequency",
  }),
  platforms: z.array(z.enum([
    "discord",
    "slack",
    "whatsapp",
    "luma",
    "eventbrite",
    "meetup",
    "circle",
    "hivebrite",
    "skool"
  ])).default([]),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  newsletterUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  socialMediaHandles: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
  }).optional(),
  // Add missing properties
  vision: z.string().optional().nullable(),
  community_structure: z.string().optional().nullable(),
  role_title: z.string().optional().nullable(),
  tone: z.enum(["casual", "professional", "experimental", "reflective", "playful", "serious"]).optional(),
});

export type CommunityFormData = z.infer<typeof communityFormSchema>;
