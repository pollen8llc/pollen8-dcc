
import React from 'react';
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicCommunityForm } from "./BasicCommunityForm";
import { OrganizerProfileForm } from "./OrganizerProfileForm";
import { CommunitySnapshotForm } from "./CommunitySnapshotForm";
import { OnlinePresenceForm } from "./OnlinePresenceForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunityForm } from "@/hooks/community/useCommunityForm";

interface CommunityCreateFormProps {
  onSuccess?: (communityId: string) => void;
}

export default function CommunityCreateForm({ onSuccess }: CommunityCreateFormProps) {
  const {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    submissionError,
    handleSubmit,
  } = useCommunityForm(onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {submissionError && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
            <p className="font-medium">Error creating community:</p>
            <p>{submissionError}</p>
          </div>
        )}
        
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
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Creating..." : "Create Community"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
