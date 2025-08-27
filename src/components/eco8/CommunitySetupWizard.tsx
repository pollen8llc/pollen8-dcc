
import React from 'react';
import { CommunityCreationForm } from './CommunityCreationForm';

interface CommunitySetupWizardProps {
  onComplete?: (community: any) => void;
  onCancel?: () => void;
}

export const CommunitySetupWizard: React.FC<CommunitySetupWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <CommunityCreationForm 
        onSuccess={onComplete}
        onCancel={onCancel}
      />
    </div>
  );
};
