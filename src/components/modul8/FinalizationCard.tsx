
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

interface FinalizationCardProps {
  card: ProposalCard;
}

const FinalizationCard: React.FC<FinalizationCardProps> = ({ card }) => {
  const { session } = useSession();
  const [deelUrl, setDeelUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const currentUserId = session?.user?.id;

  const isOrganizer = currentUserId !== card.submitted_by; // Assuming organizer didn't submit the final card

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
      
      // Here you would typically make an API call to update the proposal card with the DEEL URL
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "DEEL Link Submitted",
        description: "The agreement link has been sent to the service provider",
        variant: "default"
      });
      
      setDeelUrl('');
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
    <Card className="mb-4 border-green-200 bg-green-50/50">
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
            </div>
          </div>
        )}

        {/* Service Provider View */}
        {!isOrganizer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Waiting for Contract</h4>
            </div>
            <p className="text-sm text-blue-700">
              The organizer is preparing the DEEL contract. You will receive the agreement link shortly to review and sign.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizationCard;
