
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createCommunity } from "@/services/communityService";
import { useUser } from "@/contexts/UserContext";

const formSchema = z.object({
  name: z.string().min(3, { message: "Community name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Please provide a meaningful description" }),
  location: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const CommunityCreateForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      website: "",
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: createCommunity,
    onSuccess: async (data) => {
      toast({
        title: "Community created!",
        description: `${data.name} has been created successfully.`,
      });
      await refreshUser();
      navigate(`/community/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating community:", error);
      toast({
        title: "Error creating community",
        description: "There was a problem creating your community. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Here you would handle the image upload if there was one
    
    createCommunityMutation.mutate({
      name: data.name,
      description: data.description,
      location: data.location || "Remote",
      imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
      website: data.website || "",
      isPublic: true,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Community</CardTitle>
        <CardDescription>
          Start your own community and connect with like-minded people.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sustainable Living Network" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your community will appear to others.
                  </FormDescription>
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
                      placeholder="Tell us about your community's mission and goals..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description to help people understand what your community is about.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Global, New York, Remote" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where is your community based?
                    </FormDescription>
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
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to your community website or social media.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={createCommunityMutation.isPending || isUploading}
              >
                {createCommunityMutation.isPending ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CommunityCreateForm;
