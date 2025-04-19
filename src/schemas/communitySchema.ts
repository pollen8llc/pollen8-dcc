
import * as z from "zod";

export const communityFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  communityType: z.enum(["tech", "creative", "wellness", "professional", "social-impact"], {
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
  website: z.string().url().optional().or(z.literal("")),
  mainPlatform: z.enum([
    "whatsapp",
    "discord",
    "slack",
    "facebook",
    "telegram",
    "other"
  ], {
    required_error: "Please select main platform",
  }),
  newsletterUrl: z.string().url().optional().or(z.literal("")),
  socialMediaHandles: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
  }).optional(),
});

export type CommunityFormData = z.infer<typeof communityFormSchema>;
