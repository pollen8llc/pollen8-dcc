import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, MapPin, Mail, Phone, Globe, Edit3, Settings, Calendar, User as UserIcon, BarChart2 } from "lucide-react";
import { User } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";
import RoleChangeDialog from "./RoleChangeDialog";
import { useUserKnowledgeStats } from "@/hooks/knowledge/useUserKnowledgeStats";

interface DesktopProfileViewProps {
  user: User;
  isOwnProfile: boolean;
  onEdit: () => void;
}

const DesktopProfileView = ({ user, isOwnProfile, onEdit }: DesktopProfileViewProps) => {
  const { getRoleBadge } = usePermissions(user);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const roleBadge = getRoleBadge();
  const { stats } = useUserKnowledgeStats();

  // Mock social links - in real app these would come from user.social_links
  const socialLinks = [
    { name: "Website", url: "https://example.com", icon: Globe },
    { name: "LinkedIn", url: "https://linkedin.com", icon: ExternalLink },
    { name: "Twitter", url: "https://twitter.com", icon: ExternalLink },
    { name: "GitHub", url: "https://github.com", icon: ExternalLink },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar with animated border */}
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32">
                <span className="absolute inset-0 rounded-full animate-gradient-spin border-4 border-transparent" style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, #3b82f6, #fff, #00eada, #3b82f6)',
                  padding: 0,
                  borderWidth: '3px',
                  zIndex: 1
                }} />
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg relative z-10">
                  <AvatarFallback userId={user.id} className="text-3xl">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : '??'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  {/* Role Badge */}
                  <div className="flex items-center gap-3 mb-3">
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
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <Button onClick={onEdit} className="gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              {user.bio && (
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member since</span>
                <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {user.lastLoginAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last active</span>
                  <span className="text-sm">{new Date(user.lastLoginAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile complete</span>
                <span className="text-sm">{user.profile_complete ? "Yes" : "No"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interests & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity/Stats Dashboard Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Activity & Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold mb-1">{stats?.totalArticles ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">{stats?.totalViews ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">{stats?.totalComments ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">{stats?.totalVotes ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Votes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">{stats?.savedArticlesCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">{stats?.recentArticlesCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Recent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between group hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center">
                      <link.icon className="h-5 w-5 mr-3" />
                      <span>{link.name}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Communities */}
          {user.communities && user.communities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Member of {user.communities.length} communities
                </div>
              </CardContent>
            </Card>
          )}
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

export default DesktopProfileView; 