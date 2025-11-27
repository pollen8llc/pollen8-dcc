import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, MapPin, Bell, Users } from "lucide-react";
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

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleUpdatesClick = () => {
    navigate("/rel8/notifications");
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
                   <div className="flex flex-col gap-2 mb-3">
                     <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                       {getFullName()}
                     </h1>
                     <div className="flex items-center gap-2 self-center sm:self-start">
                       <Users className="w-5 h-5 text-primary" />
                       <span className="text-2xl font-bold text-foreground">
                         {currentUser?.network_value || 0}
                       </span>
                       <span className="text-sm text-muted-foreground font-medium">
                         Network Score
                       </span>
                     </div>
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
                
                 {/* Action Buttons */}
                 <div className="flex-shrink-0 w-full sm:w-auto">
                   <div className="flex flex-col sm:flex-row gap-2">
                     <Button 
                       onClick={handleUpdatesClick} 
                       variant="outline"
                       size="default" 
                       className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
                     >
                       <Bell className="w-5 h-5 mr-3" />
                       Notifications
                     </Button>
                     <Button 
                       onClick={handleSettingsClick} 
                       size="default" 
                       className="w-auto px-4 py-3 lg:py-4"
                     >
                       <Settings className="w-5 h-5" />
                     </Button>
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