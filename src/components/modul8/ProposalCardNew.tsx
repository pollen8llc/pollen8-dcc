import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  DollarSign, 
  Clock, 
  FileText, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { ProposalCardActions } from './ProposalCardActions';
import { useSession } from '@/hooks/useSession';

interface ProposalCardNewProps {
  card: ProposalCard;
  hasCounterResponse?: boolean;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
  isServiceProvider?: boolean; // Add context for LAB-R8
}

const ProposalCardNew: React.FC<ProposalCardNewProps> = ({
  card,
  hasCounterResponse = false,
  onActionComplete,
  showCounterOption = true,
  onCounterClick,
  isServiceProvider = false
}) => {
  const { session } = useSession();
  const currentUserId = session?.user?.id;

  // Determine if current user is the submitter
  const isSubmitter = currentUserId === card.submitted_by;

  // Determine if action buttons should be shown
  const shouldShowActions = () => {
    // In LAB-R8 context (service provider view)
    if (isServiceProvider) {
      // Service providers should see actions on organizer-submitted proposals
      return !isSubmitter;
    }
    
    // In Modul8 context (organizer view)
    // Organizers should see actions on service provider-submitted proposals
    return !isSubmitter;
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'countered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Card #{card.card_number}
              </Badge>
              <Badge className={getStatusColor(card.status)}>
                {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
              </Badge>
              {card.response_to_card_id && (
                <Badge variant="secondary" className="text-xs">
                  Counter Proposal
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(card.created_at).toLocaleDateString()}
            </div>
            {card.responded_at && (
              <div className="text-xs text-green-600 mt-1">
                Responded: {new Date(card.responded_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Negotiated Terms Section */}
        {(card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline) && (
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Proposal Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {card.negotiated_title && (
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase">Project Title</h5>
                  <p className="text-sm">{card.negotiated_title}</p>
                </div>
              )}
              
              {card.negotiated_budget_range && (
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Budget
                  </h5>
                  <p className="text-sm font-semibold">
                    {card.negotiated_budget_range.min && card.negotiated_budget_range.max 
                      ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()} - ${card.negotiated_budget_range.max.toLocaleString()}`
                      : card.negotiated_budget_range.min 
                        ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()}+`
                        : `Budget in ${card.negotiated_budget_range.currency}`
                    }
                  </p>
                </div>
              )}
              
              {card.negotiated_timeline && (
                <div className="md:col-span-2">
                  <h5 className="font-medium text-xs text-muted-foreground uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Timeline
                  </h5>
                  <p className="text-sm">{card.negotiated_timeline}</p>
                </div>
              )}
            </div>

            {card.negotiated_description && (
              <div>
                <h5 className="font-medium text-xs text-muted-foreground uppercase flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Description
                </h5>
                <p className="text-sm">{card.negotiated_description}</p>
              </div>
            )}
          </div>
        )}

        {/* Notes Section */}
        {card.notes && (
          <div className="bg-blue-50/50 p-3 rounded-md">
            <h5 className="font-medium text-xs text-muted-foreground uppercase mb-2 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Notes
            </h5>
            <p className="text-sm text-gray-700">{card.notes}</p>
          </div>
        )}

        {/* Links Section */}
        {(card.scope_link || card.terms_link || (card.asset_links && card.asset_links.length > 0)) && (
          <div className="space-y-2">
            <h5 className="font-medium text-xs text-muted-foreground uppercase">Attachments</h5>
            <div className="flex flex-wrap gap-2">
              {card.scope_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(card.scope_link, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Scope
                </Button>
              )}
              {card.terms_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(card.terms_link, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Terms
                </Button>
              )}
              {card.asset_links && card.asset_links.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(link, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Asset {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section - Show based on context and user role */}
        {shouldShowActions() && (
          <div className="pt-4 border-t">
            <ProposalCardActions
              cardId={card.id}
              isLocked={card.is_locked}
              onActionComplete={onActionComplete}
              showCounterOption={showCounterOption}
              onCounterClick={onCounterClick}
              hasCounterResponse={hasCounterResponse}
              submittedBy={card.submitted_by}
            />
          </div>
        )}

        {/* Submitter Status */}
        {isSubmitter && (
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              You submitted this proposal
              {card.is_locked && (
                <Badge variant="secondary" className="text-xs">
                  Finalized
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCardNew;
