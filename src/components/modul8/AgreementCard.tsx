import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { useSession } from 'next-auth/react';
import FinalizationCard from './FinalizationCard';

interface AgreementCardProps {
  card: ProposalCard;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({ card }) => {
  const { session } = useSession();
  const isOrganizer = session?.user?.id === card.organizer_id; // Adjust as needed for your data model

  if (isOrganizer) {
    return <FinalizationCard card={card} />;
  }

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
          
          {card.notes && (
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Details</h4>
              <p className="text-sm">{card.notes}</p>
            </div>
          )}
        </div>

        {/* Clickable CTA with Admin Profile Border */}
        <div 
          onClick={handleDeelClick}
          className="relative cursor-pointer group admin-profile-border"
        >
          {/* Main Content */}
          <div className="relative bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg p-6 transition-transform duration-200 group-hover:scale-[1.02] text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              🎉 Create Your Contract Now!
            </h3>
            <p className="text-emerald-100 mb-4 text-lg">
              Click here to finalize with DEEL
            </p>
            
            <div className="inline-flex items-center gap-2 text-2xl font-bold text-white">
              <span>DEEL</span>
              <ExternalLink className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground pt-4">
          Agreement created {new Date(card.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
