import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Zap } from "lucide-react";
import { getTriggers } from "@/services/rel8t/triggerService";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";

const BuildRapport = () => {
  const navigate = useNavigate();
  const { setSelectedTrigger } = useRelationshipWizard();
  const { currentUser } = useUser();
  
  const { data: triggers = [] } = useQuery({
    queryKey: ["triggers", currentUser?.id],
    queryFn: getTriggers,
    enabled: !!currentUser?.id,
  });

  const formatCondition = (condition: string) => {
    try {
      // Remove escaped quotes and parse if it's a JSON string
      const cleaned = condition.replace(/\\"/g, '"').replace(/^"|"$/g, '');
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    } catch {
      return condition;
    }
  };

  const handleCreateNewTrigger = () => {
    navigate("/rel8/triggers/wizard?returnTo=relationship");
  };

  const handleSelectTrigger = (trigger: any) => {
    setSelectedTrigger(trigger);
    navigate("/rel8/wizard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
        <Rel8OnlyNavigation />
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Build Rapport</h2>
              <p className="text-sm text-muted-foreground">
                Choose a trigger to start building relationships with your contacts
              </p>
            </div>
          </div>
          
          <Button onClick={handleCreateNewTrigger} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Trigger
          </Button>
        </div>

        {/* Glassmorphic Triggers List */}
        <Card className="glass-morphism border-0 backdrop-blur-md">
          <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Select a Trigger</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {triggers.length > 0 ? (
              <div className="space-y-3">
                {triggers.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{trigger.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatCondition(trigger.condition)}
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
                      className="ml-4"
                    >
                      Choose
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary/50" />
                </div>
                <h4 className="font-medium mb-2">No Triggers Yet</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first trigger to start building rapport with your contacts
                </p>
                <Button onClick={handleCreateNewTrigger} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Trigger
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-muted/30 border-0">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
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