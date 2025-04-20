
import * as z from "zod";

export const communityFormSchema = z.object({
  // Basic Info
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["tech", "creative", "wellness", "professional", "social-impact", "education", "social", "other"], {
    required_error: "Please select a community type",
  }),
  format: z.enum(["online", "in-person", "hybrid"], {
    required_error: "Please select a format",
  }),
  
  // Location and Audience
  location: z.string().min(2, "Location is required"),
  targetAudience: z.string().min(2, "Target audience is required"),

  // Platforms
  platforms: z.array(z.string()).default([]),
  
  // Web Presence
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  newsletterUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  
  // Social Media
  socialMediaHandles: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
  }).optional(),

  // Additional fields
  startDate: z.date().optional().nullable(),
  communitySize: z.string().optional(),
  eventFrequency: z.string().optional(),
});

export type CommunityFormData = z.infer<typeof communityFormSchema>;
