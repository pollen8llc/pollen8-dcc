
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User,
  MoreVertical,
  Trash2,
  ExternalLink,
  Calendar,
  Target
} from 'lucide-react';
import { Proposal, ServiceProvider } from '@/types/modul8';
import { acceptProposal, declineProposal, deleteProposal } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

interface ProposalCardProps {
  proposal: Proposal & {
    service_provider?: ServiceProvider;
  };
  serviceRequestId: string;
  onAccept: (proposalId: string) => Promise<void>;
  onDecline: (proposalId: string) => Promise<void>;
  onCounter: (proposalId: string) => void;
  onDelete?: (proposalId: string) => Promise<void>;
  isOrganizer: boolean;
  isServiceProvider?: boolean;
  loading?: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  serviceRequestId,
  onAccept,
  onDecline,
  onCounter,
  onDelete,
  isOrganizer,
  isServiceProvider = false,
  loading = false
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'countered':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await acceptProposal(proposal.id, serviceRequestId);
      await onAccept(proposal.id);
      toast({
        title: "Proposal Accepted! 🎉",
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
      await declineProposal(proposal.id);
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

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteProposal(proposal.id);
      if (onDelete) {
        await onDelete(proposal.id);
      }
      toast({
        title: "Proposal Deleted",
        description: "Your proposal has been deleted."
      });
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to delete proposal",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const extractLinks = (text: string) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
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
            {part.length > 40 ? `${part.substring(0, 40)}...` : part}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }
      return part;
    });
  };

  const canDelete = isServiceProvider && proposal.status === 'submitted';

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#00eada]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-[#00eada]/20">
                <AvatarImage src={proposal.service_provider?.logo_url} />
                <AvatarFallback className="bg-[#00eada]/10">
                  <User className="h-6 w-6 text-[#00eada]" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold">
                  {proposal.service_provider?.business_name || 'Service Provider'}
                </CardTitle>
                {proposal.service_provider?.tagline && (
                  <p className="text-sm text-muted-foreground mt-1">{proposal.service_provider.tagline}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(proposal.status)} font-medium px-3 py-1`} variant="outline">
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </Badge>
              {canDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Proposal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposal.quote_amount && (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quote Amount</p>
                  <p className="font-semibold text-lg text-green-700">${proposal.quote_amount.toLocaleString()}</p>
                </div>
              </div>
            )}
            
            {proposal.timeline && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-medium text-blue-700">{proposal.timeline}</p>
                </div>
              </div>
            )}
          </div>

          {/* Scope Details */}
          {proposal.scope_details && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#00eada]" />
                <h4 className="font-semibold text-foreground">Scope & Deliverables</h4>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {renderTextWithLinks(proposal.scope_details)}
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          {proposal.terms && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00eada]" />
                <h4 className="font-semibold text-foreground">Terms & Conditions</h4>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {renderTextWithLinks(proposal.terms)}
                </div>
              </div>
            </div>
          )}

          {/* Links Section */}
          {(extractLinks(proposal.scope_details || '') || extractLinks(proposal.terms || '')).length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-sm text-muted-foreground">Referenced Links:</h5>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...extractLinks(proposal.scope_details || ''), ...extractLinks(proposal.terms || '')])].map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#00eada]/10 text-[#00eada] rounded-md text-xs hover:bg-[#00eada]/20 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Link {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Clock className="h-3 w-3" />
            Submitted on {new Date(proposal.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Action Buttons */}
          {isOrganizer && proposal.status === 'submitted' && (
            <>
              <Separator />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  disabled={actionLoading || loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Accepting...' : 'Accept Proposal'}
                </Button>
                
                <Button
                  onClick={() => onCounter(proposal.id)}
                  disabled={actionLoading || loading}
                  variant="outline"
                  className="flex-1 border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10 shadow-sm hover:shadow-md transition-all"
                  size="lg"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Counter Offer
                </Button>
                
                <Button
                  onClick={handleDecline}
                  disabled={actionLoading || loading}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shadow-sm hover:shadow-md transition-all"
                  size="lg"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this proposal? This action cannot be undone and the organizer will no longer see your proposal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {actionLoading ? 'Deleting...' : 'Delete Proposal'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProposalCard;
