
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, FileText, Clock, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  isOrganizer: boolean;
  agreementUrl?: string;
  onAgreementSubmit?: (url: string) => void;
}

export const DeelIntegrationButton: React.FC<DeelIntegrationButtonProps> = ({
  projectTitle,
  projectDescription,
  budgetRange,
  timeline,
  organizerName,
  serviceProviderName,
  isOrganizer,
  agreementUrl,
  onAgreementSubmit
}) => {
  const [agreementLinkInput, setAgreementLinkInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmitAgreementLink = async () => {
    if (!agreementLinkInput.trim()) {
      toast({
        title: "Missing Agreement Link",
        description: "Please enter the agreement URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await onAgreementSubmit?.(agreementLinkInput);
      toast({
        title: "Agreement Link Submitted",
        description: "The agreement link has been sent to the service provider"
      });
      setAgreementLinkInput('');
    } catch (error) {
      console.error('Error submitting agreement link:', error);
      toast({
        title: "Error",
        description: "Failed to submit agreement link",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isOrganizer) {
    return (
      <div className="admin-premium-border">
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-900/80 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-2 text-[#00eada]">
            <span className="font-semibold">Deal Confirmed!</span>
          </div>
          
          <p className="text-sm text-gray-300 text-center">
            Both parties have accepted the proposal. Ready to create your contract with DEEL.
          </p>

          <Button
            onClick={handleDeelIntegration}
            size="lg"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-bold px-8 py-3 text-lg border-0"
          >
            <FileText className="h-5 w-5 mr-2" />
            Create Contract with DEEL
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>

          <p className="text-xs text-gray-400 text-center">
            This will open DEEL with your agreed project details pre-filled
          </p>

          <div className="w-full border-t border-gray-700 pt-4 mt-2">
            <div className="space-y-3">
              <Label htmlFor="agreement-url" className="text-sm font-semibold text-white">
                Submit Agreement Link to Service Provider
              </Label>
              <div className="flex gap-2">
                <Input
                  id="agreement-url"
                  type="url"
                  placeholder="https://deel.com/contract/..."
                  value={agreementLinkInput}
                  onChange={(e) => setAgreementLinkInput(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                />
                <Button
                  onClick={handleSubmitAgreementLink}
                  disabled={submitting || !agreementLinkInput.trim()}
                  className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold border-0"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                    </div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                After creating the contract in DEEL, paste the agreement link here to send it to the service provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Service Provider View
  if (agreementUrl) {
    return (
      <div className="admin-premium-border">
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-900/80 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-2 text-[#00eada]">
            <span className="font-semibold">Agreement Ready!</span>
          </div>
          
          <p className="text-sm text-gray-300 text-center">
            The organizer has created your service agreement. Click below to review and sign.
          </p>

          <Button
            onClick={() => window.open(agreementUrl, '_blank')}
            size="lg"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-bold px-8 py-3 text-lg border-0"
          >
            <FileText className="h-5 w-5 mr-2" />
            Review & Sign Agreement
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-premium-border">
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-900/80 backdrop-blur-sm rounded-lg">
        <div className="flex items-center gap-2 text-orange-400">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Waiting for Agreement Link</span>
        </div>
        
        <p className="text-sm text-gray-300 text-center">
          The organizer is preparing your service agreement. You'll be notified once it's ready for review.
        </p>
      </div>
    </div>
  );
};
