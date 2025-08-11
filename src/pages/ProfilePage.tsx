
import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles.tsx";
import Navbar from "@/components/Navbar";
import EnhancedProfileView from "@/components/profile/EnhancedProfileView";
import { useNavigate } from "react-router-dom";
import { UnifiedProfile } from "@/types/unifiedProfile";
import LoadingSpinner from "@/components/ui/loading-spinner";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoading } = useUser();
  const { getProfileById, isLoading: profileLoading } = useProfiles();
  const [profileData, setProfileData] = React.useState<UnifiedProfile | null>(null);
  const navigate = useNavigate();
  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
        setFetching(true);
        setError(null);
        try {
          const fetchedProfile = await getProfileById(profileId);
          if (fetchedProfile) {
            setProfileData(fetchedProfile);
          } else {
            setError('Profile not found');
            setProfileData(null);
          }
        } catch (e: any) {
          console.error('Error fetching profile:', e);
          setError(e?.message || 'Failed to load profile');
          setProfileData(null);
        } finally {
          setFetching(false);
        }
      }
    };

    if (!isLoading && profileId) {
      fetchProfile();
    }
  }, [profileId, isLoading]);

  // SEO: Set title, meta description, and canonical
  React.useEffect(() => {
    const name = profileData ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : '';
    const title = name ? `${name} | Profile` : 'User Profile';
    document.title = title;

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
    metaDesc.setAttribute('content', profileData?.bio?.slice(0, 150) || 'View user profile, bio, location and interests.');

    const canonical = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }) as HTMLLinkElement;
    canonical.setAttribute('href', window.location.origin + (id ? `/profile/${id}` : '/profile'));
  }, [profileData, id]);

  // Show loading state
  if (isLoading || profileLoading || fetching) {
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

  if (!profileData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile not found</h1>
            <p className="mt-2 text-muted-foreground">The profile may not exist or you may not have permission to view it.</p>
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
        <h1 className="sr-only">Profile of {profileData.first_name || ''} {profileData.last_name || ''}</h1>
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
