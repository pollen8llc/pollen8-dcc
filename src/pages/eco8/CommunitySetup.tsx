
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunitySetupWizard } from '@/components/eco8/CommunitySetupWizard';
import { CommunityFormData } from '@/types/community';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Location options matching the wizard
const LOCATION_OPTIONS = [
  { value: 'remote', label: 'Remote/Online' },
  { value: 'san-francisco', label: 'San Francisco, CA' },
  { value: 'new-york', label: 'New York, NY' },
  { value: 'los-angeles', label: 'Los Angeles, CA' },
  { value: 'chicago', label: 'Chicago, IL' },
  { value: 'austin', label: 'Austin, TX' },
  { value: 'seattle', label: 'Seattle, WA' },
  { value: 'boston', label: 'Boston, MA' },
  { value: 'miami', label: 'Miami, FL' },
  { value: 'denver', label: 'Denver, CO' },
  { value: 'london', label: 'London, UK' },
  { value: 'toronto', label: 'Toronto, Canada' },
  { value: 'berlin', label: 'Berlin, Germany' },
  { value: 'amsterdam', label: 'Amsterdam, Netherlands' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'sydney', label: 'Sydney, Australia' },
  { value: 'other', label: 'Other' },
];

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const handleSetupComplete = async (data: CommunityFormData) => {
    if (!currentUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a community.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has ORGANIZER role
      const { data: userRoles, error: roleError } = await supabase.rpc('get_user_roles', {
        user_id: currentUser.id
      });

      if (roleError) {
        console.error('Error checking user roles:', roleError);
        toast({
          title: "Permission Check Failed",
          description: "Unable to verify your permissions. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const hasOrganizerRole = userRoles && userRoles.includes('ORGANIZER');
      
      if (!hasOrganizerRole) {
        toast({
          title: "Permission Required",
          description: "You need to have the ORGANIZER role to create communities. Please contact an administrator.",
          variant: "destructive",
        });
        return;
      }

      // Transform form data for community_data_distribution submission
      const allowedTypes = ['tech','creative','wellness','professional','social-impact','education','social','other'] as const;
      const normalizeType = (t?: string) => {
        if (!t) return 'tech';
        const slug = t.trim().toLowerCase().replace(/[\s_]+/g, '-');
        return (allowedTypes as readonly string[]).includes(slug) ? slug : 'other';
      };
      const normalizeFormat = (f?: string) => {
        if (!f) return 'hybrid';
        const v = f.trim().toLowerCase();
        if (v === 'online' || v === 'hybrid' || v === 'irl') return v === 'irl' ? 'IRL' : v; // accept "irl" and send as IRL
        return 'hybrid';
      };

      // Transform location
      const getLocationValue = (location: string, customLocation?: string) => {
        if (location === 'other') return customLocation || 'Other';
        const locationOption = LOCATION_OPTIONS.find(l => l.value === location);
        return locationOption?.label || location;
      };

      const submissionData = {
        name: data.name,
        description: data.description,
        type: normalizeType(data.type as any),
        location: getLocationValue(data.location, data.customLocation),
        isPublic: data.isPublic,
        website: data.website || null,
        targetAudience: data.tags || [],
        socialMedia: data.socialLinks ? {
          twitter: data.socialLinks.twitter || null,
          linkedin: data.socialLinks.linkedin || null,
          facebook: data.socialLinks.facebook || null
        } : {},
        bio: data.bio || null,
        format: normalizeFormat(data.format),
        community_size: data.communitySize || '1-10',
        event_frequency: data.eventFrequency || 'monthly',
        communicationPlatforms: {}
      };
      // Submit to community_data_distribution for processing
      const { data: distributionData, error: distributionError } = await supabase
        .from('community_data_distribution')
        .insert({
          submitter_id: currentUser.id,
          submission_data: submissionData,
          status: 'pending'
        })
        .select()
        .single();

      if (distributionError) {
        console.error('Error submitting community data:', distributionError);
        toast({
          title: "Submission Failed",
          description: distributionError.message || "Failed to submit community data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Poll for processing completion
      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = 1000; // 1 second

      const pollForCompletion = async () => {
        attempts++;
        
        const { data: statusData, error: statusError } = await supabase
          .from('community_data_distribution')
          .select('status, community_id, error_message')
          .eq('id', distributionData.id)
          .single();

        if (statusError) {
          console.error('Error checking submission status:', statusError);
          toast({
            title: "Error",
            description: "Failed to check submission status.",
            variant: "destructive",
          });
          return;
        }

        if (statusData.status === 'completed' && statusData.community_id) {
          toast({
            title: "Community Created!",
            description: "Your community has been successfully created.",
          });
          navigate('/eco8/dashboard');
        } else if (statusData.status === 'failed') {
          toast({
            title: "Creation Failed",
            description: statusData.error_message || "Failed to create community. Please try again.",
            variant: "destructive",
          });
        } else if (attempts < maxAttempts) {
          // Still processing, continue polling
          setTimeout(pollForCompletion, pollInterval);
        } else {
          // Max attempts reached
          toast({
            title: "Processing Timeout",
            description: "Community creation is taking longer than expected. Please check your dashboard in a few minutes.",
            variant: "destructive",
          });
          navigate('/eco8/dashboard');
        }
      };

      // Start polling
      setTimeout(pollForCompletion, pollInterval);

    } catch (error) {
      console.error('Error in community setup:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return <CommunitySetupWizard onComplete={handleSetupComplete} />;
};

export default CommunitySetup;
