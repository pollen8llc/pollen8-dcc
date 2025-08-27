
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { CommunityCreationForm } from '@/components/eco8/CommunityCreationForm';

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (community: any) => {
    // Navigate to the edit page to complete the profile
    navigate(`/eco8/community/${community.id}?edit=true`);
  };

  const handleCancel = () => {
    navigate('/eco8');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="w-full px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Create Your Community</h1>
            <p className="text-lg text-muted-foreground">
              Start building connections and growing your community
            </p>
          </div>

          <CommunityCreationForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunitySetup;
