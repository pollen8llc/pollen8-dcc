import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Globe, ExternalLink, User as UserIcon } from 'lucide-react';
import { Profile } from '@/types/profile';

interface ProfileInfoProps {
  profile: Profile;
  isMobile?: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, isMobile = false }) => {
  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile.first_name || profile.email.split('@')[0];

  const socialLinks = profile.social_links && typeof profile.social_links === 'object' 
    ? Object.entries(profile.social_links).filter(([_, url]) => url && typeof url === 'string')
    : [];

  if (isMobile) {
    return (
      <div className="px-6 -mt-16 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
          
          {profile.bio && (
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="space-y-3 mb-6">
            {socialLinks.map(([platform, url]) => (
              <Button
                key={platform}
                variant="outline"
                className="w-full h-12 justify-between group hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a href={url as string} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3" />
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                </a>
              </Button>
            ))}
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
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
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
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
              <span className="text-sm">{profile.email}</span>
            </div>
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
              <span className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profile complete</span>
              <span className="text-sm">{profile.profile_complete ? "Yes" : "No"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Interests & Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialLinks.map(([platform, url]) => (
                <Button
                  key={platform}
                  variant="outline"
                  className="w-full justify-between group hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <a href={url as string} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3" />
                      <span className="capitalize">{platform}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;