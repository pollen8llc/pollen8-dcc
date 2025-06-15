
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import Navbar from "@/components/Navbar";
import MobileProfileView from "@/components/profile/MobileProfileView";
import DesktopProfileView from "@/components/profile/DesktopProfileView";
import { UserRole } from "@/models/types";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser, isLoading } = useUser();
  const { getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const navigate = useNavigate();

  // Handle missing userId parameter
  React.useEffect(() => {
    if (!isLoading && !userId) {
      setIsRedirecting(true);
      if (currentUser) {
        // Redirect to current user's profile if authenticated
        navigate(`/profile/${currentUser.id}`, { replace: true });
      } else {
        // Redirect to auth if not authenticated and no userId
        navigate('/auth', { replace: true });
      }
    }
  }, [userId, currentUser, isLoading, navigate]);

  // Determine which profile to show - only if userId exists
  const profileId = userId;
  const isOwnProfile = userId === currentUser?.id;

  // Fetch profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (profileId && !isRedirecting) {
        if (isOwnProfile && currentUser) {
          // For own profile, we still want to fetch fresh data with role info
          console.log('Fetching own profile with role info');
          const fetchedProfile = await getProfileById(profileId);
          if (fetchedProfile) {
            // Convert ExtendedProfile to User format for compatibility
            const userData = {
              ...currentUser,
              role: fetchedProfile.role || currentUser.role,
              bio: fetchedProfile.bio || currentUser.bio,
              location: fetchedProfile.location || currentUser.location,
              interests: fetchedProfile.interests || currentUser.interests,
              // Add other fields as needed
            };
            console.log('Own profile with role:', userData.role);
            setProfileData(userData);
          } else {
            setProfileData(currentUser);
          }
        } else {
          // Fetch other user's profile
          console.log('Fetching other user profile with role info');
          const fetchedProfile = await getProfileById(profileId);
          if (fetchedProfile) {
            // Convert ExtendedProfile to User format for compatibility
            const userData = {
              id: fetchedProfile.id,
              name: `${fetchedProfile.first_name || ''} ${fetchedProfile.last_name || ''}`.trim() || 'User',
              role: fetchedProfile.role || UserRole.MEMBER,
              imageUrl: fetchedProfile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
              email: fetchedProfile.email || "",
              bio: fetchedProfile.bio || "",
              location: fetchedProfile.location || "",
              interests: fetchedProfile.interests || [],
              communities: [],
              managedCommunities: [],
              createdAt: fetchedProfile.created_at || new Date().toISOString(),
              profile_complete: fetchedProfile.profile_complete || false
            };
            console.log('Other user profile with role:', userData.role);
            setProfileData(userData);
          }
        }
      }
    };

    if (!isLoading && profileId && !isRedirecting) {
      fetchProfile();
    }
  }, [profileId, currentUser, isLoading, isOwnProfile, getProfileById, isRedirecting]);

  // Don't render anything if we're redirecting due to missing userId
  if (!userId || isRedirecting) {
    return null;
  }

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
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopProfileView 
          user={profileData}
          isOwnProfile={isOwnProfile}
          onEdit={handleEdit}
        />
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileProfileView 
          user={profileData}
          isOwnProfile={isOwnProfile}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
