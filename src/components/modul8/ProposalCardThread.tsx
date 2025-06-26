import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { ServiceRequest } from '@/types/modul8';
import { getProposalCards, createProposalCard } from '@/services/proposalCardService';
import { ProposalCardRenderer } from './ProposalCardRenderer';
import StructuredProposalForm from './StructuredProposalForm';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

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
  const [proposalCards, setProposalCards] = useState<ProposalCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [isCounterProposal, setIsCounterProposal] = useState(false);

  useEffect(() => {
    loadProposalCards();
  }, [requestId]);

  const loadProposalCards = async () => {
    if (!requestId) return;
    
    setLoading(true);
    try {
      console.log('🔄 Loading proposal cards for request:', requestId);
      const cards = await getProposalCards(requestId);
      console.log('📥 Loaded proposal cards:', cards);
      setProposalCards(cards);
    } catch (error) {
      console.error('❌ Error loading proposal cards:', error);
      toast({
        title: "Error",
        description: "Failed to load proposal cards",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (data: any) => {
    if (!session?.user?.id) return;

    try {
      console.log('🚀 Creating proposal card with data:', data);
      
      const proposalData = {
        request_id: requestId,
        submitted_by: session.user.id,
        negotiated_title: data.title,
        negotiated_description: data.description,
        negotiated_budget_range: { 
          min: data.budgetMin, 
          max: data.budgetMax, 
          currency: 'USD' 
        },
        negotiated_timeline: data.timeline,
        notes: data.milestones?.join('\n') || '',
        asset_links: [],
        scope_link: null,
        terms_link: null,
        response_to_card_id: isCounterProposal ? data.response_to_card_id : null
      };

      await createProposalCard(proposalData);
      
      toast({
        title: "Success",
        description: "Proposal card created successfully!",
        variant: "default"
      });

      setShowProposalForm(false);
      setIsCounterProposal(false);
      await loadProposalCards();
    } catch (error) {
      console.error('❌ Error creating proposal card:', error);
      toast({
        title: "Error",
        description: "Failed to create proposal card",
        variant: "destructive"
      });
    }
  };

  const handleCounterProposal = (originalCardId?: string) => {
    setIsCounterProposal(true);
    setShowProposalForm(true);
  };

  const getRequestStatusInfo = () => {
    const hasAcceptedCard = proposalCards.some(card => card.status === 'accepted');
    const hasAgreementCard = proposalCards.some(card => card.status === 'agreement');
    
    if (hasAgreementCard) {
      return {
        canCreateProposal: false,
        message: "This request has reached a final agreement.",
        variant: "default" as const,
        icon: CheckCircle
      };
    }
    
    if (hasAcceptedCard) {
      return {
        canCreateProposal: false,
        message: "This request has an accepted proposal and is being finalized.",
        variant: "default" as const,
        icon: CheckCircle
      };
    }
    
    return {
      canCreateProposal: true,
      message: null,
      variant: "default" as const,
      icon: null
    };
  };

  const statusInfo = getRequestStatusInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {statusInfo.message && (
        <Alert className="border-green-200 bg-green-50">
          <statusInfo.icon className="h-4 w-4" />
          <AlertDescription>{statusInfo.message}</AlertDescription>
        </Alert>
      )}

      {/* Create Proposal Button */}
      {statusInfo.canCreateProposal && !showProposalForm && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={() => setShowProposalForm(true)}
              className="w-full"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Proposal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Proposal Form */}
      {showProposalForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">
                {isCounterProposal ? 'Create Counter Proposal' : 'Create New Proposal'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <StructuredProposalForm
              onSubmit={handleCreateProposal}
              onCancel={() => {
                setShowProposalForm(false);
                setIsCounterProposal(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Proposal Cards */}
      <div className="space-y-4">
        {proposalCards.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No proposals yet. Be the first to create one!</p>
            </CardContent>
          </Card>
        ) : (
          proposalCards.map((card) => (
            <ProposalCardRenderer
              key={card.id}
              card={card}
              onActionComplete={loadProposalCards}
              showCounterOption={statusInfo.canCreateProposal}
              onCounterClick={() => handleCounterProposal(card.id)}
              allCards={proposalCards}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProposalCardThread;
