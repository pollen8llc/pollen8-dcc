
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { BasicInfoForm } from "./BasicInfoForm";
import { PlatformsForm } from "./PlatformsForm";
import { SocialMediaForm } from "./SocialMediaForm";
import { useCreateCommunityForm } from "@/hooks/useCreateCommunityForm";
import { FormDebugger } from "@/components/debug/FormDebugger";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function CreateCommunityForm() {
  const {
    form,
    isSubmitting,
    activeTab,
    progress,
    updateProgress,
    onSubmit,
    debugLogs,
    addDebugLog
  } = useCreateCommunityForm();

  // Add initial debug log on mount, using a proper dependency array to prevent infinite loops
  useEffect(() => {
    // Only run this effect once on component mount
    addDebugLog('info', 'Community creation form initialized');
    addDebugLog('info', 'Please complete the form to create your community');
    
    // Check authentication status
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          addDebugLog('error', `Auth check failed: ${error.message}`);
        } else if (data.session) {
          addDebugLog('success', `Authenticated as: ${data.session.user.email}`);
        } else {
          addDebugLog('error', 'Not authenticated - please log in');
        }
      } catch (err: any) {
        addDebugLog('error', `Auth check error: ${err.message}`);
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Community</h1>
      
      <Progress value={progress} className="mb-8" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="p-6 bg-black/5 backdrop-blur-sm border border-white/10 shadow-xl">
            <Tabs value={activeTab} onValueChange={updateProgress} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-black/20 backdrop-blur-lg">
                <TabsTrigger 
                  value="basic-info" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="platforms" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Platforms
                </TabsTrigger>
                <TabsTrigger 
                  value="social-media" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
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

      {/* Render the debugger separately to avoid rendering issues */}
      <FormDebugger logs={debugLogs} />
    </div>
  );
};
