
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiProgress } from "@/components/ui/multi-progress";
import Navbar from "@/components/Navbar";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/models/types";
import { 
  Settings,
  MapPin,
  Users,
  Network,
  Star,
  BarChart3,
  Zap,
  TrendingUp,
  Building2,
  Briefcase,
  UserCog,
  ShoppingCart
} from "lucide-react";

const OrganizerDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }

  const getFullName = () => {
    return currentUser.name || "Organizer";
  };

  const getInitials = () => {
    const name = currentUser.name || '';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0]) {
      return nameParts[0][0].toUpperCase();
    }
    return 'O';
  };

  const FIXED_AVATAR_URL = "https://www.pollen8.app/wp-content/uploads/2025/03/larissa-avatar.gif";

  const modules = [
    {
      id: 'initi8',
      name: 'Initi8',
      description: 'Onboarding, update your organizer profile',
      icon: UserCog,
      color: 'hsl(var(--primary))',
      link: '/profile/edit',
      setup: 8, // 80% of 10%
      usage: 25, // 62.5% of 40%
      premium: 15 // 30% of 50%
    },
    {
      id: 'eco8',
      name: 'Eco8',
      description: 'Add your community to get started',
      icon: Building2,
      color: 'hsl(142 76% 36%)', // green
      link: '/eco8/setup',
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

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                {/* Avatar with animated gradient border */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-spin-slow opacity-75 blur-sm" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse" />
                  <Avatar className="relative w-24 h-24 border-4 border-background shadow-2xl">
                    <AvatarImage src={currentUser.imageUrl || FIXED_AVATAR_URL} alt={getFullName()} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                      {getFullName()}
                    </h1>
                    <Badge variant="secondary" className="text-sm font-medium self-center sm:self-auto">
                      {currentUser.role}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                    {currentUser.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="text-lg text-muted-foreground font-medium">{currentUser.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Settings Button */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Button 
                    onClick={handleSettingsClick} 
                    size="default" 
                    className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Cards Grid */}
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
  );
};

export default OrganizerDashboard;
