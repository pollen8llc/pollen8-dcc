import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, MapPin } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface DotConnectorHeaderProps {
  className?: string;
}

export const DotConnectorHeader: React.FC<DotConnectorHeaderProps> = ({ 
  className = "" 
}) => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const getFullName = () => {
    return currentUser?.name || "Organizer";
  };

  const getInitials = () => {
    const name = currentUser?.name || '';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0]) {
      return nameParts[0][0].toUpperCase();
    }
    return 'O';
  };

  const FIXED_AVATAR_URL = "https://www.pollen8.app/wp-content/uploads/2025/03/larissa-avatar.gif";

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                {/* Avatar with animated gradient border */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-spin-slow opacity-75 blur-sm" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse" />
                  <Avatar className="relative w-24 h-24 border-4 border-background shadow-2xl">
                    <AvatarImage src={currentUser?.imageUrl || FIXED_AVATAR_URL} alt={getFullName()} />
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
                      {currentUser?.role}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                    {currentUser?.location && (
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
      </div>

      {/* Glowing Sliver */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[4px] opacity-40" />
      </div>
    </div>
  );
};