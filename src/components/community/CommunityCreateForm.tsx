
import React, { useState } from 'react'
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
import { CommunitySnapshotForm } from "./CommunitySnapshotForm"
import { OnlinePresenceForm } from "./OnlinePresenceForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  location: z.string().min(2, "Location is required"),
  communityType: z.string().optional(),
  format: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  
  launchDate: z.string().optional(),
  memberCount: z.number().default(1),
  memberCapacity: z.number().optional(),
  eventFrequency: z.string().optional(),
  
  website: z.string().url().optional().or(z.literal("")),
  primaryPlatforms: z.array(z.string()).default([]),
  newsletterUrl: z.string().url().optional().or(z.literal("")),
  socialMedia: z.array(z.object({
    platform: z.string().optional(),
    url: z.string().optional()
  })).optional().default([{}, {}, {}]),
  
  founder_name: z.string().min(2, "Founder name is required"),
  role_title: z.string().optional(),
  personal_background: z.string().optional(),
  community_structure: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),

  size_demographics: z.string().optional(),
  team_structure: z.string().optional(),
  tech_stack: z.string().optional(),
  event_formats: z.string().optional(),
  business_model: z.string().optional(),
  challenges: z.string().optional(),
  special_notes: z.string().optional(),
});

export default function CommunityCreateForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { currentUser } = useUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      communityType: "",
      format: "",
      targetAudience: "",
      tone: "",
      
      launchDate: "",
      memberCount: 1,
      memberCapacity: 0,
      eventFrequency: "",
      
      website: "",
      primaryPlatforms: [],
      newsletterUrl: "",
      socialMedia: [{}, {}, {}],
      
      founder_name: currentUser?.name || "",
      role_title: "",
      personal_background: "",
      community_structure: "",
      vision: "",
      community_values: "",
      
      size_demographics: "",
      team_structure: "",
      tech_stack: "",
      event_formats: "",
      business_model: "",
      challenges: "",
      special_notes: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      console.log("Submitting form with values:", values);
      
      const communityData = {
        name: values.name,
        description: values.description,
        location: values.location,
        website: values.website,
        isPublic: true,
        memberCount: values.memberCount || 1,
        organizerIds: [currentUser?.id || ''],
        memberIds: [],
        tags: values.targetAudience ? values.targetAudience.split(',').map(tag => tag.trim()) : [],
        communityType: values.communityType,
        format: values.format,
        tone: values.tone,
        launchDate: values.launchDate,
        memberCapacity: values.memberCapacity,
        eventFrequency: values.eventFrequency,
        newsletterUrl: values.newsletterUrl,
        socialMedia: values.socialMedia?.filter(sm => sm.platform || sm.url),
        primaryPlatforms: values.primaryPlatforms,
      };

      console.log("Creating community with data:", communityData);
      const community = await communityService.createCommunity(communityData);
      console.log("Community created:", community);

      const organizerProfile = {
        community_id: community.id,
        founder_name: values.founder_name,
        role_title: values.role_title,
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

      console.log("Creating organizer profile with data:", organizerProfile);
      await communityService.createOrganizerProfile(organizerProfile);
      console.log("Organizer profile created successfully");

      toast({
        description: "Community created successfully!",
      });

      // Ensure there's a small delay before navigation to allow the toast to show
      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 500);
    } catch (error) {
      console.error('Error creating community:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create community. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
            <TabsTrigger value="online">Online Presence</TabsTrigger>
            <TabsTrigger value="organizer">Organizer</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <BasicCommunityForm form={form} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="snapshot">
              <Card>
                <CardContent className="pt-6">
                  <CommunitySnapshotForm form={form} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="online">
              <Card>
                <CardContent className="pt-6">
                  <OnlinePresenceForm form={form} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="organizer">
              <Card>
                <CardContent className="pt-6">
                  <OrganizerProfileForm form={form} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              const currentTabIndex = ["overview", "snapshot", "online", "organizer"].indexOf(activeTab);
              const prevTab = ["overview", "snapshot", "online", "organizer"][Math.max(0, currentTabIndex - 1)];
              setActiveTab(prevTab);
            }}
            disabled={activeTab === "overview"}
          >
            Previous
          </Button>
          
          {activeTab !== "organizer" ? (
            <Button 
              type="button"
              onClick={() => {
                const currentTabIndex = ["overview", "snapshot", "online", "organizer"].indexOf(activeTab);
                const nextTab = ["overview", "snapshot", "online", "organizer"][Math.min(3, currentTabIndex + 1)];
                setActiveTab(nextTab);
              }}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Community"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
