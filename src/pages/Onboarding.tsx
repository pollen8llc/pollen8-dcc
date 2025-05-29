
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import OnboardingSelector from '@/components/onboarding/OnboardingSelector';
import CommunityPicker from '@/components/onboarding/CommunityPicker';
import AuthLayout from '@/components/auth/AuthLayout';
import { UserRole } from '@/models/types';

enum OnboardingStep {
  ROLE_SELECTION = 'role',
  COMMUNITY_SELECTION = 'communities',
  COMPLETE = 'complete'
}

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.ROLE_SELECTION);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.MEMBER);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleRoleSelected = (role: UserRole) => {
    setSelectedRole(role);
    
    switch (role) {
      case UserRole.ORGANIZER:
        navigate('/create-community');
        break;
      case UserRole.MEMBER:
        setCurrentStep(OnboardingStep.COMMUNITY_SELECTION);
        break;
      case UserRole.GUEST:
        navigate('/');
        break;
      default:
        // Admin or other roles - navigate to dashboard
        navigate('/');
    }
  };

  return (
    <AuthLayout 
      title="Set up your ECO8 experience"
      subtitle="Complete a few steps to get started with your eco-friendly journey"
    >
      {currentStep === OnboardingStep.ROLE_SELECTION && (
        <OnboardingSelector />
      )}
      
      {currentStep === OnboardingStep.COMMUNITY_SELECTION && (
        <CommunityPicker />
      )}
    </AuthLayout>
  );
};

export default OnboardingPage;
