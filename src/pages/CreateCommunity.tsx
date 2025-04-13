
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { UserRole } from '@/models/types';
import CommunityCreateForm from '@/components/community/CommunityCreateForm';

const CreateCommunityPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();

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
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a Community</h1>
        <CommunityCreateForm />
      </div>
    </div>
  );
};

export default CreateCommunityPage;
