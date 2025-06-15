
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User
} from 'lucide-react';
import { Proposal, ServiceProvider } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

interface ProposalCardProps {
  proposal: Proposal;
  serviceProvider?: ServiceProvider;
  onAccept: (proposalId: string) => Promise<void>;
  onDecline: (proposalId: string) => Promise<void>;
  onCounter: (proposalId: string) => void;
  isOrganizer: boolean;
  loading?: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  serviceProvider,
  onAccept,
  onDecline,
  onCounter,
  isOrganizer,
  loading = false
}) => {
  const [actionLoading, setActionLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'countered':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await onAccept(proposal.id);
      toast({
        title: "Proposal Accepted",
        description: "Service provider has been assigned to this project."
      });
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    setActionLoading(true);
    try {
      await onDecline(proposal.id);
      toast({
        title: "Proposal Declined",
        description: "The proposal has been declined."
      });
    } catch (error) {
      console.error('Error declining proposal:', error);
      toast({
        title: "Error",
        description: "Failed to decline proposal",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={serviceProvider?.logo_url} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {serviceProvider?.business_name || 'Service Provider'}
              </CardTitle>
              {serviceProvider?.tagline && (
                <p className="text-sm text-muted-foreground">{serviceProvider.tagline}</p>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(proposal.status)} variant="secondary">
            {proposal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {proposal.quote_amount && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">${proposal.quote_amount.toLocaleString()}</span>
            </div>
          )}
          
          {proposal.timeline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{proposal.timeline}</span>
            </div>
          )}
        </div>

        {proposal.scope_details && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Scope Details</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {proposal.scope_details}
            </p>
          </div>
        )}

        {proposal.terms && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Terms</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {proposal.terms}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Submitted on {new Date(proposal.created_at).toLocaleDateString()}
        </div>

        {isOrganizer && proposal.status === 'submitted' && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                onClick={handleAccept}
                disabled={actionLoading || loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {actionLoading ? 'Accepting...' : 'Accept'}
              </Button>
              
              <Button
                onClick={() => onCounter(proposal.id)}
                disabled={actionLoading || loading}
                variant="outline"
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Counter
              </Button>
              
              <Button
                onClick={handleDecline}
                disabled={actionLoading || loading}
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
