
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  MessageSquare, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard, getProposalCardResponses } from '@/services/proposalCardService';
import { ProposalCard, ProposalCardResponse } from '@/types/proposalCards';
import { useSession } from '@/hooks/useSession';

interface ProposalCardResponseActionsProps {
  card: ProposalCard;
  onResponse?: () => void;
}

export const ProposalCardResponseActions: React.FC<ProposalCardResponseActionsProps> = ({ 
  card, 
  onResponse 
}) => {
  const { session } = useSession();
  const [responseNotes, setResponseNotes] = useState('');
  const [responding, setResponding] = useState(false);
  const [userResponses, setUserResponses] = useState<ProposalCardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserResponses();
  }, [card.id, session?.user?.id]);

  const loadUserResponses = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const responses = await getProposalCardResponses(card.id);
      const currentUserResponses = responses.filter(r => r.responded_by === session.user.id);
      setUserResponses(currentUserResponses);
    } catch (error) {
      console.error('Error loading user responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (responseType: 'accept' | 'reject' | 'counter') => {
    if (!session?.user?.id) return;

    try {
      setResponding(true);
      
      await respondToProposalCard({
        card_id: card.id,
        response_type: responseType,
        response_notes: responseNotes || undefined
      });

      toast({
        title: "Response Submitted",
        description: `You have ${responseType}ed this proposal`,
      });

      setResponseNotes('');
      
      // Reload responses to update UI
      await loadUserResponses();
      
      if (onResponse) {
        onResponse();
      }
    } catch (error) {
      console.error(`Error ${responseType}ing proposal:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${responseType} proposal`,
        variant: "destructive"
      });
    } finally {
      setResponding(false);
    }
  };

  // Don't show actions if card is locked, agreement status, or user has already responded
  if (card.is_locked || card.status === 'agreement' || userResponses.length > 0 || loading) {
    if (userResponses.length > 0) {
      const userResponse = userResponses[0];
      return (
        <Card className="mt-4 border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {userResponse.response_type}ed
              </Badge>
              <span className="text-sm text-muted-foreground">
                You have already responded to this proposal
              </span>
            </div>
            {userResponse.response_notes && (
              <p className="text-sm text-muted-foreground mt-2">
                {userResponse.response_notes}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card className="mt-4 border-primary/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Your Response Required
          </div>

          <Textarea
            placeholder="Add notes to your response (optional)..."
            value={responseNotes}
            onChange={(e) => setResponseNotes(e.target.value)}
            className="min-h-20"
          />

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => handleResponse('accept')}
              disabled={responding}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              {responding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Accept
            </Button>
            
            <Button
              onClick={() => handleResponse('counter')}
              disabled={responding}
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50 flex-1"
            >
              {responding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
              Counter
            </Button>
            
            <Button
              onClick={() => handleResponse('reject')}
              disabled={responding}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
            >
              {responding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
