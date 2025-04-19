
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserRole } from '@/models/types';
import CommunityCreateForm from '@/components/community/CommunityCreateForm';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const CreateCommunityPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Show loading state while checking auth
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

  // Redirect if user is not authenticated
  if (!currentUser) {
    toast({
      title: "Authentication required",
      description: "You need to be logged in to create a community",
      variant: "destructive",
    });
    return <Navigate to="/auth" replace />;
  }

  console.log("Creating community as user:", currentUser);

  const handleSuccess = (communityId: string) => {
    console.log(`Community created successfully with ID: ${communityId}`);
    toast({
      title: "Success!",
      description: "Your community has been created",
      variant: "default",
    });
    navigate(`/community/${communityId}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a Community</h1>
          <Card className="p-6">
            <CommunityCreateForm onSuccess={handleSuccess} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;
