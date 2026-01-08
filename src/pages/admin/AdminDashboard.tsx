import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { UserRole } from "@/models/types";
import * as adminService from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import UserManagementTab from "@/components/admin/UserManagementTab";
import AdminMetrics from "@/pages/admin/AdminMetrics";
import UserFlows from "@/pages/admin/UserFlows";
import ConnectionStrengthAnalytics from "@/components/admin/ConnectionStrengthAnalytics";
import TechnicalDocumentationGenerator from "@/components/admin/TechnicalDocumentationGenerator";
import CommunityAuditTable from "@/components/admin/CommunityAuditTable";
import { 
  BarChart3, 
  Users, 
  Bug, 
  Settings, 
  Palette, 
  Mail, 
  Database,
  GitBranch,
  Link2,
  Shield,
  Activity,
  ArrowLeft,
  FileText
} from "lucide-react";

const AdminDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');

  useEffect(() => {
    const ensureAdminInDatabase = async () => {
      if (currentUser?.id === "38a18dd6-4742-419b-b2c1-70dec5c51729") {
        try {
          const result = await adminService.ensureAdminRole();
          if (!result.success) {
            toast({
              title: "Admin role setup error",
              description: result.message,
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error ensuring admin role:", error);
        }
      }
    };
    ensureAdminInDatabase();
  }, [currentUser?.id, toast]);

  // Check if user is admin or organizer
  const isAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role as string === 'ADMIN';
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER || currentUser?.role as string === 'ORGANIZER' || currentUser?.managedCommunities && currentUser.managedCommunities.length > 0;

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!isAdmin && !isOrganizer) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isOrganizer, navigate]);

  if (!isAdmin && !isOrganizer) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-4 text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      id: 'metrics',
      name: 'Platform Metrics',
      description: 'Real-time analytics, user growth, and engagement insights',
      icon: BarChart3,
      color: 'hsl(217 91% 60%)',
      link: '/admin?tab=metrics',
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'Manage accounts, assign roles, and review permissions',
      icon: Users,
      color: 'hsl(142 76% 36%)',
      link: '/admin?tab=users',
    },
    {
      id: 'flows',
      name: 'User Flows',
      description: 'Documentation of module flows and user journeys',
      icon: GitBranch,
      color: 'hsl(262 83% 58%)',
      link: '/admin?tab=flows',
    },
    {
      id: 'connection-strength',
      name: 'Connection Analytics',
      description: 'Formula breakdown and contact scoring simulation',
      icon: Link2,
      color: 'hsl(168 76% 42%)',
      link: '/admin?tab=connection-strength',
    },
    {
      id: 'debugger',
      name: 'System Debugger',
      description: 'Monitor service health, error logs, and system status',
      icon: Bug,
      color: 'hsl(25 95% 53%)',
      link: '/admin/debugger',
    },
    {
      id: 'avatars',
      name: 'Avatar Gallery',
      description: 'Browse and manage animated solar system avatars',
      icon: Palette,
      color: 'hsl(340 82% 52%)',
      link: '/admin/avatars',
    },
    {
      id: 'lexicon',
      name: 'Lexicon Management',
      description: 'Populate interests and sync existing data',
      icon: Database,
      color: 'hsl(43 96% 56%)',
      link: '/admin/lexicon',
    },
    {
      id: 'email-tester',
      name: 'Email Tester',
      description: 'Test inbound email webhooks and calendar updates',
      icon: Mail,
      color: 'hsl(199 89% 48%)',
      link: '/admin/email-tester',
    },
    {
      id: 'settings',
      name: 'System Settings',
      description: 'Configure platform settings and generate documentation',
      icon: Settings,
      color: 'hsl(271 91% 65%)',
      link: '/admin?tab=settings',
    },
  ];

  const quickStats = [
    { label: 'Active Users', value: '1,247', icon: Users, color: 'text-blue-500' },
    { label: 'System Health', value: '98.5%', icon: Activity, color: 'text-green-500' },
    { label: 'Admin Actions', value: '156', icon: Shield, color: 'text-purple-500' },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'metrics':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Platform Metrics</h2>
                <p className="text-sm text-muted-foreground">Real-time analytics and performance insights</p>
              </div>
            </div>
            <AdminMetrics />
          </div>
        );

      case 'users':
        return <UserManagementTab />;

      case 'flows':
        return <UserFlows />;

      case 'connection-strength':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Connection Strength Analytics</h2>
                <p className="text-sm text-muted-foreground">Formula breakdown and contact scoring simulation</p>
              </div>
            </div>
            <ConnectionStrengthAnalytics />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
                <p className="text-sm text-muted-foreground">Configure platform settings and preferences</p>
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                System settings will be implemented in a future update.
              </p>
            </div>
            
            <TechnicalDocumentationGenerator />
          </div>
        );

      default:
        return null;
    }
  };

  // If a tab is active, show tab content
  if (activeTab && isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <DotConnectorHeader />
        <div className="w-full px-4 py-6">
          <div className="container mx-auto max-w-7xl space-y-6">
            <AdminNavigation />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-muted-foreground hover:text-foreground -mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-4 md:p-6 lg:p-8 animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard view with cards
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          
          <AdminNavigation />

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <Card 
                  key={stat.label}
                  className="border-0 bg-card/40 backdrop-blur-md"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {isAdmin && (
            <>
              {/* Section Title */}
              <div className="pt-2">
                <h2 className="text-xl font-semibold text-foreground">Admin Modules</h2>
                <p className="text-sm text-muted-foreground">Manage platform operations and settings</p>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {adminModules.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <Card 
                      key={module.id}
                      className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]"
                      onClick={() => navigate(module.link)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                      
                      <div 
                        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                        style={{ backgroundColor: module.color }}
                      />
                      
                      <CardHeader className="pb-3 relative">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2.5 rounded-xl backdrop-blur-sm border"
                            style={{ 
                              backgroundColor: `color-mix(in srgb, ${module.color} 15%, transparent)`,
                              borderColor: `color-mix(in srgb, ${module.color} 30%, transparent)`
                            }}
                          >
                            <IconComponent 
                              className="h-5 w-5" 
                              style={{ color: module.color }}
                            />
                          </div>
                          <CardTitle className="text-lg font-semibold">
                            {module.name}
                          </CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 relative">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {module.description}
                        </p>
                        
                        <div className="mt-4 flex items-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: module.color }}>
                          <span>Open module</span>
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Community Audit Section */}
              <div className="pt-4">
                <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Community Creation Audit Log</h3>
                      <p className="text-sm text-muted-foreground">Recent community creation activity</p>
                    </div>
                  </div>
                  <CommunityAuditTable />
                </div>
              </div>
            </>
          )}

          {/* Organizer Redirect for non-admins */}
          {!isAdmin && isOrganizer && (
            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-black text-2xl font-bold">👑</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">Organizer Dashboard</h2>
                <p className="text-muted-foreground mb-4">
                  Access your organization settings and member management.
                </p>
                <button 
                  onClick={() => navigate("/organizer")}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Go to Organizer Dashboard
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
