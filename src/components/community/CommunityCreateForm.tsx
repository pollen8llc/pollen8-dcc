
import { zodResolver } from "@hookform/resolver/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import * as communityService from "@/services/communityService"

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
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
      tech_structure: "",
      event_formats: "",
      business_model: "",
      community_values: "",
      challenges: "",
      vision: "",
      special_notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const communityData = {
        name: values.name,
        description: values.description,
        location: values.location,
        website: values.website,
        isPublic: true,
        memberCount: 1,  // Starting with the founder
        organizerIds: [currentUser?.id || ''],
        memberIds: [],
        tags: [],
      };

      const community = await communityService.createCommunity(communityData);

      // Create organizer profile
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
      console.error('Error creating community:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create community. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Community Details</CardTitle>
            <CardDescription>
              Basic information about your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter community name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your community's purpose and mission"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country or Remote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizer Profile</CardTitle>
            <CardDescription>
              Tell us about yourself and your vision for the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="founder_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founder Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal_background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Background</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your background and experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Community Structure */}
            <FormField
              control={form.control}
              name="community_structure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Structure</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How is your community organized?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vision */}
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vision</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's your vision for this community?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Community Values */}
            <FormField
              control={form.control}
              name="community_values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Values</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What values drive your community?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Create Community
          </Button>
        </div>
      </form>
    </Form>
  );
}
