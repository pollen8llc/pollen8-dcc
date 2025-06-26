
import React from 'react';
import { ProposalCard } from '@/types/proposalCards';
import { AgreementCard } from './AgreementCard';
import ProposalCardNew from './ProposalCardNew';

interface ProposalCardRendererProps {
  card: ProposalCard;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  card,
  onActionComplete,
  showCounterOption,
  onCounterClick
}) => {
  // Render agreement cards with special component
  if (card.status === 'agreement') {
    return <AgreementCard card={card} />;
  }

  // Render regular proposal cards
  return (
    <ProposalCardNew
      card={card}
      onActionComplete={onActionComplete}
      showCounterOption={showCounterOption}
      onCounterClick={onCounterClick}
    />
  );
};
