
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, MapPin, Mail, Phone, Globe, Edit3, Settings } from "lucide-react";
import { User } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";
import RoleChangeDialog from "./RoleChangeDialog";

interface MobileProfileViewProps {
  user: User;
  isOwnProfile: boolean;
  onEdit: () => void;
}

const MobileProfileView = ({ user, isOwnProfile, onEdit }: MobileProfileViewProps) => {
  const { getRoleBadge } = usePermissions(user);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const roleBadge = getRoleBadge();

  // Mock links - in real app these would come from user.social_links
  const socialLinks = [
    { name: "Website", url: "https://example.com", icon: Globe },
    { name: "LinkedIn", url: "https://linkedin.com", icon: ExternalLink },
    { name: "Twitter", url: "https://twitter.com", icon: ExternalLink },
    { name: "GitHub", url: "https://github.com", icon: ExternalLink },
  ];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-6 pb-20">
        {isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={onEdit}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
        
        {/* Profile Avatar - positioned to overlap */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
          
          {/* Role Badge with click functionality for own profile */}
          <div className="flex justify-center mb-3">
            {isOwnProfile ? (
              <Button
                variant="ghost"
                size="sm"
                className={`${roleBadge.color} text-primary-foreground hover:opacity-80`}
                onClick={() => setShowRoleDialog(true)}
              >
                {roleBadge.text}
                <Settings className="ml-2 h-3 w-3" />
              </Button>
            ) : (
              <Badge className={roleBadge.color}>
                {roleBadge.text}
              </Badge>
            )}
          </div>

          {user.location && (
            <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </div>
          )}

          {user.bio && (
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        {(user.email || user.phone) && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-2">
                {user.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links - Linktree style */}
        <div className="space-y-3 mb-6">
          {socialLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-12 justify-between group hover:bg-primary hover:text-primary-foreground transition-colors"
              asChild
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center">
                  <link.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{link.name}</span>
                </div>
                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </a>
            </Button>
          ))}
        </div>

        {/* Interests/Tags */}
        {user.interests && user.interests.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Member Since */}
        <div className="text-center text-xs text-muted-foreground pb-6">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Role Change Dialog */}
      <RoleChangeDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        currentRole={user.role}
      />
    </div>
  );
};

export default MobileProfileView;
