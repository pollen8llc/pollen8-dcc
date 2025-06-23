
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle,
  XCircle,
  MessageSquare,
  Building,
  ExternalLink,
  User
} from 'lucide-react';
import { ServiceRequest, Proposal, ServiceProvider } from '@/types/modul8';
import { 
  getServiceRequestProposals,
  createCounterProposal,
  updateProposalStatus
} from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

interface RequestThreadProps {
  serviceRequest: ServiceRequest;
  onUpdate: () => void;
  isServiceProvider?: boolean;
}

const RequestThread: React.FC<RequestThreadProps> = ({
  serviceRequest,
  onUpdate,
  isServiceProvider = false
}) => {
  const { session } = useSession();
  const [proposals, setProposals] = useState<(Proposal & { service_provider?: ServiceProvider })[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counteringProposal, setCounteringProposal] = useState<Proposal | null>(null);
  const [counterData, setCounterData] = useState({
    quote_amount: '',
    timeline: '',
    scope_url: '',
    terms_url: ''
  });

  useEffect(() => {
    loadProposals();
  }, [serviceRequest.id]);

  const loadProposals = async () => {
    try {
      const proposalsData = await getServiceRequestProposals(serviceRequest.id);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive"
      });
    }
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      await updateProposalStatus(proposal.id, 'accepted');
      toast({
        title: "Proposal Accepted",
        description: "The proposal has been accepted successfully"
      });
      onUpdate();
      loadProposals();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      await updateProposalStatus(proposal.id, 'rejected');
      toast({
        title: "Proposal Rejected",
        description: "The proposal has been rejected"
      });
      onUpdate();
      loadProposals();
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to reject proposal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCounterProposal = (proposal: Proposal) => {
    setCounteringProposal(proposal);
    setCounterData({
      quote_amount: proposal.quote_amount?.toString() || '',
      timeline: proposal.timeline || '',
      scope_url: proposal.scope_details || '',
      terms_url: proposal.terms || ''
    });
    setShowCounterForm(true);
  };

  const handleSubmitCounter = async () => {
    if (!session?.user?.id || !counteringProposal) return;
    
    setLoading(true);
    try {
      await createCounterProposal(
        counteringProposal,
        {
          quote_amount: counterData.quote_amount ? parseFloat(counterData.quote_amount) : undefined,
          timeline: counterData.timeline || undefined,
          scope_url: counterData.scope_url || undefined,
          terms_url: counterData.terms_url || undefined
        },
        session.user.id
      );
      
      toast({
        title: "Counter Proposal Submitted",
        description: "Your counter proposal has been submitted successfully"
      });
      
      setShowCounterForm(false);
      setCounteringProposal(null);
      setCounterData({ quote_amount: '', timeline: '', scope_url: '', terms_url: '' });
      onUpdate();
      loadProposals();
    } catch (error) {
      console.error('Error submitting counter proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit counter proposal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agreed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canUserActOnProposal = (proposal: Proposal) => {
    if (!session?.user?.id) return false;
    
    // Users can't act on their own proposals
    if (proposal.from_user_id === session.user.id) return false;
    
    // Can only act on pending proposals
    if (proposal.status !== 'pending') return false;
    
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Project Details Card */}
      <Card className="border-l-4 border-l-[#00eada]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00eada]" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{serviceRequest.title}</h3>
            {serviceRequest.description && (
              <p className="text-muted-foreground mt-2">{serviceRequest.description}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4">
            {serviceRequest.budget_range?.min && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">
                  ${serviceRequest.budget_range.min.toLocaleString()}
                  {serviceRequest.budget_range.max && 
                    ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                  }
                </span>
              </div>
            )}
            
            {serviceRequest.timeline && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 px-3 py-2 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">{serviceRequest.timeline}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Badge className={`${getRequestStatusColor(serviceRequest.status)} border font-medium`}>
                <span>
                  {serviceRequest.status.charAt(0).toUpperCase() + serviceRequest.status.slice(1).replace('_', ' ')}
                </span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                {serviceRequest.engagement_status.charAt(0).toUpperCase() + serviceRequest.engagement_status.slice(1)}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Created {new Date(serviceRequest.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Proposals & Negotiations</h3>
          <Badge variant="outline" className="text-xs">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {proposals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No proposals yet</h4>
              <p className="text-gray-500">Waiting for proposals to be submitted for this request</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, index) => (
              <Card key={proposal.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={proposal.service_provider?.logo_url} />
                          <AvatarFallback>
                            <Building className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {proposal.service_provider?.business_name || 'Service Provider'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {proposal.proposal_type.charAt(0).toUpperCase() + proposal.proposal_type.slice(1)} Proposal
                            {index > 0 && ` (Round ${index + 1})`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(proposal.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatusColor(proposal.status)} border font-medium`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1">
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {proposal.quote_amount && (
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-700">
                            ${proposal.quote_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {proposal.timeline && (
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 px-3 py-2 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">{proposal.timeline}</span>
                        </div>
                      )}
                    </div>

                    {(proposal.scope_details || proposal.terms) && (
                      <div className="flex gap-4">
                        {proposal.scope_details && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(proposal.scope_details, '_blank')}
                            className="text-[#00eada] border-[#00eada] hover:bg-[#00eada]/10"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Scope
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                        
                        {proposal.terms && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(proposal.terms, '_blank')}
                            className="text-purple-600 border-purple-600 hover:bg-purple-600/10"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Terms
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}

                    {canUserActOnProposal(proposal) && (
                      <Separator className="my-4" />
                    )}

                    {canUserActOnProposal(proposal) && (
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleAcceptProposal(proposal)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Proposal
                        </Button>
                        <Button
                          onClick={() => handleCounterProposal(proposal)}
                          disabled={loading}
                          variant="outline"
                          className="border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Counter Offer
                        </Button>
                        <Button
                          onClick={() => handleRejectProposal(proposal)}
                          disabled={loading}
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Counter Proposal Dialog */}
      <Dialog open={showCounterForm} onOpenChange={setShowCounterForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Counter Proposal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote_amount">Quote Amount ($)</Label>
                <Input
                  id="quote_amount"
                  type="number"
                  value={counterData.quote_amount}
                  onChange={(e) => setCounterData(prev => ({ ...prev, quote_amount: e.target.value }))}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={counterData.timeline}
                  onChange={(e) => setCounterData(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="e.g., 4-6 weeks"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="scope_url">Scope Document URL</Label>
              <Input
                id="scope_url"
                type="url"
                value={counterData.scope_url}
                onChange={(e) => setCounterData(prev => ({ ...prev, scope_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <Label htmlFor="terms_url">Terms Document URL</Label>
              <Input
                id="terms_url"
                type="url"
                value={counterData.terms_url}
                onChange={(e) => setCounterData(prev => ({ ...prev, terms_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCounterForm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitCounter}
                disabled={loading}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                {loading ? 'Submitting...' : 'Submit Counter Proposal'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestThread;
