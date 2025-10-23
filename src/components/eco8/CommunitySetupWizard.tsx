
import React from 'react';
import { CommunityCreationForm } from './CommunityCreationForm';

interface CommunitySetupWizardProps {
  onComplete?: (community: any) => void;
  onCancel?: () => void;
}

export const CommunitySetupWizard: React.FC<CommunitySetupWizardProps> = () => {
  // Redirect to /p8 for the new flow
  React.useEffect(() => {
    window.location.href = '/p8';
  }, []);

  return null;
};
