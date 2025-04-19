
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import { CreateCommunityForm } from "@/components/community/CreateCommunityForm";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

export default function CreateCommunityPage() {
  const { currentUser, isLoading } = useUser();
  const { toast } = useToast();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking auth:", error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error("Exception checking auth:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser && !isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "You need to be logged in to create a community",
      variant: "destructive",
    });
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a Community</h1>
          <CreateCommunityForm />
        </div>
      </div>
    </div>
  );
}
