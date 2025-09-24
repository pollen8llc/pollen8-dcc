
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles.tsx";
import { FormProvider, useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import UnifiedProfileForm from "@/components/profile/UnifiedProfileForm";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser();
  const { getProfileById, isLoading: profileLoading, error: profileError } = useProfiles();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      location: '',
      interests: [],
      social_links: {},
      profileVisibility: 'public',
      phone: '',
      website: ''
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
            social_links: fetchedProfile.social_links || {},
            profileVisibility: fetchedProfile.privacy_settings?.profile_visibility || 'public',
            phone: fetchedProfile.phone || '',
            website: fetchedProfile.website || ''
          };
          
          console.log("Social links from database:", fetchedProfile.social_links);
          console.log("Form data being set:", formData);
          
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
            social_links: {},
            profileVisibility: 'public',
            phone: '',
            website: ''
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

  // SEO: Set title/meta for the edit profile page
  React.useEffect(() => {
    document.title = 'Edit Profile';
    const ensureTag = (selector: string, create: () => HTMLElement) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      return el;
    };
    const metaDesc = ensureTag('meta[name="description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    }) as HTMLMetaElement;
    metaDesc.setAttribute('content', 'Edit your user profile: name, bio, location, interests, links.');
    const canonical = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }) as HTMLLinkElement;
    canonical.setAttribute('href', window.location.origin + '/profile/edit');
  }, []);

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
              <LoadingSpinner size="lg" text="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Edit Profile</h1>
        {profileError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Failed to load profile</AlertTitle>
            <AlertDescription>{profileError}</AlertDescription>
          </Alert>
        )}
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
