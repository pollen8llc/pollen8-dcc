
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BasicInfoForm } from "./BasicInfoForm";
import { PlatformsForm } from "./PlatformsForm";
import { SocialMediaForm } from "./SocialMediaForm";
import { useCreateCommunityForm } from "@/hooks/community/useCreateCommunityForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export function CreateCommunityForm() {
  const {
    form,
    isSubmitting,
    submissionError,
    isCheckingAuth,
    hasSession,
    onSubmit,
    handleValidationFailed,
    createdCommunityId
  } = useCreateCommunityForm();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Track form progress
  const updateProgress = (tab: string) => {
    setActiveTab(tab);
    switch(tab) {
      case "basic-info":
        setProgress(33);
        break;
      case "platforms":
        setProgress(66);
        break;
      case "social-media":
        setProgress(100);
        break;
      default:
        setProgress(33);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(async (data) => {
      setIsNavigating(true);
      await onSubmit(data);
      
      // Navigate to the new community page after a short delay
      if (createdCommunityId) {
        setTimeout(() => {
          navigate(`/community/${createdCommunityId}`);
        }, 1500);
      }
    }, handleValidationFailed)(e);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to create a community.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/auth")}>Go to Login</Button>
      </div>
    );
  }
  
  if (isNavigating) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Creating your community</h2>
        <p className="text-muted-foreground mb-8">Please wait while we set things up...</p>
        <Progress value={100} className="w-64 h-2" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Community</h1>
      
      <Progress value={progress} className="mb-8" />
      
      <Form {...form}>
        <form onSubmit={handleSubmitForm} className="space-y-8">
          {submissionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}
          
          <Card className="p-6 bg-black/5 backdrop-blur-sm border border-white/10 shadow-xl">
            <Tabs defaultValue="basic-info" value={activeTab} onValueChange={updateProgress} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-black/20 backdrop-blur-lg">
                <TabsTrigger value="basic-info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="platforms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Platforms
                </TabsTrigger>
                <TabsTrigger value="social-media" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Social Media
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="mt-0 animate-fade-in">
                <BasicInfoForm form={form} />
                <div className="flex justify-end mt-6">
                  <Button 
                    type="button"
                    className="bg-primary/80 backdrop-blur-sm hover:bg-primary/90 text-primary-foreground"
                    onClick={() => updateProgress("platforms")}
                  >
                    Continue to Platforms
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="platforms" className="mt-0 animate-fade-in">
                <PlatformsForm form={form} />
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="backdrop-blur-sm border-white/20"
                    onClick={() => updateProgress("basic-info")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    className="bg-primary/80 backdrop-blur-sm hover:bg-primary/90 text-primary-foreground"
                    onClick={() => updateProgress("social-media")}
                  >
                    Continue to Social Media
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="social-media" className="mt-0 animate-fade-in">
                <SocialMediaForm form={form} />
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="backdrop-blur-sm border-white/20"
                    onClick={() => updateProgress("platforms")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary/80 backdrop-blur-sm hover:bg-primary/90 text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Community"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </form>
      </Form>
    </div>
  );
}
