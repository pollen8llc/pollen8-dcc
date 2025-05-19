
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import Navbar from "@/components/Navbar";
import UnifiedProfileForm from "@/components/profile/UnifiedProfileForm";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser();
  const { profile, getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<any>(null);

  // Fetch profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const fetchedProfile = await getProfileById(currentUser.id);
        setProfileData(fetchedProfile);
      }
    };

    if (currentUser && !isLoading) {
      fetchProfile();
    }
  }, [currentUser, isLoading, getProfileById]);

  // Redirect if user is not authenticated
  if (!isLoading && !currentUser) {
    navigate("/auth?redirectTo=/profile/edit");
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
              <p className="mt-4 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <UnifiedProfileForm 
            mode="edit" 
            existingData={profileData}
            onComplete={() => navigate(`/profile/${currentUser.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
