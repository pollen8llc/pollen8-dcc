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
    navigate("/rel8t/build-rapport");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col gap-4 mb-4 sm:mb-6 mt-2 sm:mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Relationships</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your outreach and nurture your network
              </p>
            </div>
            
            <Button 
              onClick={handleBuildRapport}
              className="flex items-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Heart className="h-4 w-4" />
              <span className="sm:inline">Build Rapport</span>
            </Button>
          </div>
        </div>
        
        {/* Metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-primary" />
                <div className="text-xl sm:text-2xl font-bold">{outreachCounts.upcoming}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-destructive" />
                <div className="text-xl sm:text-2xl font-bold">{outreachCounts.overdue}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-primary" />
                <div className="text-xl sm:text-2xl font-bold">{contactCount}</div>
              </div>
            </CardContent>
          </Card>
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
            <Button onClick={handleBuildRapport}>
              <Heart className="h-4 w-4 mr-2" />
              Build Rapport
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
