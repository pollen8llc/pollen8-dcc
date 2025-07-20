import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import Navbar from "@/components/Navbar";
import MobileProfileView from "@/components/profile/MobileProfileView";
import DesktopProfileView from "@/components/profile/DesktopProfileView";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoading } = useUser();
  const { getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<any>(null);
  const navigate = useNavigate();

  // Always determine the profile ID - use current user's ID if no ID provided
  const profileId = id || currentUser?.id;
  const isOwnProfile = !id || id === currentUser?.id;
  
  // Debug logging
  console.log('=== PROFILE PAGE DEBUG ===');
  console.log('URL param id:', id);
  console.log('Current user ID:', currentUser?.id);
  console.log('Profile ID to fetch:', profileId);
  console.log('Is own profile:', isOwnProfile);
  console.log('==========================');

  // Always fetch profile data by ID - no fallback to currentUser
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (profileId) {
        console.log('🔍 Fetching profile for ID:', profileId);
        const fetchedProfile = await getProfileById(profileId);
        console.log('📊 Fetched profile data:', fetchedProfile);
        setProfileData(fetchedProfile);
      }
    };

    if (!isLoading && profileId) {
      fetchProfile();
    }
  }, [profileId, isLoading, getProfileById]);

  // Show loading state
  if (isLoading || profileLoading) {
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

  // Show error state if profile not found
  if (!profileData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <p className="mt-4 text-lg text-red-500">Profile not found or you do not have access.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure required fields exist with fallbacks
  const safeProfileData = {
    ...profileData,
    name: profileData.name || profileData.first_name || profileData.email || 'Unknown User',
    email: profileData.email || '',
    bio: profileData.bio || '',
    location: profileData.location || '',
    interests: profileData.interests || [],
    createdAt: profileData.created_at || profileData.createdAt || new Date().toISOString()
  };

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopProfileView 
          user={safeProfileData}
          isOwnProfile={isOwnProfile}
          onEdit={handleEdit}
        />
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileProfileView 
          user={safeProfileData}
          isOwnProfile={isOwnProfile}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
