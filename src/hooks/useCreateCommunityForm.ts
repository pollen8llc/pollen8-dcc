
import { useState, useCallback, useRef } from "react";
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
  const isSubmittingRef = useRef(false);

  // Limit debug logs to prevent UI performance issues
  const maxLogs = 30;
  
  // Use useCallback to prevent function recreation on every render
  const addDebugLog = useCallback((type: DebugLog['type'], message: string) => {
    // Don't log during submission if we already have enough logs
    if (isSubmittingRef.current && type === 'info' && debugLogs.length > maxLogs) {
      return;
    }
    
    console.log(`[${type.toUpperCase()}] ${message}`);
    setDebugLogs(prev => {
      const newLogs = [
        {
          type,
          message,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ];
      
      // Trim logs to prevent memory issues
      return newLogs.slice(0, maxLogs);
    });
  }, [debugLogs.length]);

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
    if (isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    clearDebugLogs();
    
    try {
      addDebugLog('info', 'Starting form submission...');
      
      // Check authentication
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session?.session?.user) {
        throw new Error("You must be logged in to create a community");
      }

      addDebugLog('info', 'Checking user roles...');
      
      // Use the RPC function to check roles safely without accessing auth.users directly
      const { data: roles, error: rolesError } = await supabase.rpc(
        'get_user_roles',
        { user_id: session.session.user.id }
      );
      
      if (rolesError) {
        throw new Error(`Error checking roles: ${rolesError.message}`);
      }

      addDebugLog('info', `Found roles: ${JSON.stringify(roles)}`);
      
      // Determine if user has the required roles
      const hasPermission = roles && roles.some(role => 
        role === 'ADMIN' || role === 'ORGANIZER'
      );
      
      if (!hasPermission) {
        throw new Error("You don't have permission to create a community. Required role: ADMIN or ORGANIZER");
      }

      addDebugLog('success', 'User has proper permissions');
      addDebugLog('info', 'Processing form data...');

      // Process the target audience into an array
      const targetAudienceArray = data.targetAudience
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Process the platforms into an object
      const communicationPlatforms = data.platforms.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);

      addDebugLog('info', 'Inserting community into database...');

      // Insert the community - Important: notice we use user.id directly from the session
      // and don't try to query the auth.users table
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
        throw new Error(`Database error: ${error.message}`);
      }

      if (!community) {
        throw new Error("Failed to create community: No data returned");
      }

      addDebugLog('success', `Community created successfully with ID: ${community.id}`);

      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 1000);

    } catch (error: any) {
      addDebugLog('error', `Error: ${error.message || "Unknown error"}`);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create community",
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
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
