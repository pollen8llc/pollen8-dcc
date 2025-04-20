
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, type CommunityFormData } from "@/schemas/communitySchema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DebugLog {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export const useCreateCommunityForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [progress, setProgress] = useState(33);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use useCallback to prevent function recreation on every render
  const addDebugLog = useCallback((type: DebugLog['type'], message: string) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    setDebugLogs(prev => [
      ...prev, 
      {
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  const clearDebugLogs = useCallback(() => {
    setDebugLogs([]);
  }, []);

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "tech",
      format: "hybrid",
      location: "",
      targetAudience: "",
      platforms: [],
      website: "",
      newsletterUrl: "",
      socialMediaHandles: {
        twitter: "",
        instagram: "",
        linkedin: "",
        facebook: "",
      },
    },
  });

  const updateProgress = useCallback((tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "basic-info":
        setProgress(33);
        break;
      case "platforms":
        setProgress(66);
        break;
      case "social-media":
        setProgress(100);
        break;
    }
  }, []);

  const onSubmit = async (data: CommunityFormData) => {
    clearDebugLogs();
    try {
      setIsSubmitting(true);
      addDebugLog('info', 'Starting form submission...');
      addDebugLog('info', `Submitting data: ${JSON.stringify(data, null, 2)}`);
      
      // Check authentication
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addDebugLog('error', `Authentication error: ${sessionError.message}`);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session?.session?.user) {
        addDebugLog('error', 'No authenticated user found');
        throw new Error("You must be logged in to create a community");
      }

      addDebugLog('info', `Authenticated as user: ${session.session.user.id}`);
      
      // Check user roles using RLS-compatible approach
      addDebugLog('info', 'Checking user roles...');
      
      const { data: roles, error: rolesError } = await supabase.rpc(
        'get_user_roles',
        { user_id: session.session.user.id }
      );
      
      if (rolesError) {
        addDebugLog('error', `Error checking roles: ${rolesError.message}`);
        throw new Error(`Unable to verify your permissions: ${rolesError.message}`);
      }

      if (!roles || roles.length === 0) {
        addDebugLog('error', 'User has no roles assigned');
        throw new Error("You don't have permission to create a community. Required role: ADMIN or ORGANIZER");
      }
      
      addDebugLog('info', `Found roles: ${JSON.stringify(roles)}`);
      
      const hasPermission = roles.some(role => 
        role === 'ADMIN' || role === 'ORGANIZER'
      );
      
      if (!hasPermission) {
        addDebugLog('error', 'User lacks required permissions (ADMIN or ORGANIZER role)');
        throw new Error("You don't have permission to create a community. Required role: ADMIN or ORGANIZER");
      }

      addDebugLog('success', 'User has proper permissions to create a community');
      addDebugLog('info', 'Processing form data...');

      // Process the target audience into an array
      const targetAudienceArray = data.targetAudience
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      addDebugLog('info', `Processed target audience: ${JSON.stringify(targetAudienceArray)}`);

      // Process the platforms into an object
      const communicationPlatforms = data.platforms.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);

      addDebugLog('info', `Processed platforms: ${JSON.stringify(communicationPlatforms)}`);
      addDebugLog('info', 'Inserting community into database...');

      // Insert the community
      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          type: data.type,
          format: data.format,
          location: data.location,
          target_audience: targetAudienceArray,
          communication_platforms: communicationPlatforms,
          website: data.website || null,
          newsletter_url: data.newsletterUrl || null,
          social_media: data.socialMediaHandles || {},
          owner_id: session.session.user.id,
          is_public: true,
          member_count: 1
        })
        .select()
        .single();

      if (error) {
        addDebugLog('error', `Database error: ${error.message}`);
        console.error("Error creating community:", error);
        throw error;
      }

      if (!community) {
        addDebugLog('error', 'No community data returned after insertion');
        throw new Error("Failed to create community: No data returned");
      }

      addDebugLog('success', `Community created successfully with ID: ${community.id}`);

      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 1500);

    } catch (error: any) {
      console.error("Error creating community:", error);
      addDebugLog('error', `Error: ${error.message || "Unknown error"}`);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create community",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    activeTab,
    progress,
    updateProgress,
    onSubmit,
    debugLogs,
    addDebugLog,
    clearDebugLogs
  };
};
