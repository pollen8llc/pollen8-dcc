
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import ProposalCard from './ProposalCard';

interface ProposalSectionProps {
  proposals: any[];
  loading: boolean;
  isServiceProvider: boolean;
  onAcceptProposal: (proposal: any) => void;
  onDeclineProposal: (proposal: any) => void;
  onCounterOffer: (proposal: any) => void;
  onProposalUpdate: () => void;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  proposals,
  loading,
  isServiceProvider,
  onAcceptProposal,
  onDeclineProposal,
  onCounterOffer,
  onProposalUpdate
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading proposals...</div>;
  }

  if (proposals.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No proposals found for this request.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onAccept={() => onAcceptProposal(proposal)}
          onDecline={() => onDeclineProposal(proposal)}
          onCounter={() => onCounterOffer(proposal)}
          onUpdate={onProposalUpdate}
          isOrganizer={!isServiceProvider}
        />
      ))}
    </div>
  );
};
