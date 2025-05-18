
import { z } from "zod";
import { 
  COMMUNITY_FORMATS, 
  COMMUNITY_TYPES, 
  EVENT_FREQUENCIES,
  COMMUNITY_SIZES
} from "@/constants/communityConstants";

// Social Media Schema
export const SocialMediaSchema = z.object({
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional()
});

// Create the community form schema
export const communitySchema = z.object({
  name: z.string().min(3, { message: "Community name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(Object.values(COMMUNITY_TYPES) as [string, ...string[]]),
  format: z.enum(Object.values(COMMUNITY_FORMATS) as [string, ...string[]]),
  location: z.string().optional(),
  target_audience: z.array(z.string()).optional().or(z.string().optional()),
  platforms: z.array(z.string()).optional(),
  website: z.string().url({ message: "Website must be a valid URL" }).optional().or(z.literal("")),
  newsletter_url: z.string().url({ message: "Newsletter URL must be a valid URL" }).optional().or(z.literal("")),
  social_media: SocialMediaSchema.optional(),
  event_frequency: z.enum(Object.values(EVENT_FREQUENCIES) as [string, ...string[]]).optional(),
  community_size: z.enum(COMMUNITY_SIZES as [string, ...string[]]).optional(),
  is_public: z.boolean().default(true),
  founder_name: z.string().optional(),
  role_title: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),
  community_structure: z.string().optional()
});

export type CommunityFormData = z.infer<typeof communitySchema>;
