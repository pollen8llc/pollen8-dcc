
import React from 'react';
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicCommunityForm } from "./BasicCommunityForm";
import { CommunitySnapshotForm } from "./CommunitySnapshotForm";
import { OnlinePresenceForm } from "./OnlinePresenceForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunityForm } from "@/hooks/community/useCommunityForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
    createdCommunityId,
  } = useCommunityForm(onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {submissionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error creating community</AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}
        
        {createdCommunityId && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Community Created</AlertTitle>
            <AlertDescription>Your community has been created successfully. Redirecting you in a moment...</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
            <TabsTrigger value="online">Online Presence</TabsTrigger>
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
          </div>
        </Tabs>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              const currentTabIndex = ["overview", "snapshot", "online"].indexOf(activeTab);
              const prevTab = ["overview", "snapshot", "online"][Math.max(0, currentTabIndex - 1)];
              setActiveTab(prevTab);
            }}
            disabled={activeTab === "overview" || isSubmitting}
          >
            Previous
          </Button>
          
          {activeTab !== "online" ? (
            <Button 
              type="button"
              onClick={() => {
                const currentTabIndex = ["overview", "snapshot", "online"].indexOf(activeTab);
                const nextTab = ["overview", "snapshot", "online"][Math.min(2, currentTabIndex + 1)];
                setActiveTab(nextTab);
              }}
              disabled={isSubmitting}
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
