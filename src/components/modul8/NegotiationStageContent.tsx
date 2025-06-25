
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  Building,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { ProposalSection } from './ProposalSection';
import ProviderResponseForm from './ProviderResponseForm';

interface NegotiationStageContentProps {
  serviceRequest: ServiceRequest;
  isServiceProvider: boolean;
  proposals: any[];
  loading: boolean;
  showResponseForm: boolean;
  showCounterForm: boolean;
  counterProposal: any;
  onSetShowResponseForm: (show: boolean) => void;
  onResponseFormSubmit: (data: any) => void;
  onResponseFormCancel: () => void;
  onCounterFormCancel: () => void;
  onAcceptProposal: (proposal: any) => void;
  onDeclineProposal: (proposal: any) => void;
  onCounterOffer: (proposal: any) => void;
  onProposalUpdate: () => void;
  onCreateContract: () => void;
}

export const NegotiationStageContent: React.FC<NegotiationStageContentProps> = ({
  serviceRequest,
  isServiceProvider,
  proposals,
  loading,
  showResponseForm,
  showCounterForm,
  counterProposal,
  onSetShowResponseForm,
  onResponseFormSubmit,
  onResponseFormCancel,
  onCounterFormCancel,
  onAcceptProposal,
  onDeclineProposal,
  onCounterOffer,
  onProposalUpdate,
  onCreateContract
}) => {
  const renderStageContent = () => {
    switch (serviceRequest.status) {
      case 'pending':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Stage 1: Request Initiated
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Project Details</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {serviceRequest.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceRequest.budget_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Budget: ${serviceRequest.budget_range.min?.toLocaleString() || 'TBD'}
                        {serviceRequest.budget_range.max && 
                          ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}
                  
                  {serviceRequest.timeline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{serviceRequest.timeline}</span>
                    </div>
                  )}
                </div>
              </div>

              {isServiceProvider && !showResponseForm && (
                <Button
                  onClick={() => onSetShowResponseForm(true)}
                  className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  Submit Proposal
                </Button>
              )}

              {isServiceProvider && showResponseForm && (
                <ProviderResponseForm
                  serviceRequest={serviceRequest}
                  onSubmit={onResponseFormSubmit}
                  onCancel={onResponseFormCancel}
                />
              )}

              {!isServiceProvider && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Waiting for service provider to submit their proposal.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 'negotiating':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Stage 2: Proposal & Negotiation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProposalSection
                proposals={proposals}
                loading={loading}
                isServiceProvider={isServiceProvider}
                onAcceptProposal={onAcceptProposal}
                onDeclineProposal={onDeclineProposal}
                onCounterOffer={onCounterOffer}
                onProposalUpdate={onProposalUpdate}
              />

              {showCounterForm && counterProposal && (
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="text-orange-800">Submit Counter Offer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProviderResponseForm
                      serviceRequest={serviceRequest}
                      existingProposal={counterProposal}
                      proposalType="counter"
                      onSubmit={onResponseFormSubmit}
                      onCancel={onCounterFormCancel}
                    />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        );

      case 'agreed':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Stage 3: Agreement Reached
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  🎉 Proposal Accepted!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Both parties have agreed to the terms. Ready to create the contract.
                </p>
                
                {proposals.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Agreed Amount: ${proposals[0]?.quote_amount?.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Timeline: {proposals[0]?.timeline}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={onCreateContract}
                className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                Create Contract with Deel
              </Button>
            </CardContent>
          </Card>
        );

      case 'in_progress':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Stage 4: Contract Active
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                  📋 Project In Progress
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                  Contract has been signed and work has begun.
                </p>
                
                <div className="bg-white dark:bg-gray-800 p-3 rounded border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project Status</span>
                    <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${serviceRequest.project_progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {serviceRequest.project_progress || 0}% Complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'completed':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Stage 5: Project Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                  ✅ Project Successfully Completed
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  All deliverables have been completed and approved.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Request Details</h3>
              <p className="text-muted-foreground">
                {serviceRequest.description}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return <>{renderStageContent()}</>;
};
