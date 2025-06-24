import { useState, useEffect } from 'react';
import { ServiceRequest, Proposal } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Clock,
  DollarSign,
  Building,
  User,
  AlertTriangle
} from 'lucide-react';
import { getProposalsByRequestId } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';
import ProviderResponseForm from './ProviderResponseForm';
import ProposalCard from './ProposalCard';
import ContractCreationModal from './ContractCreationModal';

interface NegotiationFlowProps {
  serviceRequest: ServiceRequest;
  onUpdate: () => void;
  isServiceProvider?: boolean;
}

const NegotiationFlow = ({ 
  serviceRequest, 
  onUpdate, 
  isServiceProvider = false 
}: NegotiationFlowProps) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [serviceRequest.id]);

  const loadProposals = async () => {
    try {
      const proposalData = await getProposalsByRequestId(serviceRequest.id);
      setProposals(proposalData || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProposalUpdate = () => {
    setShowResponseForm(false);
    loadProposals();
    onUpdate();
  };

  const handleResponseFormCancel = () => {
    setShowResponseForm(false);
  };

  const handleResponseFormSubmit = (data: any) => {
    // Handle form submission logic here
    console.log('Proposal submitted:', data);
    handleProposalUpdate();
  };

  const getStageNumber = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'negotiating': return 2;
      case 'agreed': return 3;
      case 'in_progress': return 4;
      case 'completed': return 5;
      default: return 1;
    }
  };

  const getStageTitle = (status: string) => {
    switch (status) {
      case 'pending': return 'Initiated';
      case 'negotiating': return 'Proposal';
      case 'agreed': return 'Agreement';
      case 'in_progress': return 'Contract';
      case 'completed': return 'Completed';
      default: return 'Initiated';
    }
  };

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
                  onClick={() => setShowResponseForm(true)}
                  className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  Submit Proposal
                </Button>
              )}

              {isServiceProvider && showResponseForm && (
                <ProviderResponseForm
                  serviceRequest={serviceRequest}
                  onSubmit={handleResponseFormSubmit}
                  onCancel={handleResponseFormCancel}
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
              {loading ? (
                <div className="text-center py-4">Loading proposals...</div>
              ) : proposals.length > 0 ? (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onUpdate={handleProposalUpdate}
                      isOrganizer={!isServiceProvider}
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No proposals found for this request.
                  </AlertDescription>
                </Alert>
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
                onClick={() => setShowContractModal(true)}
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
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Request Details</h3>
              <p className="text-muted-foreground">
                {serviceRequest.description}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Project Progress</h3>
          <Badge variant="outline" className="font-medium">
            Stage {getStageNumber(serviceRequest.status)} of 5
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((stage) => {
            const isActive = stage <= getStageNumber(serviceRequest.status);
            const isCurrent = stage === getStageNumber(serviceRequest.status);
            
            return (
              <div key={stage} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2
                  ${isActive 
                    ? 'bg-[#00eada] border-[#00eada] text-black' 
                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                  }
                  ${isCurrent ? 'ring-2 ring-[#00eada]/30' : ''}
                `}>
                  {stage}
                </div>
                {stage < 5 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${isActive ? 'bg-[#00eada]' : 'bg-muted-foreground/30'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-[#00eada]">
            {getStageTitle(serviceRequest.status)}
          </h4>
        </div>
      </div>

      {/* Stage Content */}
      {renderStageContent()}

      {/* Contract Creation Modal */}
      {showContractModal && (
        <ContractCreationModal
          isOpen={showContractModal}
          serviceRequest={serviceRequest}
          proposal={proposals.find(p => p.status === 'accepted')}
          onClose={() => setShowContractModal(false)}
          onCreateContract={handleProposalUpdate}
        />
      )}
    </div>
  );
};

export default NegotiationFlow;
