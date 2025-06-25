
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProposalCard as ProposalCardType } from '@/types/proposalCards';
import { ProposalCardActions } from './ProposalCardActions';
import { ProposalCardStatus } from './ProposalCardStatus';
import { DeelIntegrationButton } from './DeelIntegrationButton';
import { AnimatedBorder } from './AnimatedBorder';
import { Badge } from '@/components/ui/badge';
import { User, Clock, ExternalLink } from 'lucide-react';

interface ProposalCardProps {
  card: ProposalCardType;
  onActionComplete: () => void;
  onCounterClick?: () => void;
  showCounterOption?: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  card,
  onActionComplete,
  onCounterClick,
  showCounterOption = true
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const CardWrapper = card.status === 'final_confirmation' 
    ? ({ children }: { children: React.ReactNode }) => (
        <AnimatedBorder>
          {children}
        </AnimatedBorder>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <CardWrapper>
      <Card className={`mb-4 ${card.status === 'final_confirmation' ? 'bg-gradient-to-br from-emerald-500/5 to-green-500/5' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Card #{card.card_number}
              </Badge>
              <ProposalCardStatus
                cardId={card.id}
                cardStatus={card.status}
                submittedBy={card.submitted_by}
                isLocked={card.is_locked}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(card.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Negotiated Details */}
          {(card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Proposal Details</h4>
              
              {card.negotiated_title && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Title:</span>
                  <p className="text-sm">{card.negotiated_title}</p>
                </div>
              )}
              
              {card.negotiated_description && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Description:</span>
                  <p className="text-sm">{card.negotiated_description}</p>
                </div>
              )}
              
              {card.negotiated_budget_range && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Budget:</span>
                  <p className="text-sm font-semibold text-green-600">
                    {card.negotiated_budget_range.min && card.negotiated_budget_range.max
                      ? `${formatCurrency(card.negotiated_budget_range.min, card.negotiated_budget_range.currency)} - ${formatCurrency(card.negotiated_budget_range.max, card.negotiated_budget_range.currency)}`
                      : card.negotiated_budget_range.min
                      ? `From ${formatCurrency(card.negotiated_budget_range.min, card.negotiated_budget_range.currency)}`
                      : card.negotiated_budget_range.max
                      ? `Up to ${formatCurrency(card.negotiated_budget_range.max, card.negotiated_budget_range.currency)}`
                      : 'Budget TBD'}
                  </p>
                </div>
              )}
              
              {card.negotiated_timeline && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Timeline:</span>
                  <p className="text-sm">{card.negotiated_timeline}</p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {card.notes && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Notes:</span>
              <p className="text-sm mt-1">{card.notes}</p>
            </div>
          )}

          {/* External Links */}
          {(card.scope_link || card.terms_link) && (
            <div className="space-y-2">
              {card.scope_link && (
                <a
                  href={card.scope_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Scope Document
                </a>
              )}
              {card.terms_link && (
                <a
                  href={card.terms_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Terms Document
                </a>
              )}
            </div>
          )}

          {/* DEEL Integration for Final Confirmation */}
          {card.status === 'final_confirmation' && (
            <DeelIntegrationButton
              projectTitle={card.negotiated_title}
              projectDescription={card.negotiated_description}
              budgetRange={card.negotiated_budget_range}
              timeline={card.negotiated_timeline}
            />
          )}

          {/* Actions */}
          {card.status !== 'final_confirmation' && (
            <ProposalCardActions
              cardId={card.id}
              isLocked={card.is_locked}
              onActionComplete={onActionComplete}
              showCounterOption={showCounterOption}
              onCounterClick={onCounterClick}
            />
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
