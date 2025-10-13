
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityCreationForm } from '@/components/eco8/CommunityCreationForm';
import Navbar from '@/components/Navbar';
import { Eco8Navigation } from '@/components/eco8/Eco8Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useModuleCompletion } from '@/hooks/useModuleCompletion';
import { upgradeToOrganizer } from '@/services/roleService';
import { useUser } from '@/contexts/UserContext';
import { useCommunities } from '@/hooks/useCommunities';
import { toast } from '@/hooks/use-toast';

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const { hasUserCommunities } = useCommunities();
  const { eco8_complete, loading, updateModuleCompletion } = useModuleCompletion();

  const handleSuccess = async (community: any) => {
    console.log('Community created successfully:', community);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) throw new Error('No authenticated user');
      
      // Check if this is a MEMBER creating their first community
      const shouldUpgradeRole = currentUser?.role === 'MEMBER';
      
      // Mark ECO8 setup as complete for first-time users
      if (!eco8_complete) {
        const success = await updateModuleCompletion('eco8', true);
        if (!success) {
          // Fallback: update directly
          console.warn('Module completion function failed, using direct update');
          await supabase
            .from('profiles')
            .update({ 
              eco8_complete: true, 
              eco8_setup_complete: true 
            })
            .eq('user_id', user.user.id);
        }
      }
      
      // Upgrade MEMBER to ORGANIZER if they just created their first community
      if (shouldUpgradeRole) {
        try {
          console.log('Upgrading MEMBER to ORGANIZER after community creation');
          await upgradeToOrganizer(user.user.id);
          await refreshUser(); // Refresh user context
          
          toast({
            title: "🎉 Welcome to Organizers!",
            description: "You've been upgraded to Organizer status. You now have access to all platform features including the full organizer dashboard.",
          });
          
          // Navigate to organizer dashboard with a small delay to ensure user context is updated
          setTimeout(() => {
            navigate('/organizer');
          }, 500);
          return;
        } catch (roleError) {
          console.error('Error upgrading user role:', roleError);
          toast({
            title: "Community Created Successfully",
            description: "Your community was created, but there was an issue upgrading your role. Please contact support if you need organizer access.",
            variant: "destructive"
          });
          // Continue with normal flow if role upgrade fails
        }
      }
      
      // Navigate to the new community page or dashboard
      navigate(`/eco8/community/${community.id}`);
    } catch (error) {
      console.error('Error in community setup completion:', error);
      // Still navigate even if updates fail
      navigate(`/eco8/community/${community.id}`);
    }
  };

  const handleCancel = () => {
    navigate('/eco8');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Eco8Navigation hasUserCommunities={hasUserCommunities} />
        
        <CommunityCreationForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CommunitySetup;
