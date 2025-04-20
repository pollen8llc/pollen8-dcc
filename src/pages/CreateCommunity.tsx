
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { CreateCommunityForm } from "@/components/community/CreateCommunityForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function CreateCommunityPage() {
  const { currentUser, isLoading } = useUser();
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!currentUser) return;
      
      try {
        // Use the RPC function to check permissions
        const { data: roles, error } = await supabase.rpc(
          'get_user_roles',
          { user_id: currentUser.id }
        );
        
        if (error) {
          console.error("Error checking roles:", error);
          toast({
            title: "Error checking permissions",
            description: error.message,
            variant: "destructive",
          });
          setHasPermission(false);
        } else {
          // Check if user has required roles
          const canCreate = roles && Array.isArray(roles) && 
            roles.some(role => role === 'ADMIN' || role === 'ORGANIZER');
          
          setHasPermission(canCreate);
          
          if (!canCreate) {
            toast({
              title: "Permission denied",
              description: "You need to be an Admin or Organizer to create communities",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error("Error in permission check:", err);
        setHasPermission(false);
      } finally {
        setCheckingPermission(false);
      }
    };
    
    if (currentUser) {
      checkPermission();
    } else {
      setCheckingPermission(false);
    }
  }, [currentUser, toast]);

  if (isLoading || checkingPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    toast({
      title: "Authentication required",
      description: "You need to be logged in to create a community",
      variant: "destructive",
    });
    return <Navigate to="/auth" replace />;
  }

  if (hasPermission === false) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CreateCommunityForm />
    </div>
  );
}
