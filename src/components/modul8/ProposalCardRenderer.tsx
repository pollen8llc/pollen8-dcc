
import React from 'react';
import { ProposalCard } from '@/types/proposalCards';
import { AgreementCard } from './AgreementCard';
import ProposalCardNew from './ProposalCardNew';

interface ProposalCardRendererProps {
  card: ProposalCard;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
  allCards?: ProposalCard[]; // New prop to pass all cards for checking counter responses
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  card,
  onActionComplete,
  showCounterOption,
  onCounterClick,
  allCards = []
}) => {
  // Check if there's a counter response to this card
  const hasCounterResponse = allCards.some(
    otherCard => otherCard.response_to_card_id === card.id
  );

  // Render agreement cards with special component
  if (card.status === 'agreement') {
    return <AgreementCard card={card} />;
  }

  // Render regular proposal cards - ProposalCardNew has its own prop structure
  return (
    <ProposalCardNew
      proposal={card}
      isServiceProvider={false}
      onCounterClick={onCounterClick || (() => {})}
      onActionComplete={onActionComplete}
    />
  );
};
