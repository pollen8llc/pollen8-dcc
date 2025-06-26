
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';

interface AgreementCardProps {
  card: ProposalCard;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({ card }) => {
  const handleDeelClick = () => {
    window.open('https://app.deel.com/login', '_blank');
  };

  return (
    <Card className="border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Star className="h-5 w-5 fill-current" />
            Agreement Reached
          </CardTitle>
          <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 font-bold px-3 py-1">
            DEAL CONFIRMED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
            🎉 Both parties have accepted the proposal!
          </p>
          <p className="text-sm text-muted-foreground">
            {card.notes}
          </p>
        </div>

        {/* Agreement Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          {card.negotiated_title && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Project Title</h4>
              <p className="text-sm">{card.negotiated_title}</p>
            </div>
          )}
          
          {card.negotiated_budget_range && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Budget</h4>
              <p className="text-sm font-semibold text-green-600">
                {card.negotiated_budget_range.min && card.negotiated_budget_range.max
                  ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()} - ${card.negotiated_budget_range.max.toLocaleString()}`
                  : card.negotiated_budget_range.min
                  ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()}`
                  : 'TBD'
                }
              </p>
            </div>
          )}
          
          {card.negotiated_timeline && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Timeline</h4>
              <p className="text-sm">{card.negotiated_timeline}</p>
            </div>
          )}
        </div>

        {/* DEEL Integration */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Ready to seal the deal? 
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your contract and get started with DEEL
            </p>
          </div>
          
          <div className="deel-integration-container w-full relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 p-[2px] animate-pulse">
              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg"></div>
            </div>
            <Button
              onClick={handleDeelClick}
              className="relative w-full bg-white hover:bg-gray-50 text-black font-bold text-xl py-8 border-0 rounded-lg z-10 shadow-lg"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">DEEL</span>
                <ExternalLink className="h-5 w-5" />
              </div>
            </Button>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground pt-4">
          Agreement created {new Date(card.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
