import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ProposalCard } from '@/types/proposalCards';
import { ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import { createProposalCard, createCounterProposalFromCard, getProposalCards } from '@/services/proposalCardService';
import ProposalCardNew from './ProposalCardNew';
import ProposalCardRenderer from './ProposalCardRenderer';
import FinalizationCard from './FinalizationCard';

interface ProposalCardThreadProps {
  serviceRequest: ServiceRequest;
  onActionComplete: () => void;
}

const ProposalCardThread: React.FC<ProposalCardThreadProps> = ({
  serviceRequest,
  onActionComplete
}) => {
  const [cards, setCards] = useState<ProposalCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCounterForm, setShowCounterForm] = useState<{ cardId: string; visible: boolean }>({
    cardId: '',
    visible: false
  });

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const proposalCards = await getProposalCards(serviceRequest.id);
      setCards(proposalCards);
    } catch (error) {
      console.error("Error loading proposal cards:", error);
      toast({
        title: "Error",
        description: "Failed to load proposal cards",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [serviceRequest.id]);

  React.useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleCreateCard = async (data: Omit<ProposalCard, 'id'>) => {
    setIsCreating(true);
    try {
      await createProposalCard({
        ...data,
        request_id: serviceRequest.id
      });
      toast({
        title: "Success",
        description: "Proposal card created successfully!",
        variant: "default"
      });
      loadCards(); // Refresh cards
      onActionComplete();
    } catch (error) {
      console.error("Error creating proposal card:", error);
      toast({
        title: "Error",
        description: "Failed to create proposal card",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCounterClick = (cardId: string) => {
    setShowCounterForm({ cardId: cardId, visible: true });
  };

  const handleCreateCounter = async (cardId: string, counterData: Omit<ProposalCard, 'id'>) => {
    setIsCreating(true);
    try {
      await createCounterProposalFromCard(cardId, {
        ...counterData,
        request_id: serviceRequest.id
      });
      toast({
        title: "Success",
        description: "Counter proposal created successfully!",
        variant: "default"
      });
      loadCards(); // Refresh cards
      onActionComplete();
      setShowCounterForm({ cardId: '', visible: false }); // Hide the form
    } catch (error) {
      console.error("Error creating counter proposal:", error);
      toast({
        title: "Error",
        description: "Failed to create counter proposal",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCounter = () => {
    setShowCounterForm({ cardId: '', visible: false });
  };

  const renderProposalCard = (card: ProposalCard) => {
    // Handle agreement/finalization cards
    if (card.status === 'agreement') {
      return (
        <FinalizationCard
          key={card.id}
          card={card}
          organizerId={serviceRequest.organizer?.user_id}
          serviceProviderId={serviceRequest.service_provider?.user_id}
          onActionComplete={onActionComplete}
        />
      );
    }

    // Regular proposal cards
    return (
      <ProposalCardNew
        key={card.id}
        card={card}
        serviceRequest={serviceRequest}
        onActionComplete={onActionComplete}
        onCounterClick={handleCounterClick}
      />
    );
  };

  return (
    <div className="space-y-4">
      {cards.map(card => (
        renderProposalCard(card)
      ))}

      {/* New Proposal Card Form */}
      <ProposalCardNew
        key="new"
        serviceRequest={serviceRequest}
        onCreate={handleCreateCard}
        isLoading={isCreating}
        onActionComplete={onActionComplete}
      />
    </div>
  );
};

export default ProposalCardThread;
