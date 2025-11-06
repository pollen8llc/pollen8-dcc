import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, Heart, Upload, Zap, Building2, MessageSquare, Clock, CheckCircle } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { useModuleCompletion } from "@/hooks/useModuleCompletion";
import { useEffect } from "react";
const Dashboard = () => {
  const navigate = useNavigate();
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

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/rel8/contacts" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Manage Contacts</CardTitle>
                    <p className="text-sm text-muted-foreground">View, edit, and organize your contact list</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/rel8/import" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30">
                    <Upload className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Import Contacts</CardTitle>
                    <p className="text-sm text-muted-foreground">Import contacts from CSV, email, phone, or websites</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/rel8/triggers" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-green-500/15 border border-green-500/30">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Manage Triggers</CardTitle>
                    <p className="text-sm text-muted-foreground">Set up automated reminders and follow-up sequences</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/rel8/categories" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30">
                    <Building2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Organize Categories</CardTitle>
                    <p className="text-sm text-muted-foreground">Create and manage contact categories and tags</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4" onClick={handleBuildRapport}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30">
                  <MessageSquare className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Build Rapport</CardTitle>
                  <p className="text-sm text-muted-foreground">Create personalized outreach campaigns to nurture relationships</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/nmn8" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30">
                    <Users className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Nomin8 Community</CardTitle>
                    <p className="text-sm text-muted-foreground">Track and engage with your community members and supporters</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;