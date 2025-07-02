
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Sparkles } from 'lucide-react';

interface DeelIntegrationButtonProps {
  projectTitle?: string;
  projectDescription?: string;
  budgetRange?: {
    min?: number;
    max?: number;
    currency: string;
  };
  timeline?: string;
  organizerName?: string;
  serviceProviderName?: string;
}

export const DeelIntegrationButton: React.FC<DeelIntegrationButtonProps> = ({
  projectTitle,
  projectDescription,
  budgetRange,
  timeline,
  organizerName,
  serviceProviderName
}) => {
  const handleDeelIntegration = () => {
    // Construct DEEL URL with project parameters
    const deelParams = new URLSearchParams({
      project_title: projectTitle || 'Service Agreement',
      project_description: projectDescription || '',
      budget_min: budgetRange?.min?.toString() || '',
      budget_max: budgetRange?.max?.toString() || '',
      currency: budgetRange?.currency || 'USD',
      timeline: timeline || '',
      client_name: organizerName || '',
      contractor_name: serviceProviderName || ''
    });

    // Open DEEL in new tab with project details
    const deelUrl = `https://deel.com/contracts/new?${deelParams.toString()}`;
    window.open(deelUrl, '_blank');
  };

  return (
    <div className="deel-integration-container relative">
      <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-400">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold">Deal Confirmed!</span>
          <Sparkles className="h-5 w-5" />
        </div>
        
        <p className="text-sm text-gray-300 text-center">
          Both parties have accepted the proposal. Ready to create your contract with DEEL.
        </p>

        <Button
          onClick={handleDeelIntegration}
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold px-8 py-3 text-lg"
        >
          <FileText className="h-5 w-5 mr-2" />
          Create Contract with DEEL
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>

        <p className="text-xs text-gray-400 text-center">
          This will open DEEL with your agreed project details pre-filled
        </p>
      </div>
    </div>
  );
};
