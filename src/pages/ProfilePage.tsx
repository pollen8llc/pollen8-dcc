
import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import Navbar from "@/components/Navbar";
import EnhancedProfileView from "@/components/profile/EnhancedProfileView";
import { useNavigate } from "react-router-dom";
import { UnifiedProfile } from "@/types/unifiedProfile";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoading } = useUser();
  const { getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<UnifiedProfile | null>(null);
  const navigate = useNavigate();

  // Determine which profile to show
  const profileId = id || currentUser?.id;
  const isOwnProfile = !id || id === currentUser?.id;
  
  // Debug logging
  console.log('=== PROFILE PAGE DEBUG ===');
  console.log('URL param id:', id);
  console.log('Current user ID:', currentUser?.id);
  console.log('Profile ID to fetch:', profileId);
  console.log('Is own profile:', isOwnProfile);
  console.log('==========================');

  // Fetch profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (profileId) {
        if (isOwnProfile && currentUser) {
          // Convert current user to UnifiedProfile format
          const unifiedProfile: UnifiedProfile = {
            id: currentUser.id,
            user_id: currentUser.id,
            email: currentUser.email || '',
            first_name: currentUser.name?.split(' ')[0] || '',
            last_name: currentUser.name?.split(' ').slice(1).join(' ') || '',
            bio: currentUser.bio,
            location: currentUser.location,
            avatar_url: currentUser.imageUrl,
            interests: currentUser.interests,
            social_links: {},
            privacy_settings: { profile_visibility: 'public' },
            role: currentUser.role,
            created_at: currentUser.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            phone: currentUser.phone,
            website: undefined,
          };
          setProfileData(unifiedProfile);
        } else {
          // Fetch other user's profile
          const fetchedProfile = await getProfileById(profileId);
          if (fetchedProfile) {
            const unifiedProfile: UnifiedProfile = {
              id: fetchedProfile.id,
              user_id: fetchedProfile.id,
              email: fetchedProfile.email || '',
              first_name: fetchedProfile.first_name || '',
              last_name: fetchedProfile.last_name || '',
              bio: fetchedProfile.bio,
              location: fetchedProfile.location,
              avatar_url: fetchedProfile.avatar_url,
              interests: fetchedProfile.interests,
              social_links: fetchedProfile.social_links,
              privacy_settings: fetchedProfile.privacy_settings,
              role: fetchedProfile.role,
              created_at: fetchedProfile.created_at || new Date().toISOString(),
              updated_at: fetchedProfile.updated_at || new Date().toISOString(),
              phone: undefined,
              website: undefined,
            };
            setProfileData(unifiedProfile);
          }
        }
      }
    };

    if (!isLoading && profileId) {
      fetchProfile();
    }
  }, [profileId, currentUser, isLoading, isOwnProfile, getProfileById]);

  // Show loading state
  if (isLoading || profileLoading || !profileData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <EnhancedProfileView 
          profile={profileData}
          isOwnProfile={isOwnProfile}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
