
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, Star } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useProposalCardResponses } from '@/hooks/useProposalCardResponses';

interface ProposalCardStatusProps {
  cardId: string;
  cardStatus: 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled' | 'final_confirmation' | 'agreement';
  submittedBy: string;
  isLocked: boolean;
}

export const ProposalCardStatus: React.FC<ProposalCardStatusProps> = ({
  cardId,
  cardStatus,
  submittedBy,
  isLocked
}) => {
  const { session } = useSession();
  const { acceptResponses, hasAnyAcceptance, hasCurrentUserResponded, loading } = useProposalCardResponses(cardId);

  if (loading) {
    return <Badge variant="outline" className="animate-pulse">Loading...</Badge>;
  }

  // Agreement card status
  if (cardStatus === 'agreement') {
    return (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold px-3 py-1 flex items-center gap-1">
        <Star className="h-4 w-4 fill-current" />
        AGREEMENT REACHED
      </Badge>
    );
  }

  // Show acceptance status for accepted cards
  if (cardStatus === 'accepted' && hasAnyAcceptance) {
    const currentUserAccepted = acceptResponses.some(r => r.responded_by === session?.user?.id);
    
    if (currentUserAccepted) {
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-semibold px-3 py-1 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            YOU ACCEPTED
          </Badge>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-semibold px-3 py-1 flex items-center gap-1 animate-pulse">
            <Clock className="h-4 w-4" />
            AWAITING RESPONSE
          </Badge>
        </div>
      );
    } else {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold px-3 py-1 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          THEY ACCEPTED
        </Badge>
      );
    }
  }

  // Default status badges
  const getStatusBadge = () => {
    switch (cardStatus) {
      case 'pending':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold px-3 py-1 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            PENDING
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-bold px-3 py-1">
            REJECTED
          </Badge>
        );
      case 'countered':
        return (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-bold px-3 py-1">
            COUNTERED
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 font-bold px-3 py-1">
            CANCELLED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold px-3 py-1">
            {cardStatus.toUpperCase()}
          </Badge>
        );
    }
  };

  return getStatusBadge();
};
