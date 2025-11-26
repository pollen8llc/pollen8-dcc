import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, Heart, Upload, Zap, Building2, MessageSquare, Clock, CheckCircle, Globe, ChevronDown } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { useModuleCompletion } from "@/hooks/useModuleCompletion";
import { Rel8BottomNav } from "@/components/rel8t/Rel8BottomNav";
import NetworkMapGlobe from "@/components/rel8t/NetworkMapGlobe";
const Dashboard = () => {
  const navigate = useNavigate();
  const [isNetworkMapOpen, setIsNetworkMapOpen] = useState(false);
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
    navigate("/rel8/wizard");
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

      <div className="container mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
          
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
          
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
          
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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

        {/* Network Map Section */}
        <Collapsible 
          open={isNetworkMapOpen} 
          onOpenChange={setIsNetworkMapOpen}
          className="mb-8"
        >
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md">
            <CollapsibleTrigger className="w-full">
              <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Network Map</h3>
                    <Badge variant="secondary">{contactCount} contacts</Badge>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isNetworkMapOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-6">
                <NetworkMapGlobe />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Outreach Tasks Section */}
        <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md mb-8">
          <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-b border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Outreach Tasks</h3>
                </div>
              </div>
              <Button onClick={handleBuildRapport} size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Build Rapport
              </Button>
            </div>
          </div>
          <CardContent className="pt-6">
            <OutreachList />
          </CardContent>
        </Card>

      </div>

      <Rel8BottomNav />
    </div>
  );
};
export default Dashboard;