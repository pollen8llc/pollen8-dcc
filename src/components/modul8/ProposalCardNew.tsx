
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building, 
  FileText, 
  DollarSign, 
  Calendar, 
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { ProposalCardActions } from './ProposalCardActions';
import { useSession } from '@/hooks/useSession';
import { formatDistanceToNow } from 'date-fns';

interface ProposalCardNewProps {
  proposal: ProposalCard;
  isServiceProvider: boolean;
  onCounterClick: () => void;
  onActionComplete: () => void;
}

const ProposalCardNew: React.FC<ProposalCardNewProps> = ({
  proposal,
  isServiceProvider,
  onCounterClick,
  onActionComplete
}) => {
  const { session } = useSession();
  const currentUserId = session?.user?.id;

  const getCardIcon = () => {
    switch (proposal.status) {
      case 'agreement':
        return <Sparkles className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'countered':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (proposal.status) {
      case 'agreement':
        return 'bg-gradient-to-r from-yellow-100 to-green-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'countered':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCardTitle = () => {
    if (proposal.status === 'agreement') {
      return `🎉 AGREEMENT REACHED - Card #${proposal.card_number}`;
    }
    return `Proposal Card #${proposal.card_number}`;
  };

  const isOwnProposal = proposal.submitted_by === currentUserId;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      proposal.status === 'agreement' ? 'ring-2 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-green-50' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getCardIcon()}
            <div>
              <CardTitle className="text-lg">{getCardTitle()}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor()} border font-medium`}>
                  {proposal.status === 'agreement' ? 'AGREEMENT' : proposal.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {isOwnProposal ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Building className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {isOwnProposal ? 'You' : (isServiceProvider ? 'Client' : 'Service Provider')}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Negotiated Title */}
        {proposal.negotiated_title && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Project Title</h4>
            <p className="font-medium">{proposal.negotiated_title}</p>
          </div>
        )}

        {/* Negotiated Description */}
        {proposal.negotiated_description && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Project Description</h4>
            <p className="text-sm leading-relaxed">{proposal.negotiated_description}</p>
          </div>
        )}

        {/* Budget Range */}
        {proposal.negotiated_budget_range && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Budget:</span>
            <span className="font-medium">
              {proposal.negotiated_budget_range.min && proposal.negotiated_budget_range.max
                ? `${proposal.negotiated_budget_range.currency} ${proposal.negotiated_budget_range.min} - ${proposal.negotiated_budget_range.max}`
                : proposal.negotiated_budget_range.min
                ? `${proposal.negotiated_budget_range.currency} ${proposal.negotiated_budget_range.min}+`
                : `${proposal.negotiated_budget_range.currency} TBD`
              }
            </span>
          </div>
        )}

        {/* Timeline */}
        {proposal.negotiated_timeline && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Timeline:</span>
            <span className="font-medium">{proposal.negotiated_timeline}</span>
          </div>
        )}

        {/* Links */}
        {(proposal.scope_link || proposal.terms_link || (proposal.asset_links && proposal.asset_links.length > 0)) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Attachments & Links</h4>
              <div className="space-y-1">
                {proposal.scope_link && (
                  <a
                    href={proposal.scope_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Scope Document
                  </a>
                )}
                {proposal.terms_link && (
                  <a
                    href={proposal.terms_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Terms Document
                  </a>
                )}
                {proposal.asset_links && proposal.asset_links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Asset Link {index + 1}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        {proposal.notes && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Notes</h4>
              <p className="text-sm leading-relaxed">{proposal.notes}</p>
            </div>
          </>
        )}

        {/* Agreement Message */}
        {proposal.status === 'agreement' && (
          <>
            <Separator />
            <div className="bg-gradient-to-r from-yellow-100 to-green-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Agreement Reached!</span>
              </div>
              <p className="text-sm text-yellow-700">
                Both parties have accepted this proposal. Ready to proceed with contract execution via DEEL.
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        {proposal.status !== 'agreement' && (
          <>
            <Separator />
            <ProposalCardActions
              cardId={proposal.id}
              isLocked={proposal.is_locked}
              onActionComplete={onActionComplete}
              onCounterClick={onCounterClick}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCardNew;
