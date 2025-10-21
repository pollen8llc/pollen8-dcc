
import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import UnifiedProfileForm from "@/components/profile/UnifiedProfileForm";

import { FormProvider, useForm } from "react-hook-form";

const ProfileSetupPage: React.FC = () => {
  const { currentUser, refreshUser } = useUser();
  const navigate = useNavigate();

  // Create the form context at the top-level component
  // This ensures all child components have access to the form context
  const methods = useForm({
    defaultValues: {
      firstName: currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
      avatarUrl: currentUser?.imageUrl || '',
      avatar: null,
      bio: currentUser?.bio || '',
      location: '',
      interests: [] as string[],
      profileVisibility: 'public', // Default to public for discoverability
      socialLinks: {} as Record<string, string>
    }
  });

  const handleComplete = async () => {
    try {
      await refreshUser();
      navigate('/profile');
    } catch (error) {
      console.error("Error refreshing user after profile setup:", error);
      // Still navigate even if refresh fails
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <UnifiedProfileForm 
              mode="setup" 
              existingData={currentUser} 
              onComplete={handleComplete}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
