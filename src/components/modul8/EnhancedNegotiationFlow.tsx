
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  DollarSign, 
  Clock, 
  FileText, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { ServiceRequest, Proposal, ProposalThread, ProposalVersion } from '@/types/modul8';
import { 
  getProposalThread, 
  createProposalThread, 
  getProposalVersions,
  submitCounterProposal
} from '@/services/enhancedModul8Service';
import { getRequestProposals, assignServiceProvider } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

interface EnhancedNegotiationFlowProps {
  serviceRequest: ServiceRequest;
  onUpdate: () => void;
}

const EnhancedNegotiationFlow: React.FC<EnhancedNegotiationFlowProps> = ({ 
  serviceRequest, 
  onUpdate 
}) => {
  const { session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalThread, setProposalThread] = useState<ProposalThread | null>(null);
  const [proposalVersions, setProposalVersions] = useState<ProposalVersion[]>([]);
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterData, setCounterData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: '',
    change_notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNegotiationData();
  }, [serviceRequest.id]);

  const loadNegotiationData = async () => {
    try {
      const proposalsData = await getRequestProposals(serviceRequest.id);
      setProposals(proposalsData);

      if (proposalsData.length > 0) {
        const thread = await getProposalThread(serviceRequest.id);
        if (thread) {
          setProposalThread(thread);
          const versions = await getProposalVersions(thread.id);
          setProposalVersions(versions);
        }
      }
    } catch (error) {
      console.error('Error loading negotiation data:', error);
    }
  };

  const handleSubmitCounter = async (proposalId: string) => {
    if (!proposalThread || !session?.user?.id) return;

    setLoading(true);
    try {
      await submitCounterProposal(
        proposalThread.id,
        proposalId,
        {
          quote_amount: counterData.quote_amount ? parseFloat(counterData.quote_amount) : undefined,
          timeline: counterData.timeline || undefined,
          scope_details: counterData.scope_details || undefined,
          terms: counterData.terms || undefined,
          created_by: session.user.id
        },
        counterData.change_notes
      );

      toast({
        title: "Counter Proposal Submitted",
        description: "Your counter proposal has been sent successfully."
      });

      setShowCounterForm(false);
      setCounterData({
        quote_amount: '',
        timeline: '',
        scope_details: '',
        terms: '',
        change_notes: ''
      });
      
      await loadNegotiationData();
      onUpdate();
    } catch (error) {
      console.error('Error submitting counter proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit counter proposal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    try {
      await assignServiceProvider(serviceRequest.id, proposal.from_user_id);
      
      toast({
        title: "Proposal Accepted!",
        description: "Service provider has been assigned to the project."
      });

      onUpdate();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    }
  };

  const latestProposal = proposals[proposals.length - 1];
  const isOrganizer = session?.user?.id && serviceRequest.organizer?.user_id === session.user.id;

  return (
    <div className="space-y-6">
      {/* Enhanced Service Request Summary */}
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

          {serviceRequest.service_provider && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Assigned Service Provider</h4>
              <p className="text-sm text-green-700">{serviceRequest.service_provider.business_name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Structured Negotiation Thread */}
      {proposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Negotiation History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display proposal versions if available */}
            {proposalVersions.length > 0 ? (
              <div className="space-y-4">
                {proposalVersions.map((version, index) => (
                  <div key={version.id} className="border-l-2 border-[#00eada] pl-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">
                        Version {version.version_number}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(version.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {version.quote_amount && (
                      <p className="font-medium text-[#00eada]">
                        Quote: ${version.quote_amount.toLocaleString()}
                      </p>
                    )}
                    
                    {version.timeline && (
                      <p className="text-sm"><strong>Timeline:</strong> {version.timeline}</p>
                    )}
                    
                    {version.scope_details && (
                      <p className="text-sm"><strong>Scope:</strong> {version.scope_details}</p>
                    )}
                    
                    {version.change_notes && (
                      <p className="text-sm bg-muted/50 p-2 rounded">
                        <strong>Notes:</strong> {version.change_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Fallback to original proposal display
              proposals.map((proposal, index) => (
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
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Counter Proposal Form */}
      {showCounterForm && isOrganizer && latestProposal && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Counter Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="counter_amount">Counter Quote ($)</Label>
                  <Input
                    id="counter_amount"
                    type="number"
                    value={counterData.quote_amount}
                    onChange={(e) => setCounterData(prev => ({ ...prev, quote_amount: e.target.value }))}
                    placeholder="Enter counter amount"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="counter_timeline">Preferred Timeline</Label>
                  <Input
                    id="counter_timeline"
                    value={counterData.timeline}
                    onChange={(e) => setCounterData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="e.g., 3-4 weeks"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="counter_scope">Scope Adjustments</Label>
                <Textarea
                  id="counter_scope"
                  value={counterData.scope_details}
                  onChange={(e) => setCounterData(prev => ({ ...prev, scope_details: e.target.value }))}
                  placeholder="Describe any changes to the project scope..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="counter_notes">Counter Notes (Required)</Label>
                <Textarea
                  id="counter_notes"
                  value={counterData.change_notes}
                  onChange={(e) => setCounterData(prev => ({ ...prev, change_notes: e.target.value }))}
                  placeholder="Explain the reasoning for your counter proposal..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCounterForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmitCounter(latestProposal.id)}
                  disabled={loading || !counterData.change_notes.trim()}
                  className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  {loading ? 'Submitting...' : 'Submit Counter'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {isOrganizer && latestProposal && !serviceRequest.service_provider && (
        <div className="flex gap-4">
          <Button
            onClick={() => handleAcceptProposal(latestProposal.id)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Proposal
          </Button>
          
          <Button
            onClick={() => setShowCounterForm(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Submit Counter
          </Button>
        </div>
      )}

      {serviceRequest.service_provider && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Proposal Accepted - Project Assigned</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              This project has been assigned to {serviceRequest.service_provider.business_name}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedNegotiationFlow;
