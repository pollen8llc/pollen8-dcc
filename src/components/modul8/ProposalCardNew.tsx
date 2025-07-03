
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Link as LinkIcon, 
  Calendar,
  DollarSign,
  User,
  Building
} from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { ProposalCardResponseActions } from './ProposalCardResponseActions';

interface ProposalCardNewProps {
  card: ProposalCard;
  isServiceProvider: boolean;
  onResponse?: () => void;
}

export const ProposalCardNew: React.FC<ProposalCardNewProps> = ({ 
  card, 
  isServiceProvider, 
  onResponse 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'countered':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'agreement':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return null;
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return null;
  };

  return (
    <Card className="w-full border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">#{card.card_number}</span>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {isServiceProvider ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <Badge className={`${getStatusColor(card.status)} border font-medium px-3 py-1`}>
            {card.status.toUpperCase()}
          </Badge>
        </div>

        {card.negotiated_title && (
          <CardTitle className="text-xl font-bold text-foreground mt-3">
            {card.negotiated_title}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Negotiated Details Grid */}
        {(card.negotiated_budget_range || card.negotiated_timeline || card.negotiated_description) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            {card.negotiated_budget_range && formatBudget(card.negotiated_budget_range) && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Budget</p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatBudget(card.negotiated_budget_range)}
                  </p>
                </div>
              </div>
            )}

            {card.negotiated_timeline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Timeline</p>
                  <p className="text-sm font-semibold">{card.negotiated_timeline}</p>
                </div>
              </div>
            )}

            {card.negotiated_description && (
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground font-medium mb-1">Description</p>
                <p className="text-sm">{card.negotiated_description}</p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {card.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Notes</span>
            </div>
            <p className="text-sm text-foreground bg-muted/20 p-3 rounded-md">
              {card.notes}
            </p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {card.scope_link && (
            <a
              href={card.scope_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-colors"
            >
              <LinkIcon className="h-3 w-3" />
              Scope Document
            </a>
          )}
          {card.terms_link && (
            <a
              href={card.terms_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-colors"
            >
              <LinkIcon className="h-3 w-3" />
              Terms Document
            </a>
          )}
        </div>

        {/* Asset Links */}
        {card.asset_links && card.asset_links.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Attachments</span>
            <div className="flex flex-wrap gap-2">
              {card.asset_links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/60 px-3 py-1 rounded-full transition-colors"
                >
                  <LinkIcon className="h-3 w-3" />
                  Asset {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Response Actions */}
        <ProposalCardResponseActions card={card} onResponse={onResponse} />

        {/* Timestamps */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border">
          <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
          {card.responded_at && (
            <span>Responded {new Date(card.responded_at).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
