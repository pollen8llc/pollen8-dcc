
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import { FormProvider, useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import UnifiedProfileForm from "@/components/profile/UnifiedProfileForm";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser();
  const { getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);

  // Initialize form with react-hook-form
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      location: '',
      interests: [],
      socialLinks: {},
      profileVisibility: 'public'
    }
  });

  // Fetch profile data and populate form - only run once
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser && !isFormInitialized) {
        console.log("Fetching profile for edit page:", currentUser.id);
        const fetchedProfile = await getProfileById(currentUser.id);
        if (fetchedProfile) {
          console.log("Profile fetched successfully:", fetchedProfile);
          setProfileData(fetchedProfile);
          
          // Populate form with existing data
          const formData = {
            firstName: fetchedProfile.first_name || '',
            lastName: fetchedProfile.last_name || '',
            bio: fetchedProfile.bio || '',
            location: fetchedProfile.location || '',
            interests: fetchedProfile.interests || [],
            socialLinks: fetchedProfile.social_links || {},
            profileVisibility: fetchedProfile.privacy_settings?.profile_visibility || 'public'
          };
          
          console.log("Resetting form with data:", formData);
          form.reset(formData);
          setIsFormInitialized(true);
        } else {
          console.log("No profile found, using current user data");
          // Use current user data as fallback
          const formData = {
            firstName: currentUser.name?.split(' ')[0] || '',
            lastName: currentUser.name?.split(' ').slice(1).join(' ') || '',
            bio: currentUser.bio || '',
            location: currentUser.location || '',
            interests: currentUser.interests || [],
            socialLinks: {},
            profileVisibility: 'public'
          };
          
          form.reset(formData);
          setProfileData(formData);
          setIsFormInitialized(true);
        }
      }
    };

    if (currentUser && !isLoading && !isFormInitialized) {
      fetchProfile();
    }
  }, [currentUser, isLoading, getProfileById, form, isFormInitialized]);

  // Redirect if user is not authenticated
  if (!isLoading && !currentUser) {
    navigate("/auth?redirectTo=/profile/edit");
    return null;
  }

  // Show loading state only while we're actually loading
  if (isLoading || (profileLoading && !isFormInitialized) || !isFormInitialized) {
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <FormProvider {...form}>
            <UnifiedProfileForm 
              mode="edit" 
              existingData={profileData}
              onComplete={() => navigate(`/profile`)}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
