
import { z } from "zod";

export const communityFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  communityType: z.string().min(1, "Please select a community type"),
  location: z.string().optional(),
  format: z.string().min(1, "Please select a format"),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
  primaryPlatforms: z.array(z.string()).optional(),
  newsletterUrl: z.string().optional().or(z.literal("")),
  founder_name: z.string().optional(),
  role_title: z.string().optional(),
  personal_background: z.string().optional(),
  community_structure: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),
  // Add social media fields directly to the schema
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  // Change the size field to handle both string and number, transforming string to number
  size: z.union([
    z.string(),
    z.number()
  ]).optional().transform(val => {
    if (typeof val === 'string') {
      // If it's a range like "1-100", extract the max number
      const match = val.match(/\d+-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return val || 0;
  }),
});

export type CommunityFormSchema = z.infer<typeof communityFormSchema>;
