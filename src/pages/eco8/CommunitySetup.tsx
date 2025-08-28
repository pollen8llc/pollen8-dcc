
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityCreationForm } from '@/components/eco8/CommunityCreationForm';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (community: any) => {
    console.log('Community created successfully:', community);
    // Navigate to the new community page or dashboard
    navigate(`/eco8/community/${community.id}`);
  };

  const handleCancel = () => {
    navigate('/eco8');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Create Your Community</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start building your community by providing some basic information. 
            You can always update these details later.
          </p>
        </div>
        
        <CommunityCreationForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CommunitySetup;
