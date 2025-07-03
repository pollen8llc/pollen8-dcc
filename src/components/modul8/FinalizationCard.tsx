
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Check, Loader2 } from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { toast } from '@/hooks/use-toast';

interface FinalizationCardProps {
  card: ProposalCard;
  isOrganizer: boolean;
}

export const FinalizationCard: React.FC<FinalizationCardProps> = ({ card, isOrganizer }) => {
  const [deelUrl, setDeelUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDeelClick = () => {
    window.open('https://app.deel.com/login', '_blank');
  };

  const handleSubmitDeelUrl = async () => {
    if (!deelUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter the DEEL agreement URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Here you would typically call an API to save the DEEL URL
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      toast({
        title: "DEEL Agreement Submitted",
        description: "The agreement URL has been sent to the service provider",
      });
    } catch (error) {
      console.error('Error submitting DEEL URL:', error);
      toast({
        title: "Error",
        description: "Failed to submit DEEL agreement URL",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Check className="h-5 w-5 fill-current" />
            Agreement Finalization
          </CardTitle>
          <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 font-bold px-3 py-1">
            READY FOR CONTRACT
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

        {isOrganizer && !submitted ? (
          <div className="space-y-4">
            {/* DEEL Button */}
            <div 
              onClick={handleDeelClick}
              className="relative cursor-pointer group"
            >
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 transition-transform duration-200 group-hover:scale-[1.02] text-center">
                <h3 className="text-lg font-bold text-white mb-2">
                  Create Contract on DEEL
                </h3>
                <div className="inline-flex items-center gap-2 text-white">
                  <span>Go to DEEL</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* URL Submission */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  DEEL Agreement URL
                </label>
                <Input
                  placeholder="https://app.deel.com/contracts/..."
                  value={deelUrl}
                  onChange={(e) => setDeelUrl(e.target.value)}
                  className="bg-white"
                />
              </div>
              
              <Button
                onClick={handleSubmitDeelUrl}
                disabled={submitting || !deelUrl.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Submit DEEL Agreement to Service Provider
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : submitted ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-emerald-600 font-medium">
              <Check className="h-5 w-5" />
              DEEL Agreement URL Submitted Successfully
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              The service provider has been notified and can now access the contract.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Waiting for the organizer to create and submit the DEEL agreement.
            </p>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground pt-4">
          Agreement finalized {new Date(card.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
