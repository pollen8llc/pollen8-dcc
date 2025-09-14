import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OrganizerSetupGuardProps {
  children: React.ReactNode;
}

const OrganizerSetupGuard = ({ children }: OrganizerSetupGuardProps) => {
  const { currentUser, isLoading } = useUser();
  const { toast } = useToast();
  const [hasOrganizerProfile, setHasOrganizerProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Check if user has organizer profile
  useEffect(() => {
    const checkOrganizerProfile = async () => {
      if (!currentUser) {
        setCheckingProfile(false);
        return;
      }

      try {
        console.log('🔍 OrganizerSetupGuard: Checking organizer profile for user:', currentUser.id);
        
        const { data: organizer, error } = await supabase
          .from('modul8_organizers')
          .select('id, organization_name')
          .eq('user_id', currentUser.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('❌ OrganizerSetupGuard: Error checking organizer profile:', error);
          toast({
            title: "Error",
            description: "Failed to check organizer profile. Please try again.",
            variant: "destructive"
          });
        }

        const hasProfile = !!organizer;
        console.log('✅ OrganizerSetupGuard: Organizer profile check result:', { hasProfile, organizer });
        setHasOrganizerProfile(hasProfile);
      } catch (error) {
        console.error('❌ OrganizerSetupGuard: Unexpected error:', error);
        setHasOrganizerProfile(false);
      } finally {
        setCheckingProfile(false);
      }
    };

    if (!isLoading && currentUser) {
      checkOrganizerProfile();
    } else if (!isLoading) {
      setCheckingProfile(false);
    }
  }, [currentUser, isLoading, toast]);

  // Show loading while checking authentication and profile
  if (isLoading || checkingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Checking profile..." />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!currentUser) {
    const currentPath = window.location.pathname + window.location.search;
    const returnUrl = `?returnTo=${encodeURIComponent(currentPath)}`;
    return <Navigate to={`/auth${returnUrl}`} replace />;
  }

  // Show setup required if no organizer profile
  if (hasOrganizerProfile === false) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Organizer Setup Required</CardTitle>
            <CardDescription>
              You need to complete your organizer profile before you can create service requests
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Setting up your organizer profile helps service providers understand your organization and requirements better.
            </p>
            <Button 
              onClick={() => window.location.href = '/modul8/setup/organizer'}
              size="lg"
            >
              Complete Organizer Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show children if everything is good
  return <>{children}</>;
};

export default OrganizerSetupGuard;