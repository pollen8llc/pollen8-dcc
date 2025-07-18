
import React, { useState } from 'react';
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
  Loader2
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
  const [deelUrl, setDeelUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const currentUserId = session?.user?.id;

  const isOrganizer = organizerId ? currentUserId === organizerId : currentUserId !== card.submitted_by;

  // Initialize local state with existing URL from database
  React.useEffect(() => {
    if (card.deel_contract_url) {
      setSubmittedUrl(card.deel_contract_url);
    }
  }, [card.deel_contract_url]);

  // Set up real-time subscription for proposal card updates
  React.useEffect(() => {
    if (!card.id) return;

    console.log('🔔 Setting up real-time subscription for proposal card:', card.id);

    const channel = supabase
      .channel(`proposal-card-${card.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'modul8_proposal_cards',
          filter: `id=eq.${card.id}`
        },
        (payload) => {
          console.log('🔔 Real-time update received for proposal card:', payload);
          const updatedCard = payload.new as any;
          if (updatedCard.deel_contract_url) {
            setSubmittedUrl(updatedCard.deel_contract_url);
            console.log('🔗 Contract URL updated via real-time:', updatedCard.deel_contract_url);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔇 Cleaning up subscription for proposal card:', card.id);
      supabase.removeChannel(channel);
    };
  }, [card.id]);

  // Use the contract URL from state (which gets updated by real-time or initial load)
  const existingDeelUrl = submittedUrl || card.deel_contract_url;
  console.log('🔗 Contract URL:', existingDeelUrl);

  const handleGoToDeel = () => {
    window.open('https://app.deel.com', '_blank');
  };

  const handleViewDeel = () => {
    if (existingDeelUrl) {
      window.open(existingDeelUrl, '_blank');
    }
  };

  const handleSubmitDeelLink = async () => {
    if (!deelUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid agreement URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('💾 Submitting contract URL:', deelUrl, 'for card ID:', card.id);
      
      // Store the contract URL in the dedicated deel_contract_url field
      const { data, error } = await supabase
        .from('modul8_proposal_cards')
        .update({ deel_contract_url: deelUrl })
        .eq('id', card.id)
        .select('deel_contract_url'); // Return the updated data
        
      if (error) {
        console.error('❌ Error updating card:', error);
        throw error;
      }
      
      console.log('✅ Contract URL submitted successfully. Updated data:', data);
      
      toast({
        title: "Agreement Link Submitted",
        description: "The agreement link has been sent to the service provider",
        variant: "default"
      });
      
      // Set local state to immediately show VIEW CONTRACT button
      setSubmittedUrl(deelUrl);
      setDeelUrl('');
      
      // Call onActionComplete to refresh parent component if needed
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      console.error('❌ Error submitting contract link:', error);
      toast({
        title: "Error",
        description: "Failed to submit agreement link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-4 border-2 border-gray-700 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-600 text-gray-300">
                Card #{card.card_number}
              </Badge>
              <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
                Agreement Finalization
              </Badge>
            </div>
          </div>
          
          <div className="text-right text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(card.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-emerald-300">Agreement Reached!</h3>
          </div>
          <p className="text-sm text-emerald-200">
            Both parties have accepted the proposal. The next step is to create and execute the contract.
          </p>
        </div>

        {/* DEEL URL View Button - Show if URL exists */}
        {existingDeelUrl && (
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">Contract Ready</h4>
                <p className="text-sm text-blue-200">The contract is ready for review and signing.</p>
              </div>
              <Button
                onClick={handleViewDeel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                VIEW CONTRACT
              </Button>
            </div>
          </div>
        )}

        {/* Negotiated Terms Summary */}
        {(card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline) && (
          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2 text-gray-300">
              <User className="h-4 w-4" />
              Agreed Terms
            </h4>
            
            <div className="space-y-3">
              {card.negotiated_title && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Project Title</h5>
                  <p className="text-sm text-gray-200">{card.negotiated_title}</p>
                </div>
              )}
              
              {card.negotiated_description && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Description</h5>
                  <p className="text-sm text-gray-200">{card.negotiated_description}</p>
                </div>
              )}

              {card.negotiated_budget_range && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Budget</h5>
                  <p className="text-sm text-gray-200">
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
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Timeline</h5>
                  <p className="text-sm text-gray-200">{card.negotiated_timeline}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contract Integration Section - Only for Organizers */}
        {isOrganizer && !existingDeelUrl && (
          <div className="space-y-4 border-t border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-gray-200">Contract Execution</h4>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                Choose your preferred platform to create the agreement: Deel, DocuSign, or PandaDoc. Create the contract draft and finalize the service agreement using the selected platform.
              </div>

              <div className="space-y-2">
                <Label htmlFor="deel-url" className="text-sm font-medium text-gray-300">
                  Agreement URL
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="deel-url"
                      placeholder="https://example.com/contracts/..."
                      value={deelUrl}
                      onChange={(e) => setDeelUrl(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-gray-200 placeholder-gray-500"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitDeelLink}
                    disabled={submitting || !deelUrl.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {submitting ? 'Sending...' : 'Send to Provider'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Paste the contract URL to send it to the service provider for signing
                </p>
                
                {/* Submitted URL Badge */}
                {submittedUrl && (
                  <div className="mt-3 p-3 bg-blue-900/30 border border-blue-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 mb-2">
                          Contract Submitted
                        </Badge>
                        <p className="text-sm text-blue-200">Contract link has been sent to the service provider</p>
                      </div>
                      <Button
                        onClick={() => window.open(submittedUrl, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        VIEW CONTRACT
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Service Provider View */}
        {!isOrganizer && !existingDeelUrl && (
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-blue-300">Waiting for Contract</h4>
            </div>
            <p className="text-sm text-blue-200">
              The organizer is preparing the contract. You will receive the agreement link shortly to review and sign.
            </p>
          </div>
        )}

        {/* Service Provider View - CONTRACT button */}
        {!isOrganizer && existingDeelUrl && (
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">Contract Ready</h4>
                <p className="text-sm text-blue-200">The contract is ready for your review and signature.</p>
              </div>
              <Button
                onClick={handleViewDeel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                VIEW CONTRACT
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizationCard;
