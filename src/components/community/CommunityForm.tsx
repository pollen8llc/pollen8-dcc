
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CommunityFormData } from "@/schemas/communitySchema";
import { useCommunityForm } from "@/hooks/useCommunityForm";
import { Loader2 } from "lucide-react";

// Form section components
import { BasicDetailsSection } from "./form-sections/BasicDetailsSection";
import { LocationFormatSection } from "./form-sections/LocationFormatSection";
import { OnlinePresenceSection } from "./form-sections/OnlinePresenceSection";
import { AdditionalDetailsSection } from "./form-sections/AdditionalDetailsSection";
import { CommunityPreview } from "./CommunityPreview";

interface CommunityFormProps {
  mode: 'create' | 'edit';
  communityId?: string;
  defaultValues?: Partial<CommunityFormData>;
}

export function CommunityForm({ mode, communityId, defaultValues }: CommunityFormProps) {
  const [activeTab, setActiveTab] = useState("basic-details");
  const { form, isSubmitting, onSubmit } = useCommunityForm({ 
    mode, 
    communityId, 
    defaultValues 
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic-details">Basic Details</TabsTrigger>
            <TabsTrigger value="location-format">Location & Format</TabsTrigger>
            <TabsTrigger value="online-presence">Online Presence</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 p-6">
            <TabsContent value="basic-details" className="space-y-4">
              <BasicDetailsSection />
            </TabsContent>
            
            <TabsContent value="location-format" className="space-y-4">
              <LocationFormatSection />
            </TabsContent>
            
            <TabsContent value="online-presence" className="space-y-4">
              <OnlinePresenceSection />
            </TabsContent>
            
            <TabsContent value="additional" className="space-y-4">
              <AdditionalDetailsSection />
            </TabsContent>
          </Card>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-3">Preview</h3>
            <CommunityPreview formData={form.watch()} />
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h3 className="text-lg font-medium mb-1">Actions</h3>
            
            <div className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  mode === 'create' ? 'Create Community' : 'Update Community'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
                className="w-full"
              >
                Reset Form
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              {mode === 'create' 
                ? "Once created, your community will be immediately available."
                : "Your changes will be applied immediately upon submission."}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
