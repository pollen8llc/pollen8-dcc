
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';


const OnboardingPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();

  // Redirect if user is not authenticated
  if (!isLoading && !currentUser) {
    navigate('/auth');
    return null;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Skip role selection and go directly to profile setup
  React.useEffect(() => {
    navigate('/profile/setup');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg text-foreground">Setting up your profile...</p>
      </div>
    </div>
  );
};

export default OnboardingPage;
