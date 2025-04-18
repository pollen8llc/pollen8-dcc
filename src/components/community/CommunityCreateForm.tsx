import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import * as communityService from "@/services/communityService"
import { BasicCommunityForm } from "./BasicCommunityForm"
import { OrganizerProfileForm } from "./OrganizerProfileForm"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  location: z.string().min(2, "Location is required"),
  website: z.string().url().optional().or(z.literal("")),
  founder_name: z.string().min(2, "Founder name is required"),
  personal_background: z.string().optional(),
  size_demographics: z.string().optional(),
  community_structure: z.string().optional(),
  team_structure: z.string().optional(),
  tech_stack: z.string().optional(),
  event_formats: z.string().optional(),
  business_model: z.string().optional(),
  community_values: z.string().optional(),
  challenges: z.string().optional(),
  vision: z.string().optional(),
  special_notes: z.string().optional(),
});

export default function CommunityCreateForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { currentUser } = useUser()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      website: "",
      founder_name: currentUser?.name || "",
      personal_background: "",
      size_demographics: "",
      community_structure: "",
      team_structure: "",
      tech_stack: "",
      event_formats: "",
      business_model: "",
      community_values: "",
      challenges: "",
      vision: "",
      special_notes: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const communityData = {
        name: values.name,
        description: values.description,
        location: values.location,
        website: values.website,
        isPublic: true,
        memberCount: 1,
        organizerIds: [currentUser?.id || ''],
        memberIds: [],
        tags: [],
      };

      const community = await communityService.createCommunity(communityData);

      const organizerProfile = {
        community_id: community.id,
        founder_name: values.founder_name,
        personal_background: values.personal_background,
        size_demographics: values.size_demographics,
        community_structure: values.community_structure,
        team_structure: values.team_structure,
        tech_stack: values.tech_stack,
        event_formats: values.event_formats,
        business_model: values.business_model,
        community_values: values.community_values,
        challenges: values.challenges,
        vision: values.vision,
        special_notes: values.special_notes,
      };

      await communityService.createOrganizerProfile(organizerProfile);

      toast({
        description: "Community created successfully!",
      });

      navigate(`/community/${community.id}`);
    } catch (error) {
      console.error('Error creating community:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create community. Please try again.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Community Details</CardTitle>
            <CardDescription>Basic information about your community</CardDescription>
          </CardHeader>
          <CardContent>
            <BasicCommunityForm form={form} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizer Profile</CardTitle>
            <CardDescription>Tell us about yourself and your vision for the community</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizerProfileForm form={form} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Create Community</Button>
        </div>
      </form>
    </Form>
  )
}
