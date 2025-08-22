import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, Heart, Settings } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { useEffect } from "react";

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

  // Check if this is first time setup
  useEffect(() => {
    const setupComplete = localStorage.getItem('rel8_setup_complete');
    if (!setupComplete && contactCount === 0 && categories.length === 0) {
      navigate("/rel8/setup");
    }
  }, [contactCount, categories, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-col gap-4 mb-4 sm:mb-6 mt-2 sm:mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Relationships</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your outreach and nurture your network
              </p>
            </div>
            
            <Button 
              onClick={handleBuildRapport}
              className="flex items-center gap-2 w-full sm:w-auto hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              size="sm"
            >
              <Heart className="h-4 w-4" />
              <span className="sm:inline">Build Rapport</span>
            </Button>
          </div>
        </div>
        
        
        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="outreach">Outreach Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outreach">
            <OutreachList />
          </TabsContent>
          
          <TabsContent value="completed">
            <OutreachList defaultTab="completed" showTabs={false} />
          </TabsContent>
        </Tabs>

        {/* Add empty state with CTA if no outreach tasks exist */}
        {outreachCounts.upcoming + outreachCounts.overdue === 0 && 
          activeTab === "outreach" && (
          <div className="text-center py-8 mt-6 border border-dashed rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium">No outreach tasks</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Build rapport with your contacts to start nurturing your network
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleBuildRapport}>
                <Heart className="h-4 w-4 mr-2" />
                Build Rapport
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/rel8/setup")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Run Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;