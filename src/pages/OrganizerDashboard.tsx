
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { UserRole } from "@/models/types";
import { 
  Users, 
  Bell, 
  Settings, 
  Briefcase, 
  Network, 
  BookOpen, 
  Building2,
  MessageSquare,
  Target,
  ArrowRight,
  Zap,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const OrganizerDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }

  const platformServices = [
    {
      id: 'modul8',
      name: 'Modul8',
      description: 'Service marketplace for finding and managing providers',
      icon: Briefcase,
      color: '#00eada',
      primaryLink: '/modul8/dashboard',
      secondaryLink: '/modul8/request/new',
      primaryLabel: 'Dashboard',
      secondaryLabel: 'New Request',
      stats: { projects: 12, providers: 45 }
    },
    {
      id: 'rel8t',
      name: 'REL8T',
      description: 'Relationship management and networking platform',
      icon: Network,
      color: '#3b82f6',
      primaryLink: '/rel8/dashboard',
      secondaryLink: '/rel8/contacts',
      primaryLabel: 'Dashboard',
      secondaryLabel: 'Contacts',
      stats: { contacts: 89, connections: 156 }
    },
    {
      id: 'labr8',
      name: 'LAB-R8',
      description: 'Project management and service provider workspace',
      icon: Building2,
      color: '#8b5cf6',
      primaryLink: '/labr8/dashboard',
      secondaryLink: '/labr8/projects',
      primaryLabel: 'Dashboard',
      secondaryLabel: 'Projects',
      stats: { active: 8, completed: 23 }
    },
    {
      id: 'knowledge',
      name: 'Knowledge Base',
      description: 'Share knowledge, articles, and best practices',
      icon: BookOpen,
      color: '#10b981',
      primaryLink: '/knowledge',
      secondaryLink: '/knowledge/create',
      primaryLabel: 'Browse',
      secondaryLabel: 'Create',
      stats: { articles: 34, views: 1200 }
    },
    {
      id: 'smart-engage',
      name: 'Smart Engage',
      description: 'Automated outreach and engagement management',
      icon: MessageSquare,
      color: '#f59e0b',
      primaryLink: '/rel8/triggers',
      secondaryLink: '/rel8/outreach',
      primaryLabel: 'Triggers',
      secondaryLabel: 'Outreach',
      stats: { campaigns: 6, responses: 89 }
    },
    {
      id: 'dot-connector',
      name: 'Dot Connector',
      description: 'Connect people and opportunities across your network',
      icon: Target,
      color: '#ec4899',
      primaryLink: '/dot-connector',
      secondaryLink: '/connections',
      primaryLabel: 'Dashboard',
      secondaryLabel: 'Connections',
      stats: { matches: 15, opportunities: 7 }
    }
  ];

  const managementTools = [
    {
      id: 'invites',
      name: 'Manage Invites',
      description: 'Create and manage invitation links for new users',
      icon: Users,
      link: '/invites',
      count: 5
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'View system notifications and alerts',
      icon: Bell,
      link: '/rel8/notifications',
      count: 12
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Configure your account settings and preferences',
      icon: Settings,
      link: '/settings',
      count: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
        </div>

        {/* Platform Services Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Platform Services</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#00eada]/10 text-[#00eada] border-[#00eada]/20">
                <Zap className="h-3 w-3 mr-1" />
                Active
              </Badge>
              <Badge variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                {platformServices.length} Services
              </Badge>
              <p className="text-muted-foreground text-sm hidden sm:block ml-4">
                Core platform modules for your organization
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {platformServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className="group relative overflow-hidden border-0 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 h-full flex flex-col"
                >
                  <CardHeader className="pb-4 relative flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {service.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 relative flex-1 flex flex-col">
                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground flex-shrink-0">
                      {Object.entries(service.stats).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1">
                          <span className="font-medium">{value}</span>
                          <span className="capitalize">{key}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Button 
                        asChild 
                        size="sm" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Link to={service.primaryLink} className="flex items-center justify-center gap-2">
                          {service.primaryLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Management Tools */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Management Tools</h2>
            <p className="text-muted-foreground text-sm hidden sm:block">
              Administrative and organizational tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {managementTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/30 backdrop-blur-sm hover:bg-card/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      {tool.count !== null && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {tool.count}
                        </Badge>
                      )}
                    </div>
                    
                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={tool.link} className="flex items-center justify-center gap-2">
                        Access Tool
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
