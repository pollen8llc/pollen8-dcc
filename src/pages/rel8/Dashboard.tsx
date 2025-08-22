import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, Heart, Settings, Upload, Zap, Building2, MessageSquare, Clock, CheckCircle } from "lucide-react";
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

  // Quick stats calculations
  const quickStats = {
    totalContacts: contactCount,
    activeOutreach: outreachCounts.upcoming + outreachCounts.overdue,
    completedTasks: outreachCounts.completed,
    totalCategories: categories.length
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="w-full px-4 py-8">
        <Rel8OnlyNavigation />
        
        {/* Header */}
        <div className="mb-8 mt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Relationships Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Manage your outreach and nurture your network
              </p>
            </div>
            
            <Button 
              onClick={handleBuildRapport}
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
            >
              <Heart className="h-4 w-4" />
              Build Rapport
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contacts</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalContacts}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Outreach</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.activeOutreach}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalCategories}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/rel8/contacts">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Manage Contacts
                </CardTitle>
                <CardDescription>
                  View, edit, and organize your contact list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  View Contacts
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/rel8/import">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  Import Contacts
                </CardTitle>
                <CardDescription>
                  Import contacts from CSV, email, phone, or websites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Import Now
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/rel8/triggers">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary" />
                  Manage Triggers
                </CardTitle>
                <CardDescription>
                  Set up automated reminders and follow-up sequences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Setup Triggers
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/rel8/categories">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  Organize Categories
                </CardTitle>
                <CardDescription>
                  Create and manage contact categories and tags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Manage Categories
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                Build Rapport
              </CardTitle>
              <CardDescription>
                Create personalized outreach campaigns to nurture relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handleBuildRapport}
              >
                Start Building
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/nmn8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Nomin8 Community
                </CardTitle>
                <CardDescription>
                  Track and engage with your community members and supporters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Manage Community
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Outreach Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Outreach Tasks</span>
              <Button onClick={handleBuildRapport} size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Build Rapport
              </Button>
            </CardTitle>
            <CardDescription>
              Manage your relationship building activities and follow-ups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="outreach">Active Tasks</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="outreach">
                <OutreachList />
              </TabsContent>
              
              <TabsContent value="completed">
                <OutreachList defaultTab="completed" showTabs={false} />
              </TabsContent>
            </Tabs>

            {/* Empty state */}
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;