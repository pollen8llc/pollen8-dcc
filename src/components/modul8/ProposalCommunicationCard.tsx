
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, MessageSquare, Check, X, Reply } from 'lucide-react';
import { Proposal } from '@/types/modul8';

interface ProposalCommunicationCardProps {
  proposal: Proposal;
  isOrganizer: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onReply?: (message: string) => void;
  onUpdate?: () => void;
}

const ProposalCommunicationCard = ({ 
  proposal, 
  isOrganizer, 
  onAccept, 
  onDecline, 
  onReply,
  onUpdate 
}: ProposalCommunicationCardProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const handleReply = () => {
    if (replyMessage.trim() && onReply) {
      onReply(replyMessage);
      setReplyMessage('');
      setShowReplyForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Proposal Communication
          </CardTitle>
          <Badge className={`${getStatusColor(proposal.status)} border`}>
            {proposal.status?.charAt(0).toUpperCase() + proposal.status?.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proposal Details */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">Service Provider</div>
              <div className="text-xs text-muted-foreground">
                {new Date(proposal.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Quote: </span>
                <span className="text-sm">${proposal.quote_amount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Timeline: </span>
                <span className="text-sm">{proposal.timeline}</span>
              </div>
            </div>
            
            {proposal.scope_details && (
              <div>
                <span className="text-sm font-medium">Scope: </span>
                <p className="text-sm text-muted-foreground mt-1">{proposal.scope_details}</p>
              </div>
            )}
            
            {proposal.terms && (
              <div>
                <span className="text-sm font-medium">Terms: </span>
                <p className="text-sm text-muted-foreground mt-1">{proposal.terms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons for Organizer */}
        {isOrganizer && proposal.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              onClick={onAccept}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button 
              onClick={onDecline}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              variant="outline"
              className="flex-1"
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <Textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleReply} size="sm">
                Send Reply
              </Button>
              <Button 
                onClick={() => setShowReplyForm(false)} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {proposal.status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="text-green-800 text-sm font-medium">
              ✅ Proposal Accepted
            </div>
            <p className="text-green-700 text-sm mt-1">
              Ready to proceed to contract creation.
            </p>
          </div>
        )}

        {proposal.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="text-red-800 text-sm font-medium">
              ❌ Proposal Declined
            </div>
            <p className="text-red-700 text-sm mt-1">
              This proposal has been declined by the organizer.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCommunicationCard;
