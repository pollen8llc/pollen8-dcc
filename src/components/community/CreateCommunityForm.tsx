
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCommunity } from "@/hooks/useCreateCommunity";
import { communityFormSchema, type CommunityFormData } from "@/schemas/communitySchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export function CreateCommunityForm() {
  const { createCommunity, isSubmitting } = useCreateCommunity();
  
  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      website: "",
      founder_name: "",
      role_title: "",
      community_structure: "",
      personal_background: "",
      vision: "",
      community_values: "",
    },
  });

  const onSubmit = (data: CommunityFormData) => {
    createCommunity(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
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
                      placeholder="Describe your community"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Remote, New York, Global" {...field} />
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
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="founder_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Community Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Vision (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What's your vision for this community?"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="community_values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Values (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What values guide your community?"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Community"}
          </Button>
        </Card>
      </form>
    </Form>
  );
}
