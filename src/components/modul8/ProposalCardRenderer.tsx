
import React from 'react';
import { ProposalCardNew } from './ProposalCardNew';
import { AgreementCard } from './AgreementCard';
import { FinalizationCard } from './FinalizationCard';
import { ProposalCard } from '@/types/proposalCards';

interface ProposalCardRendererProps {
  card: ProposalCard;
  isServiceProvider: boolean;
  onResponse?: () => void;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({ 
  card, 
  isServiceProvider, 
  onResponse 
}) => {
  // Handle finalization card for organizers after agreement
  if (card.status === 'agreement' && !isServiceProvider) {
    return <FinalizationCard card={card} isOrganizer={true} />;
  }
  
  // Handle agreement view for service providers
  if (card.status === 'agreement' && isServiceProvider) {
    return <FinalizationCard card={card} isOrganizer={false} />;
  }
  
  // Handle legacy agreement cards
  if (card.status === 'agreement') {
    return <AgreementCard card={card} />;
  }

  // Handle all other proposal cards
  return (
    <ProposalCardNew 
      card={card} 
      isServiceProvider={isServiceProvider} 
      onResponse={onResponse}
    />
  );
};
