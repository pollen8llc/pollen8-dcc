import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunitySetupWizard } from '@/components/eco8/CommunitySetupWizard';
import { CommunityFormData } from '@/types/community';
import { useCommunities } from '@/hooks/useCommunities';
import { useToast } from '@/hooks/use-toast';

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();
  const { createCommunity } = useCommunities();
  const { toast } = useToast();
  
  const handleSetupComplete = async (data: CommunityFormData) => {
    try {
      // Transform the form data to match the community table structure
      const communityData = {
        name: data.name,
        description: data.description,
        type: data.type,
        location: data.location || 'Remote',
        is_public: data.isPublic,
        website: data.website || undefined,
        tags: data.tags || [],
        vision: data.bio || undefined, // Map bio to vision field
        social_media: data.socialLinks ? {
          twitter: data.socialLinks.twitter || undefined,
          linkedin: data.socialLinks.linkedin || undefined,
          facebook: data.socialLinks.facebook || undefined
        } : undefined
      };

      const newCommunity = await createCommunity(communityData);
      
      toast({
        title: "Community Created!",
        description: "Your community has been successfully set up.",
      });
      
      navigate('/eco8/dashboard');
      return newCommunity;
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return <CommunitySetupWizard onComplete={handleSetupComplete} />;
};

export default CommunitySetup;