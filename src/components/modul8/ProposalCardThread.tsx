
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, MessageSquare, FileText, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProposalCardNew from './ProposalCardNew';
import StructuredProposalForm from './StructuredProposalForm';
import { ProposalCard, CreateProposalCardData } from '@/types/proposalCards';
import { ServiceRequest } from '@/types/modul8';
import { getProposalCards, createProposalCard, createCounterProposalFromCard } from '@/services/proposalCardService';
import { useSession } from '@/hooks/useSession';

interface ProposalCardThreadProps {
  requestId: string;
  isServiceProvider: boolean;
  serviceRequest: ServiceRequest;
}

const ProposalCardThread: React.FC<ProposalCardThreadProps> = ({
  requestId,
  isServiceProvider,
  serviceRequest
}) => {
  const { session } = useSession();
  const [proposals, setProposals] = useState<ProposalCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);
  const [counterProposalCardId, setCounterProposalCardId] = useState<string | null>(null);

  useEffect(() => {
    loadProposals();
  }, [requestId]);

  const loadProposals = async () => {
    try {
      console.log('📥 Loading proposals for request:', requestId);
      const data = await getProposalCards(requestId);
      console.log('📊 Loaded proposals:', data?.length || 0, data);
      setProposals(data || []);
    } catch (error) {
      console.error('❌ Error loading proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (data: CreateProposalCardData) => {
    try {
      console.log('🚀 Creating new proposal:', data);
      await createProposalCard(data);
      toast({
        title: "Success",
        description: "Proposal created successfully!",
        variant: "default"
      });
      setShowNewProposalForm(false);
      await loadProposals();
    } catch (error) {
      console.error('❌ Error creating proposal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create proposal';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCounterProposal = async (originalCardId: string, counterData: Omit<CreateProposalCardData, 'response_to_card_id'>) => {
    try {
      console.log('🔄 Creating counter proposal for card:', originalCardId);
      await createCounterProposalFromCard(originalCardId, counterData);
      toast({
        title: "Success",
        description: "Counter proposal created successfully!",
        variant: "default"
      });
      setCounterProposalCardId(null);
      await loadProposals();
    } catch (error) {
      console.error('❌ Error creating counter proposal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create counter proposal';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const canCreateProposal = () => {
    if (serviceRequest.is_agreement_locked) return false;
    
    if (isServiceProvider) {
      return serviceRequest.service_provider_id === null || 
             session?.user?.id === serviceRequest.service_provider?.user_id;
    } else {
      return session?.user?.id === serviceRequest.organizer?.user_id;
    }
  };

  const getThreadTitle = () => {
    const agreementCard = proposals.find(p => p.status === 'agreement');
    if (agreementCard) {
      return "🎉 Agreement Reached";
    }
    
    if (serviceRequest.is_agreement_locked) {
      return "🔒 Proposal Thread (Locked)";
    }
    
    return "💬 Proposal Thread";
  };

  const getThreadDescription = () => {
    const agreementCard = proposals.find(p => p.status === 'agreement');
    if (agreementCard) {
      return "Both parties have accepted a proposal. The request is ready for contract execution.";
    }
    
    if (serviceRequest.is_agreement_locked) {
      return "This request has been locked and no new proposals can be submitted.";
    }
    
    return "Exchange proposals and negotiate terms for this service request.";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Loading Proposals...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thread Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {getThreadTitle()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {getThreadDescription()}
          </p>
        </CardHeader>
        
        {!serviceRequest.is_agreement_locked && canCreateProposal() && (
          <CardContent>
            <Button
              onClick={() => setShowNewProposalForm(true)}
              className="w-full"
              disabled={showNewProposalForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Proposal
            </Button>
          </CardContent>
        )}
      </Card>

      {/* New Proposal Form */}
      {showNewProposalForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <StructuredProposalForm
              requestId={requestId}
              onSubmit={handleCreateProposal}
              onCancel={() => setShowNewProposalForm(false)}
              isServiceProvider={isServiceProvider}
            />
          </CardContent>
        </Card>
      )}

      {/* Counter Proposal Form */}
      {counterProposalCardId && (
        <Card>
          <CardHeader>
            <CardTitle>Create Counter Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <StructuredProposalForm
              requestId={requestId}
              onSubmit={(data) => handleCounterProposal(counterProposalCardId, data)}
              onCancel={() => setCounterProposalCardId(null)}
              isServiceProvider={isServiceProvider}
              isCounterProposal={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Proposals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to submit a proposal for this request.
              </p>
              {canCreateProposal() && !serviceRequest.is_agreement_locked && (
                <Button onClick={() => setShowNewProposalForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          proposals.map((proposal) => (
            <ProposalCardNew
              key={proposal.id}
              proposal={proposal}
              isServiceProvider={isServiceProvider}
              onCounterClick={() => setCounterProposalCardId(proposal.id)}
              onActionComplete={loadProposals}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProposalCardThread;
