
import React from 'react';
import { ProposalCard } from '@/types/proposalCards';
import ProposalCardNew from './ProposalCardNew';
import { AgreementCard } from './AgreementCard';
import { DeelIntegrationButton } from './DeelIntegrationButton';
import { useSession } from '@/hooks/useSession';

interface ProposalCardRendererProps {
  card: ProposalCard;
  onActionComplete: () => void;
  onCounterClick: () => void;
  allCards: ProposalCard[];
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  card,
  onActionComplete,
  onCounterClick,
  allCards
}) => {
  const { session } = useSession();

  // Check if this is the final agreement card
  if (card.status === 'agreement') {
    const isOrganizer = !card.submitted_by || card.submitted_by !== session?.user?.id;

    const handleAgreementSubmit = async (agreementUrl: string) => {
      // TODO: Implement the logic to update the request with the agreement URL
      // and lock the entire request
      console.log('Agreement URL submitted:', agreementUrl);
      onActionComplete();
    };

    return (
      <>
        <AgreementCard card={card} />
        <DeelIntegrationButton
          projectTitle={card.negotiated_title}
          projectDescription={card.negotiated_description}
          budgetRange={card.negotiated_budget_range}
          timeline={card.negotiated_timeline}
          organizerName="Organizer" // TODO: Get actual organizer name
          serviceProviderName="Service Provider" // TODO: Get actual service provider name
          isOrganizer={isOrganizer}
          agreementUrl={card.agreement_url}
          onAgreementSubmit={handleAgreementSubmit}
        />
      </>
    );
  }

  return (
    <ProposalCardNew
      card={card}
      onActionComplete={onActionComplete}
      onCounterClick={onCounterClick}
      allCards={allCards}
    />
  );
};
