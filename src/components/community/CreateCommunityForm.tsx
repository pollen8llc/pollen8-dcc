
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Link, Share2 } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Create Your Community
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to establish your community presence
          </p>
        </div>
        
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-2 bg-secondary/30"
          />
          <span className="absolute right-0 top-4 text-sm text-muted-foreground">
            {progress}% Complete
          </span>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-6 glass-dark shadow-2xl border-primary/10">
              <Tabs value={activeTab} onValueChange={updateProgress} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-background/50 backdrop-blur-xl border border-primary/20">
                  <TabsTrigger 
                    value="basic-info" 
                    className="data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground backdrop-blur-sm transition-all duration-300"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="platforms" 
                    className="data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground backdrop-blur-sm transition-all duration-300"
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Platforms
                  </TabsTrigger>
                  <TabsTrigger 
                    value="social-media" 
                    className="data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground backdrop-blur-sm transition-all duration-300"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
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

        {/* Form debugger */}
        <FormDebugger logs={debugLogs} />
      </div>
    </div>
  );
}
