import React from "react";
import { Avatar } from "@/components/ui/avatar";
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
  const {
    currentUser
  } = useUser();
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
  return <div className={`w-full ${className}`}>
      {/* Header Content */}
      <Card className="border-0 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-xl">
                  {getInitials()}
                </div>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">{getFullName()}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Dot Connector
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>Active Network</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSettingsClick}
              className="h-10 w-10 rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Glowing Sliver */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[4px] opacity-40" />
      </div>
    </div>;
};