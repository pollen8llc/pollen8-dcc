import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { NetworkScoreNumber } from "@/components/ui/network-score-badge";

interface DotConnectorHeaderProps {
  className?: string;
}

export const DotConnectorHeader: React.FC<DotConnectorHeaderProps> = ({ 
  className = "" 
}) => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

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

  const handleAvatarClick = () => {
    if (currentUser?.id) {
      navigate(`/profile/${currentUser.id}`);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl lg:px-6">
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="absolute top-4 right-4 gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
               {/* Avatar */}
               <div 
                 className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-105" 
                 onClick={handleAvatarClick}
               >
                 <Avatar userId={currentUser?.id} size={96} />
               </div>
                
                   {/* Profile Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                        {getFullName()}
                      </h1>
                      {currentUser?.role && (
                        <Badge variant="secondary" className="text-xs sm:text-sm font-medium self-center sm:self-auto">
                          {currentUser.role}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-start flex-wrap mb-2">
                      {currentUser?.website && (
                        <Badge variant="outline" className="flex items-center gap-1 h-5 px-1.5 text-xs">
                          <Globe className="w-3 h-3" />
                          <a 
                            href={currentUser.website.startsWith('http') ? currentUser.website : `https://${currentUser.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Website
                          </a>
                        </Badge>
                      )}
                      {currentUser?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{currentUser.location}</span>
                        </div>
                      )}
                      <div className="hidden sm:flex scale-75 origin-left">
                        <NetworkScoreNumber score={currentUser?.network_value || 0} />
                      </div>
                    </div>
                    
                    <div className="flex sm:hidden justify-center scale-75">
                      <NetworkScoreNumber score={currentUser?.network_value || 0} />
                    </div>
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