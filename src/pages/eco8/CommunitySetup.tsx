
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityCreationForm } from '@/components/eco8/CommunityCreationForm';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { supabase } from '@/integrations/supabase/client';
import { useModuleCompletion } from '@/hooks/useModuleCompletion';

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();
  const { eco8_complete, loading } = useModuleCompletion();

  const handleSuccess = (community: any) => {
    console.log('Community created successfully:', community);
    
    // Mark ECO8 setup as complete for first-time users
    const completeSetup = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.id && !eco8_complete) {
          await supabase
            .from('profiles')
            .update({ eco8_setup_complete: true })
            .eq('id', user.user.id);
        }
        // Navigate to the new community page or dashboard
        navigate(`/eco8/community/${community.id}`);
      } catch (error) {
        console.error('Error completing ECO8 setup:', error);
        // Still navigate even if update fails
        navigate(`/eco8/community/${community.id}`);
      }
    };
    
    completeSetup();
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
