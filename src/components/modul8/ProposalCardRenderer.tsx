import React from 'react';
import { ProposalCard } from '@/types/proposalCards';
import { AgreementCard } from './AgreementCard';
import ProposalCardNew from './ProposalCardNew';
import FinalizationCard from './FinalizationCard';

interface ProposalCardRendererProps {
  card: ProposalCard;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
  allCards?: ProposalCard[]; // New prop to pass all cards for checking counter responses
  organizerId?: string;
  responseData?: {
    responses: any[];
    hasCurrentUserResponded: boolean;
    acceptResponses: any[];
    hasMutualAcceptance: boolean;
    hasAnyAcceptance: boolean;
  };
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  card,
  onActionComplete,
  showCounterOption,
  onCounterClick,
  allCards = [],
  organizerId,
  responseData
}) => {
  // Check if there's a counter response to this card
  const hasCounterResponse = allCards.some(
    otherCard => otherCard.response_to_card_id === card.id
  );

  // Render finalization cards (agreement cards that need DEEL processing)
  if (card.status === 'agreement') {
    return <FinalizationCard card={card} organizerId={organizerId} onActionComplete={onActionComplete} />;
  }

  // Render regular proposal cards - ProposalCardNew has its own prop structure
  return (
    <ProposalCardNew
      card={card}
      hasCounterResponse={hasCounterResponse}
      onActionComplete={onActionComplete}
      showCounterOption={showCounterOption}
      onCounterClick={onCounterClick}
      responseData={responseData}
    />
  );
};
