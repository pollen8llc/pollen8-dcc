import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProfileData } from '@/hooks/useProfileData';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileViewProps {
  profileId: string;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profileId, isOwnProfile, onEdit }) => {
  const { profile, isLoading, error } = useProfileData(profileId);
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className={`${isMobile ? 'max-w-md mx-auto' : 'max-w-6xl mx-auto'} p-6`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`${isMobile ? 'max-w-md mx-auto' : 'max-w-6xl mx-auto'} p-6`}>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
            <p className="text-muted-foreground">
              {error || "The profile you're looking for doesn't exist or you don't have permission to view it."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
          onEdit={onEdit}
          isMobile={true}
        />
        <ProfileInfo profile={profile} isMobile={true} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-0">
          <ProfileHeader 
            profile={profile} 
            isOwnProfile={isOwnProfile} 
            onEdit={onEdit}
          />
        </CardContent>
      </Card>
      <ProfileInfo profile={profile} />
    </div>
  );
};

export default ProfileView;