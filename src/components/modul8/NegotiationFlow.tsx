
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Handshake
} from 'lucide-react';
import { ServiceRequest, Proposal } from '@/types/modul8';
import { createProposal, getRequestProposals, updateServiceRequest } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

interface NegotiationFlowProps {
  serviceRequest: ServiceRequest;
  onUpdate: () => void;
}

const NEGOTIATION_STEPS = [
  { key: 'initiated', label: 'Initiated' },
  { key: 'proposal', label: 'Proposal Sent' },
  { key: 'negotiating', label: 'Negotiating' },
  { key: 'agreement', label: 'Agreement' },
  { key: 'deel', label: 'Contract' }
];

const NegotiationFlow: React.FC<NegotiationFlowProps> = ({ serviceRequest, onUpdate }) => {
  const { session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: ''
  });
  const [loading, setLoading] = useState(false);
  const [agreeing, setAgreeing] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [serviceRequest.id]);

  const loadProposals = async () => {
    try {
      const proposalsData = await getRequestProposals(serviceRequest.id);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const getCurrentStep = () => {
    if (serviceRequest.status === 'completed') return 4;
    if (serviceRequest.status === 'agreed') return 3;
    if (proposals.length > 0) return serviceRequest.engagement_status === 'negotiating' ? 2 : 1;
    return 0;
  };

  const getProgressPercentage = () => {
    const currentStep = getCurrentStep();
    return (currentStep / (NEGOTIATION_STEPS.length - 1)) * 100;
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      await createProposal({
        service_request_id: serviceRequest.id,
        from_user_id: session.user.id,
        proposal_type: proposals.length === 0 ? 'initial' : 'counter',
        quote_amount: proposalData.quote_amount ? parseFloat(proposalData.quote_amount) : undefined,
        timeline: proposalData.timeline || undefined,
        scope_details: proposalData.scope_details || undefined,
        terms: proposalData.terms || undefined
      });

      toast({
        title: "Success!",
        description: "Your proposal has been submitted."
      });

      setShowProposalForm(false);
      setProposalData({ quote_amount: '', timeline: '', scope_details: '', terms: '' });
      loadProposals();
      onUpdate();
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = async () => {
    setAgreeing(true);
    try {
      await updateServiceRequest(serviceRequest.id, {
        status: 'agreed',
        engagement_status: 'affiliated'
      });

      toast({
        title: "Agreement Reached!",
        description: "You can now proceed to create the contract."
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating service request:', error);
      toast({
        title: "Error",
        description: "Failed to reach agreement",
        variant: "destructive"
      });
    } finally {
      setAgreeing(false);
    }
  };

  const handleLockDeal = () => {
    // Generate Deel deeplink with prefilled data
    const deelParams = new URLSearchParams({
      service_title: serviceRequest.title,
      client_name: serviceRequest.organizer?.organization_name || 'Client',
      amount: proposalData.quote_amount || '0',
      timeline: proposalData.timeline || 'TBD',
      description: serviceRequest.description || ''
    });

    // In a real implementation, this would be Deel's actual contract creation URL
    const deelUrl = `https://app.deel.com/contracts/create?${deelParams.toString()}`;
    
    toast({
      title: "Redirecting to Deel",
      description: "Opening contract creation page..."
    });

    // Open Deel in new tab
    window.open(deelUrl, '_blank');
  };

  const latestProposal = proposals[proposals.length - 1];
  const canLockDeal = serviceRequest.status === 'agreed' || 
    (proposals.length > 0 && latestProposal?.status === 'accepted');
  const canAgree = proposals.length > 0 && serviceRequest.status !== 'agreed';

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Negotiation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={getProgressPercentage()} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {NEGOTIATION_STEPS.map((step, index) => (
                <div 
                  key={step.key}
                  className={`flex flex-col items-center ${
                    index <= getCurrentStep() ? 'text-[#00eada]' : ''
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mb-1 ${
                    index <= getCurrentStep() ? 'bg-[#00eada]' : 'bg-muted'
                  }`} />
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>{serviceRequest.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceRequest.description && (
            <p className="text-muted-foreground">{serviceRequest.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {serviceRequest.budget_range?.min && serviceRequest.budget_range?.max
                  ? `$${serviceRequest.budget_range.min.toLocaleString()} - $${serviceRequest.budget_range.max.toLocaleString()}`
                  : 'Budget: TBD'}
              </span>
            </div>
            
            {serviceRequest.timeline && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{serviceRequest.timeline}</span>
              </div>
            )}
          </div>

          {serviceRequest.milestones && Array.isArray(serviceRequest.milestones) && serviceRequest.milestones.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Deliverables</h4>
              <div className="space-y-1">
                {serviceRequest.milestones.map((milestone, index) => (
                  <div key={index} className="text-sm bg-muted/50 px-3 py-2 rounded">
                    {typeof milestone === 'string' ? milestone : JSON.stringify(milestone)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposals Thread */}
      {proposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Proposal History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {proposals.map((proposal, index) => (
              <div key={proposal.id} className="border-l-2 border-[#00eada] pl-4 space-y-2">
                <div className="flex justify-between items-start">
                  <Badge variant={proposal.status === 'accepted' ? 'default' : 'secondary'}>
                    {proposal.proposal_type} Proposal
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {proposal.quote_amount && (
                  <p className="font-medium text-[#00eada]">
                    Quote: ${proposal.quote_amount.toLocaleString()}
                  </p>
                )}
                
                {proposal.timeline && (
                  <p className="text-sm"><strong>Timeline:</strong> {proposal.timeline}</p>
                )}
                
                {proposal.scope_details && (
                  <p className="text-sm"><strong>Scope:</strong> {proposal.scope_details}</p>
                )}
                
                {proposal.terms && (
                  <p className="text-sm"><strong>Terms:</strong> {proposal.terms}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!showProposalForm && !canLockDeal && (
          <>
            <Button
              onClick={() => setShowProposalForm(true)}
              className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              <MessageSquare className="h-4 w-4" />
              {proposals.length === 0 ? 'Send Proposal' : 'Counter Proposal'}
            </Button>
            
            {canAgree && (
              <Button
                onClick={handleAgree}
                disabled={agreeing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4" />
                {agreeing ? 'Agreeing...' : 'AGREE'}
              </Button>
            )}
          </>
        )}

        {canLockDeal && (
          <Button
            onClick={handleLockDeal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Handshake className="h-4 w-4" />
            Lock Deal
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Proposal Form */}
      {showProposalForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quote_amount">Quote Amount ($)</Label>
                  <Input
                    id="quote_amount"
                    type="number"
                    value={proposalData.quote_amount}
                    onChange={(e) => setProposalData(prev => ({ ...prev, quote_amount: e.target.value }))}
                    placeholder="5000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Estimated Timeline</Label>
                  <Input
                    id="timeline"
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="2-3 weeks"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope_details">Scope Details</Label>
                <Textarea
                  id="scope_details"
                  value={proposalData.scope_details}
                  onChange={(e) => setProposalData(prev => ({ ...prev, scope_details: e.target.value }))}
                  placeholder="Clarify what will be delivered..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={proposalData.terms}
                  onChange={(e) => setProposalData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Payment terms, revisions, etc..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProposalForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  {loading ? 'Submitting...' : 'Submit Proposal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NegotiationFlow;
