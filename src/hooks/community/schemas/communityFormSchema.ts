
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
  size: z.string().or(z.number()).optional().transform(val => 
    typeof val === 'string' ? parseInt(val) || 0 : val
  ),
});

export type CommunityFormSchema = z.infer<typeof communityFormSchema>;
