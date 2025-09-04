
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiProgress } from "@/components/ui/multi-progress";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/models/types";
import { 
  Users,
  Network,
  Star,
  BarChart3,
  Zap,
  TrendingUp,
  Building2,
  Briefcase,
  UserCog,
  ShoppingCart,
  BookOpen
} from "lucide-react";

const OrganizerDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }


  const modules = [
    {
      id: 'initi8',
      name: 'Initi8',
      description: 'Onboarding, profile setup, and volunteer management',
      icon: UserCog,
      color: 'hsl(var(--primary))',
      link: '/initi8',
      setup: 8, // 80% of 10%
      usage: 25, // 62.5% of 40%
      premium: 15 // 30% of 50%
    },
    {
      id: 'eco8',
      name: 'Eco8',
      description: (() => {
        const communities = JSON.parse(localStorage.getItem('communities') || '[]');
        return communities.length > 0 ? 'Manage your communities' : 'Add your community to get started';
      })(),
      icon: Building2,
      color: 'hsl(142 76% 36%)', // green
      link: '/eco8',
      setup: 10, // 100% of 10%
      usage: 20, // 50% of 40%
      premium: 0 // 0% of 50%
    },
    {
      id: 'rel8',
      name: 'Rel8',
      description: 'Connect members, build relationships',
      icon: Network,
      color: 'hsl(221 83% 53%)', // blue
      link: '/rel8',
      setup: 10, // 100% of 10%
      usage: 35, // 87.5% of 40%
      premium: 25 // 50% of 50%
    },
    {
      id: 'nomin8',
      name: 'Nomin8',
      description: 'Recognize or categorize members (roles, types, pathways)',
      icon: Star,
      color: 'hsl(262 83% 58%)', // purple
      link: '/nmn8',
      setup: 6, // 60% of 10%
      usage: 15, // 37.5% of 40%
      premium: 10 // 20% of 50%
    },
    {
      id: 'evalu8',
      name: 'Evalu8',
      description: 'Understand behavior, gather insights, measure engagement',
      icon: BarChart3,
      color: 'hsl(43 96% 56%)', // yellow/orange
      link: '/analytics',
      setup: 4, // 40% of 10%
      usage: 8, // 20% of 40%
      premium: 5 // 10% of 50%
    },
    {
      id: 'actv8',
      name: 'Actv8',
      description: 'Empower members to participate, lead, and contribute',
      icon: Zap,
      color: 'hsl(168 76% 42%)', // teal
      link: '/activities',
      setup: 2, // 20% of 10%
      usage: 5, // 12.5% of 40%
      premium: 0 // 0% of 50%
    },
    {
      id: 'advc8',
      name: 'Advc8',
      description: 'Manage volunteers and evangelists',
      icon: Users,
      color: 'hsl(346 87% 43%)', // pink/red
      link: '/volunteers',
      setup: 0, // 0% of 10%
      usage: 0, // 0% of 40%
      premium: 0 // 0% of 50%
    },
    {
      id: 'cultv8',
      name: 'Cultv8',
      description: 'Knowledge base, resources, and community content',
      icon: BookOpen,
      color: 'hsl(168 76% 42%)', // teal
      link: '/knowledge/resources',
      setup: 9, // 90% of 10%
      usage: 30, // 75% of 40%
      premium: 20 // 40% of 50%
    },
    {
      id: 'modul8',
      name: 'Modul8',
      description: 'Connect with service providers to help you scale',
      icon: Briefcase,
      color: 'hsl(271 91% 65%)', // violet
      link: '/modul8',
      setup: 7, // 70% of 10%
      usage: 18, // 45% of 40%
      premium: 12 // 24% of 50%
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      {/* DotConnector Header with Sliver */}
      <DotConnectorHeader />

      {/* Full-width content below the sliver */}
      <div className="w-full px-4 py-8">
        {/* Module Cards Grid */}
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card 
                  key={module.id}
                  className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]"
                  onClick={() => navigate(module.link)}
                >
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                  
                  {/* Subtle colored background */}
                  <div 
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: module.color }}
                  />
                  
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="p-2.5 rounded-xl backdrop-blur-sm border"
                        style={{ 
                          backgroundColor: `color-mix(in srgb, ${module.color} 15%, transparent)`,
                          borderColor: `color-mix(in srgb, ${module.color} 30%, transparent)`
                        }}
                      >
                        <IconComponent 
                          className="h-6 w-6" 
                          style={{ color: module.color }}
                        />
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {module.name}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 relative">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(((module.setup + module.usage + module.premium) / 100) * 100)}%</span>
                      </div>
                      <MultiProgress
                        setupValue={module.setup}
                        usageValue={module.usage}
                        premiumValue={module.premium}
                        className="h-2.5"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Setup
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Usage
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          Premium
                        </span>
                      </div>
                    </div>
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
