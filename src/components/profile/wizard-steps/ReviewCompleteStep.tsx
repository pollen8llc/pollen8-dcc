
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExtendedProfile } from '@/services/profileService';
import { CheckCircle, Globe, Users, UserCircle, Lock } from 'lucide-react';

interface ReviewCompleteStepProps {
  formData: Partial<ExtendedProfile>;
}

const ReviewCompleteStep = ({ formData }: ReviewCompleteStepProps) => {
  const socialLinks = formData.social_links || {};
  const privacy = formData.privacy_settings?.profile_visibility || 'connections';

  const renderPrivacyDescription = () => {
    switch (privacy) {
      case 'public':
        return (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Your profile will be visible to everyone</span>
          </div>
        );
      case 'connections':
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Only your direct connections will see your profile</span>
          </div>
        );
      case 'connections2':
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Connections and their connections will see your profile</span>
          </div>
        );
      case 'connections3':
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Extended network (3 degrees) will see your profile</span>
          </div>
        );
      case 'private':
        return (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Only you can see your profile</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Only your direct connections will see your profile</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your profile is almost ready! Please review your information below before completing the setup.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={formData.avatar_url || ''} />
            <AvatarFallback userId={formData.user_id}>
              <UserCircle className="h-12 w-12 opacity-50" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-grow space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Basic Information</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">First Name</dt>
                  <dd className="font-medium">{formData.first_name || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Name</dt>
                  <dd className="font-medium">{formData.last_name || 'Not provided'}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-muted-foreground">Bio</dt>
                  <dd>{formData.bio || 'No bio provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd>{formData.location || 'Not specified'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {formData.interests && formData.interests.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span key={index} className="bg-secondary px-2 py-1 rounded-md text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {Object.keys(socialLinks).length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Social Links</h3>
                <dl className="space-y-2 text-sm">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <dt className="text-muted-foreground capitalize">{platform}</dt>
                      <dd className="font-medium break-all">{url}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Privacy Settings</h3>
              <div className="text-sm">
                {renderPrivacyDescription()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompleteStep;
