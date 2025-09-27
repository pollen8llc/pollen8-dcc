
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle,
  XCircle,
  MessageSquare,
  Building,
  ExternalLink
} from 'lucide-react';
import { Proposal, ServiceProvider } from '@/types/modul8';

interface ProposalCardProps {
  proposal: Proposal & { service_provider?: ServiceProvider };
  onAccept?: () => void;
  onDecline?: () => void;
  onCounter?: () => void;
  onUpdate?: () => void;
  isOrganizer?: boolean;
  className?: string;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onAccept,
  onDecline,
  onCounter,
  onUpdate,
  isOrganizer = false,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'countered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      case 'countered':
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#00eada] hover:text-[#00eada]/80 underline"
          >
            {part.length > 50 ? `${part.substring(0, 50)}...` : part}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <Card className={`${className} border-l-4 border-l-[#00eada]`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {proposal.service_provider && (
                <div className="bg-primary/10 rounded-full p-2 mr-3 group-hover:bg-primary/20 transition-colors">
                  <Avatar userId={proposal.service_provider?.user_id} size={32} />
                </div>
              )}
              <div>
                <div className="font-semibold">
                  {proposal.service_provider?.business_name || 'Service Provider'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(proposal.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            <Badge className={`${getStatusColor(proposal.status)} border font-medium`}>
              {getStatusIcon(proposal.status)}
              <span className="ml-1">
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </Badge>
          </div>

          {/* Proposal Details */}
          <div className="space-y-3">
            {/* Quote and Timeline */}
            <div className="flex flex-wrap gap-4">
              {proposal.quote_amount && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-700">
                    ${proposal.quote_amount.toLocaleString()}
                  </span>
                </div>
              )}
              
              {proposal.timeline && (
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">{proposal.timeline}</span>
                </div>
              )}
            </div>

            {/* Scope Details */}
            {proposal.scope_details && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#00eada]" />
                  <span className="font-medium text-sm">Scope & Approach</span>
                </div>
                <div className="bg-muted/20 p-3 rounded-lg text-sm leading-relaxed">
                  {renderTextWithLinks(proposal.scope_details)}
                </div>
              </div>
            )}

            {/* Terms */}
            {proposal.terms && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-sm">Terms & Conditions</span>
                </div>
                <div className="bg-muted/20 p-3 rounded-lg text-sm leading-relaxed">
                  {renderTextWithLinks(proposal.terms)}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {isOrganizer && proposal.status === 'pending' && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border/40">
              <Button
                onClick={onAccept}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Proposal
              </Button>
              <Button
                onClick={onCounter}
                variant="outline"
                className="border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Counter Offer
              </Button>
              <Button
                onClick={onDecline}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
