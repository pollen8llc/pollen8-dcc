
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { CreateCommunityForm } from "@/components/community/CreateCommunityForm";

export default function CreateCommunityPage() {
  const { currentUser, isLoading } = useUser();
  const { toast } = useToast();

  if (isLoading) {
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

  // Check if user has the required role to create communities
  const hasRequiredRole = currentUser.role === 'ADMIN' || currentUser.role === 'ORGANIZER';
  
  if (!hasRequiredRole) {
    toast({
      title: "Permission denied",
      description: "You need to be an Admin or Organizer to create communities",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CreateCommunityForm />
    </div>
  );
}
