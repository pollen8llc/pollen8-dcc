import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunitySetupWizard } from '@/components/eco8/CommunitySetupWizard';
import { CommunityFormData } from '@/types/community';

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSetupComplete = async (data: CommunityFormData) => {
    // TODO: Integrate with Supabase to save community data
    console.log('Community setup completed:', data);
    
    // Mock implementation - replace with actual API call
    const communityData = {
      ...data,
      id: crypto.randomUUID(),
      organizerId: 'current-user-id', // Get from auth context
      organizer: 'Current User Name', // Get from auth context
      organizerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      memberCount: 1,
      growthStatus: 'growing' as const,
      banner: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=320&fit=crop`,
      logo: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop`,
      badges: [],
      stats: {
        totalMembers: 1,
        activeMembers: 1,
        monthlyGrowth: 0
      },
      media: {
        videos: [],
        images: []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to localStorage for now (replace with Supabase)
    const existingCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
    existingCommunities.push(communityData);
    localStorage.setItem('communities', JSON.stringify(existingCommunities));
    
    // Redirect to ECO8 dashboard after setup completion
    navigate('/eco8/dashboard');
    
    return communityData;
  };

  return <CommunitySetupWizard onComplete={handleSetupComplete} />;
};

export default CommunitySetup;