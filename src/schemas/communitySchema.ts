
import { z } from "zod";
import { 
  COMMUNITY_FORMATS, 
  COMMUNITY_TYPES, 
  EVENT_FREQUENCIES,
  type CommunityFormat,
  type CommunityType,
  type EventFrequency
} from "@/constants/communityConstants";

// Social Media Schema
const socialMediaSchema = z.object({
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
});

// Create the community form schema
export const communityFormSchema = z.object({
  name: z.string().min(3, { message: "Community name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.nativeEnum(COMMUNITY_TYPES as Record<string, CommunityType>)
    .default(COMMUNITY_TYPES.TECH),
  format: z.nativeEnum(COMMUNITY_FORMATS as Record<string, CommunityFormat>)
    .default(COMMUNITY_FORMATS.HYBRID),
  location: z.string().optional(),
  targetAudience: z.union([
    z.array(z.string()),
    z.string().optional()
  ]).optional().transform(val => {
    if (typeof val === 'string' && val !== "") {
      return val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return Array.isArray(val) ? val : [];
  }),
  platforms: z.array(z.string()).optional(),
  website: z.string().url({ message: "Website must be a valid URL" }).optional().or(z.literal("")),
  newsletterUrl: z.string().url({ message: "Newsletter URL must be a valid URL" }).optional().or(z.literal("")),
  socialMediaHandles: socialMediaSchema.optional(),
  eventFrequency: z.nativeEnum(EVENT_FREQUENCIES as Record<string, EventFrequency>).optional(),
  size: z.string().optional(),
  foundingDate: z.string().optional(),
  // Add fields for date components
  startDateMonth: z.string().optional(),
  startDateDay: z.string().optional(),
  startDateYear: z.string().optional(),
  communitySize: z.string().optional(),
});

// Export the inferred type
export type CommunityFormData = z.infer<typeof communityFormSchema>;
