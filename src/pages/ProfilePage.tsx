
import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import Navbar from "@/components/Navbar";
import MobileProfileView from "@/components/profile/MobileProfileView";
import DesktopProfileView from "@/components/profile/DesktopProfileView";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoading } = useUser();
  const { profile, getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<any>(null);
  const navigate = useNavigate();

  // Determine which profile to show
  const profileId = id || currentUser?.id;
  const isOwnProfile = !id || id === currentUser?.id;

  // Fetch profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (profileId) {
        if (isOwnProfile && currentUser) {
          // Use current user data for own profile
          setProfileData(currentUser);
        } else {
          // Fetch other user's profile
          const fetchedProfile = await getProfileById(profileId);
          setProfileData(fetchedProfile);
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
