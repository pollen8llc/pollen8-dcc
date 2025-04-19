
import * as z from "zod"

export const communityFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  location: z.string().min(2, "Location is required"),
  communityType: z.string().optional(),
  format: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  primaryPlatforms: z.array(z.string()).default([]),
  newsletterUrl: z.string().url().optional().or(z.literal("")),
  founder_name: z.string().min(2, "Founder name is required"),
  role_title: z.string().optional(),
  personal_background: z.string().optional(),
  community_structure: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),
});

export type CommunityFormSchema = z.infer<typeof communityFormSchema>;
