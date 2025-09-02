import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, Heart } from "lucide-react";
import { getTriggers } from "@/services/rel8t/triggerService";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";

const BuildRapport = () => {
  const navigate = useNavigate();
  const { setSelectedTrigger } = useRelationshipWizard();
  
  const { data: triggers = [] } = useQuery({
    queryKey: ["triggers"],
    queryFn: getTriggers,
  });

  const handleCreateNewTrigger = () => {
    navigate("/rel8/triggers/wizard?returnTo=relationship");
  };

  const handleSelectTrigger = (trigger: any) => {
    setSelectedTrigger(trigger);
    navigate("/rel8/wizard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Rel8Header />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        
        <div className="flex items-center gap-4 mt-4 sm:mt-6 mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/rel8")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Build Rapport
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Choose a trigger to start building relationships with your contacts
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create New Trigger */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Create New Trigger</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Set up a new automation trigger to manage your relationship outreach
              </p>
              <Button onClick={handleCreateNewTrigger} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Trigger
              </Button>
            </CardContent>
          </Card>

          {/* Select Existing Trigger */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Select Existing Trigger</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {triggers.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm mb-4">
                    Choose from your existing triggers to build relationships
                  </p>
                  {triggers.slice(0, 3).map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{trigger.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {trigger.condition}
                          </Badge>
                          {trigger.is_active && (
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSelectTrigger(trigger)}
                      >
                        Choose
                      </Button>
                    </div>
                  ))}
                  {triggers.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/rel8/triggers")}
                      className="w-full mt-3"
                    >
                      View All Triggers ({triggers.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No triggers found. Create your first trigger to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-6 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">What is Building Rapport?</h3>
                <p className="text-sm text-muted-foreground">
                  Building rapport involves creating meaningful connections with your contacts through 
                  consistent, thoughtful outreach. Choose or create a trigger to automate reminders 
                  and then set up your relationship plan with specific contacts and outreach tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuildRapport;