import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, Heart } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("outreach");
  
  // Get outreach status counts with shorter staleTime
  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 } } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Get contact count
  const { data: contactCount = 0 } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  // Get categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories,
  });

  // Handler for building rapport (renamed from handleCreateRelationship)
  const handleBuildRapport = () => {
    navigate("/rel8/build-rapport");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <Rel8OnlyNavigation />
        
        {/* Header Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl mb-8">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">Relationships</h1>
                  <p className="text-lg text-muted-foreground">
                    Manage your outreach and nurture your network
                  </p>
                </div>
                
                <Button 
                  onClick={handleBuildRapport}
                  className="flex items-center gap-2 w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
                  size="default"
                >
                  <Heart className="h-5 w-5" />
                  <span>Build Rapport</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        
        {/* Main content tabs */}
        <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-0 shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="mb-6 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="outreach" className="data-[state=active]:bg-background/80">Outreach Tasks</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-background/80">Completed</TabsTrigger>
              </TabsList>
          
              <TabsContent value="outreach">
                <OutreachList />
              </TabsContent>
              
              <TabsContent value="completed">
                <OutreachList defaultTab="completed" showTabs={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Add empty state with CTA if no outreach tasks exist */}
        {outreachCounts.upcoming + outreachCounts.overdue === 0 && 
          activeTab === "outreach" && (
          <Card className="overflow-hidden bg-card/30 backdrop-blur-md border-border/50 shadow-lg mt-6">
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No outreach tasks</h3>
              <p className="text-muted-foreground mb-6">
                Build rapport with your contacts to start nurturing your network
              </p>
              <Button onClick={handleBuildRapport} size="lg" className="px-8">
                <Heart className="h-5 w-5 mr-2" />
                Build Rapport
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;