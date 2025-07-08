
import React from 'react';
import { ProposalCard } from '@/types/proposalCards';
import { ServiceRequest } from '@/types/modul8';
import ProposalCardNew from './ProposalCardNew';
import FinalizationCard from './FinalizationCard';

interface ProposalCardRendererProps {
  card: ProposalCard;
  serviceRequest: ServiceRequest;
  onActionComplete: () => void;
  onCounterClick?: (cardId: string) => void;
}

const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  card,
  serviceRequest,
  onActionComplete,
  onCounterClick
}) => {
  // Handle agreement cards specially
  if (card.status === 'agreement') {
    return (
      <FinalizationCard
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
      card={card}
      serviceRequest={serviceRequest}
      onActionComplete={onActionComplete}
      onCounterClick={onCounterClick}
    />
  );
};

export default ProposalCardRenderer;
