
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

  useEffect(() => {
    addDebugLog('info', 'Community creation form initialized');
    addDebugLog('info', 'Please complete the form to create your community');
    
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          addDebugLog('error', `Auth check failed: ${error.message}`);
        } else if (data.session) {
          addDebugLog('success', `Authenticated as: ${data.session.user.email}`);
          
          // Check roles
          const { data: roles, error: rolesError } = await supabase.rpc(
            'get_user_roles',
            { user_id: data.session.user.id }
          );
          
          if (rolesError) {
            addDebugLog('error', `Role check failed: ${rolesError.message}`);
          } else {
            addDebugLog('info', `User roles: ${JSON.stringify(roles)}`);
          }
        } else {
          addDebugLog('error', 'Not authenticated - please log in');
        }
      } catch (err: any) {
        addDebugLog('error', `Auth check error: ${err.message}`);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Create Your Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build your community presence and connect with like-minded individuals
          </p>
        </div>
        
        <div className="relative mt-8">
          <Progress 
            value={progress} 
            className="h-2.5 bg-secondary/30"
          />
          <span className="absolute right-0 -top-6 text-sm font-medium text-muted-foreground">
            {progress}% Complete
          </span>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-8 glass-dark border-primary/10 shadow-xl backdrop-blur-xl">
              <Tabs value={activeTab} onValueChange={updateProgress} className="w-full">
                <TabsList className="grid grid-cols-3 mb-12 bg-background/50 backdrop-blur-xl border border-primary/20 p-1 rounded-lg">
                  <TabsTrigger 
                    value="basic-info"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="platforms"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Platforms
                  </TabsTrigger>
                  <TabsTrigger 
                    value="social-media"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Social Media
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic-info" className="mt-0 animate-fade-in">
                  <BasicInfoForm form={form} />
                  <div className="flex justify-end mt-8">
                    <Button 
                      type="button"
                      className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
                      onClick={() => updateProgress("platforms")}
                    >
                      Continue to Platforms
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="platforms" className="mt-0 animate-fade-in">
                  <PlatformsForm form={form} />
                  <div className="flex justify-between mt-8">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-white/20 hover:bg-accent/10"
                      onClick={() => updateProgress("basic-info")}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button"
                      className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
                      onClick={() => updateProgress("social-media")}
                    >
                      Continue to Social Media
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="social-media" className="mt-0 animate-fade-in">
                  <SocialMediaForm form={form} />
                  <div className="flex justify-between mt-8">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-white/20 hover:bg-accent/10"
                      onClick={() => updateProgress("platforms")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Community...
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

        <FormDebugger logs={debugLogs} />
      </div>
    </div>
  );
}
