
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { AgreementCard } from './AgreementCard';
import { ProposalCardRenderer } from './ProposalCardRenderer';

interface ProposalTimelineProps {
  proposalCards: ProposalCard[];
  onActionComplete: () => void;
  onCounterClick: (cardId: string) => void;
}

export const ProposalTimeline: React.FC<ProposalTimelineProps> = ({
  proposalCards,
  onActionComplete,
  onCounterClick
}) => {
  return (
    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#00eada]" />
          Proposal Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposalCards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium">No proposals yet</p>
            <p className="text-sm">The proposal timeline will appear here as cards are created.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposalCards.map((card) => (
              <ProposalCardRenderer
                key={card.id}
                card={card}
                onActionComplete={onActionComplete}
                onCounterClick={() => onCounterClick(card.id)}
                allCards={proposalCards}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
