import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, Heart, Settings, Upload, Zap, Building2, MessageSquare, Clock, CheckCircle } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { useModuleCompletion } from "@/hooks/useModuleCompletion";
import { useEffect } from "react";
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("outreach");
  const {
    rel8_complete,
    loading: completionLoading
  } = useModuleCompletion();

  // Get outreach status counts with shorter staleTime
  const {
    data: outreachCounts = {
      today: 0,
      upcoming: 0,
      overdue: 0,
      completed: 0
    }
  } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
    staleTime: 1000 * 60 // 1 minute
  });

  // Get contact count
  const {
    data: contactCount = 0
  } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount
  });

  // Get categories for filters
  const {
    data: categories = []
  } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories
  });

  // Handler for building rapport (renamed from handleCreateRelationship)
  const handleBuildRapport = () => {
    navigate("/rel8/build-rapport");
  };

  // Check REL8 setup status - only use database state
  useEffect(() => {
    if (!completionLoading && rel8_complete === false) {
      navigate("/rel8/setup");
    }
  }, [completionLoading, rel8_complete, navigate]);

  // Quick stats calculations
  const quickStats = {
    totalContacts: contactCount,
    activeOutreach: outreachCounts.upcoming + outreachCounts.overdue,
    completedTasks: outreachCounts.completed,
    totalCategories: categories.length
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Rel8Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contacts</p>
                  <p className="text-2xl font-bold">{quickStats.totalContacts}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Outreach</p>
                  <p className="text-2xl font-bold">{quickStats.activeOutreach}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold">{quickStats.completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Categories</p>
                  <p className="text-2xl font-bold">{quickStats.totalCategories}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/rel8/contacts" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Contacts</h3>
                    <p className="text-sm text-muted-foreground">View, edit, and organize your contact list</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/rel8/import" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Import Contacts</h3>
                    <p className="text-sm text-muted-foreground">Import contacts from CSV, email, phone, or websites</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/rel8/triggers" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Triggers</h3>
                    <p className="text-sm text-muted-foreground">Set up automated reminders and follow-up sequences</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/rel8/categories" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Organize Categories</h3>
                    <p className="text-sm text-muted-foreground">Create and manage contact categories and tags</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 flex flex-col h-full" onClick={handleBuildRapport}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Build Rapport</h3>
                  <p className="text-sm text-muted-foreground">Create personalized outreach campaigns to nurture relationships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/nmn8" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Nomin8 Community</h3>
                    <p className="text-sm text-muted-foreground">Track and engage with your community members and supporters</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Outreach Tasks Section */}
        <Card className="glassmorphic-card">
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
            {outreachCounts.upcoming + outreachCounts.overdue === 0 && activeTab === "outreach"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;