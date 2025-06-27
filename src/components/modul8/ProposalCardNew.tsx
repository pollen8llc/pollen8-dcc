
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProposalCard } from '@/types/proposalCards';
import { ProposalCardActions } from './ProposalCardActions';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Link as LinkIcon,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface ProposalCardNewProps {
  card: ProposalCard;
  hasCounterResponse?: boolean;
}

const ProposalCardNew: React.FC<ProposalCardNewProps> = ({ 
  card,
  hasCounterResponse = false 
}) => {
  const { session } = useSession();
  const [showCounter, setShowCounter] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'countered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = () => {
    switch (card.status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'countered':
        return 'Countered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const hasNegotiatedTerms = () => {
    return card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline;
  };

  const isOwnCard = () => {
    return session?.user?.id === card.submitted_by;
  };

  const getCardBorderColor = () => {
    switch (card.status) {
      case 'accepted':
        return 'border-green-200';
      case 'rejected':
        return 'border-red-200';
      case 'countered':
        return 'border-blue-200';
      case 'cancelled':
        return 'border-gray-200';
      default:
        return 'border-yellow-200';
    }
  };

  const handleActionComplete = () => {
    // Refresh or update the card state
    window.location.reload(); // Simple refresh for now
  };

  const handleCounterClick = () => {
    setShowCounter(true);
  };

  return (
    <Card className={`mb-4 ${getCardBorderColor()}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Card #{card.card_number}
              </Badge>
              <Badge className={getStatusColor(card.status)}>
                {getStatusText()}
              </Badge>
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(card.created_at).toLocaleDateString()}
            </div>
            {card.responded_at && (
              <div className="flex items-center gap-1 mt-1">
                <MessageSquare className="h-3 w-3" />
                Responded {new Date(card.responded_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Negotiated Terms Section */}
        {hasNegotiatedTerms() && (
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proposed Terms
            </h4>
            
            <div className="space-y-3">
              {card.negotiated_title && (
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase">Title</h5>
                  <p className="text-sm">{card.negotiated_title}</p>
                </div>
              )}
              
              {card.negotiated_description && (
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase">Description</h5>
                  <p className="text-sm">{card.negotiated_description}</p>
                </div>
              )}

              {card.negotiated_budget_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {card.negotiated_budget_range.min && card.negotiated_budget_range.max 
                      ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()} - ${card.negotiated_budget_range.max.toLocaleString()}`
                      : card.negotiated_budget_range.min 
                        ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()}+`
                        : `Budget in ${card.negotiated_budget_range.currency}`
                    }
                  </span>
                </div>
              )}

              {card.negotiated_timeline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{card.negotiated_timeline}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {card.notes && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
              {card.notes}
            </p>
          </div>
        )}

        {/* Asset Links */}
        {card.asset_links && card.asset_links.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Attachments
            </h4>
            <div className="flex flex-wrap gap-2">
              {card.asset_links.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(link, '_blank')}
                  className="text-xs"
                >
                  <LinkIcon className="h-3 w-3 mr-1" />
                  Attachment {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Scope and Terms Links */}
        {(card.scope_link || card.terms_link) && (
          <div className="flex gap-2">
            {card.scope_link && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(card.scope_link, '_blank')}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                View Scope
              </Button>
            )}
            {card.terms_link && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(card.terms_link, '_blank')}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                View Terms
              </Button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!isOwnCard() && (
          <div className="pt-2 border-t">
            <ProposalCardActions
              cardId={card.id}
              isLocked={card.is_locked}
              onActionComplete={handleActionComplete}
              showCounterOption={true}
              onCounterClick={handleCounterClick}
              hasCounterResponse={hasCounterResponse}
              submittedBy={card.submitted_by}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCardNew;
