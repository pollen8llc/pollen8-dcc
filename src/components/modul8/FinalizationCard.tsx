
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ProposalCard } from '@/types/proposalCards';
import { 
  ExternalLink, 
  Link as LinkIcon,
  CheckCircle,
  Calendar,
  User,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FinalizationCardProps {
  card: ProposalCard;
  organizerId?: string;
  onActionComplete?: () => void;
}

const FinalizationCard: React.FC<FinalizationCardProps> = ({ card, organizerId, onActionComplete }) => {
  const { session } = useSession();
  const [deelUrl, setDeelUrl] = useState(card.deel_contract_url || '');
  const [submitting, setSubmitting] = useState(false);
  const [deelHistory, setDeelHistory] = useState<Array<{ url: string; timestamp: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const currentUserId = session?.user?.id;

  const isOrganizer = organizerId ? currentUserId === organizerId : currentUserId !== card.submitted_by;

  // Load DEEL links history for this service request
  useEffect(() => {
    const loadDeelHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('modul8_proposal_cards')
          .select('deel_contract_url, updated_at')
          .eq('request_id', card.request_id)
          .not('deel_contract_url', 'is', null)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const history = data
          .filter(item => item.deel_contract_url)
          .map(item => ({
            url: item.deel_contract_url!,
            timestamp: item.updated_at
          }));

        setDeelHistory(history);
      } catch (error) {
        console.error('Error loading DEEL history:', error);
      }
    };

    loadDeelHistory();
  }, [card.request_id]);

  const handleGoToDeel = () => {
    window.open('https://app.deel.com', '_blank');
  };

  const handleSubmitDeelLink = async () => {
    if (!deelUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid DEEL agreement URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      // Persist the DEEL URL to the proposal card
      const { error } = await supabase
        .from('modul8_proposal_cards')
        .update({ deel_contract_url: deelUrl })
        .eq('id', card.id);
      if (error) throw error;
      
      toast({
        title: "DEEL Link Submitted",
        description: "The agreement link has been sent to the service provider",
        variant: "default"
      });
      
      // Refresh the history
      setDeelHistory(prev => [{ url: deelUrl, timestamp: new Date().toISOString() }, ...prev]);
      
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error('Error submitting DEEL link:', error);
      toast({
        title: "Error",
        description: "Failed to submit DEEL link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-card-foreground shadow-lg hover:shadow-[#00eada]/10 transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Card #{card.card_number}
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Agreement Finalization
              </Badge>
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(card.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        <div className="bg-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Agreement Reached!</h3>
          </div>
          <p className="text-sm text-green-700">
            Both parties have accepted the proposal. The next step is to create and execute the contract via DEEL.
          </p>
        </div>

        {/* Negotiated Terms Summary */}
        {(card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline) && (
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Agreed Terms
            </h4>
            
            <div className="space-y-3">
              {card.negotiated_title && (
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase">Project Title</h5>
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
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase">Budget</h5>
                  <p className="text-sm">
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
                <div>
                  <h5 className="font-medium text-xs text-muted-foreground uppercase">Timeline</h5>
                  <p className="text-sm">{card.negotiated_timeline}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEEL Integration Section - Only for Organizers */}
        {isOrganizer && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold">Contract Execution via DEEL</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleGoToDeel}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to DEEL
                </Button>
                <div className="text-sm text-muted-foreground self-center">
                  Create the contract agreement on DEEL platform
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deel-url" className="text-sm font-medium">
                  DEEL Agreement URL
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deel-url"
                      placeholder="https://app.deel.com/contracts/..."
                      value={deelUrl}
                      onChange={(e) => setDeelUrl(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitDeelLink}
                    disabled={submitting || !deelUrl.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {submitting ? 'Sending...' : 'Send to Provider'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste the DEEL contract URL to send it to the service provider for signing
                </p>
              </div>

              {/* DEEL Links History */}
              {deelHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Contract History ({deelHistory.length})
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="h-6 px-2"
                    >
                      {showHistory ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {showHistory && (
                    <div className="space-y-2 bg-muted/20 p-3 rounded-md max-h-32 overflow-y-auto">
                      {deelHistory.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline truncate flex-1 mr-2"
                          >
                            Contract Link #{index + 1}
                          </a>
                          <span className="text-muted-foreground text-xs">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service Provider View */}
        {!isOrganizer && (
          <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Waiting for Contract</h4>
            </div>
            {card.deel_contract_url ? (
              <Button
                onClick={() => window.open(card.deel_contract_url, '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white mt-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View DEEL Contract
              </Button>
            ) : (
              <p className="text-sm text-blue-700">
                The organizer is preparing the DEEL contract. You will receive the agreement link shortly to review and sign.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizationCard;
