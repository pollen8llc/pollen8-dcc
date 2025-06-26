
import React from 'react';
import { ProposalCard } from '@/types/proposalCards';
import { AgreementCard } from './AgreementCard';
import ProposalCardNew from './ProposalCardNew';

interface ProposalCardRendererProps {
  card: ProposalCard;
  onActionComplete: () => void;
  serviceRequest?: any;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: (data: any) => void;
  onCancel?: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  card,
  onActionComplete,
  serviceRequest,
  onAccept,
  onReject,
  onCounter,
  onCancel,
  showCounterOption,
  onCounterClick
}) => {
  // Render agreement cards with special component
  if (card.status === 'agreement') {
    return <AgreementCard card={card} />;
  }

  // Render regular proposal cards with standardized actions
  return (
    <ProposalCardNew
      card={card}
      serviceRequest={serviceRequest}
      onAccept={onAccept}
      onReject={onReject}
      onCounter={onCounter}
      onCancel={onCancel}
    />
  );
};
