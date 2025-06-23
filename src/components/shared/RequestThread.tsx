
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
  User,
  Handshake
} from 'lucide-react';
import { ServiceRequest, Proposal, ServiceProvider } from '@/types/modul8';
import { 
  getServiceRequestProposals,
  createCounterProposal,
  updateProposalStatus,
  updateServiceRequest
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
      await updateServiceRequest(serviceRequest.id, { 
        status: 'agreed',
        engagement_status: 'active' 
      });
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
      await updateServiceRequest(serviceRequest.id, { 
        status: 'declined',
        engagement_status: 'none' 
      });
      toast({
        title: "Request Rejected",
        description: "The entire request has been cancelled"
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
      
      await updateServiceRequest(serviceRequest.id, { 
        status: 'negotiating',
        engagement_status: 'negotiating' 
      });
      
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

  const canUserActOnProposal = (proposal: Proposal) => {
    if (!session?.user?.id) return false;
    if (proposal.from_user_id === session.user.id) return false;
    if (proposal.status !== 'pending') return false;
    return true;
  };

  const isActiveProject = serviceRequest.status === 'agreed' && proposals.some(p => p.status === 'accepted');

  return (
    <div className="space-y-6">
      {/* Request Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{serviceRequest.title}</h2>
        {serviceRequest.description && (
          <p className="text-muted-foreground">{serviceRequest.description}</p>
        )}
      </div>

      {/* Active Project Card - Shows when proposal is accepted */}
      {isActiveProject && (
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Handshake className="h-5 w-5" />
              Active Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-green-700 font-medium mb-4">
                Congratulations! The proposal has been accepted and this is now an active project.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://deel.com', '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Proceed with Deel
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-400 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    toast({
                      title: "Continuing Informally",
                      description: "You can continue working together without formal contracts"
                    });
                  }}
                >
                  Continue Without Deel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stacked Negotiation Cards */}
      <div className="space-y-4">
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
            {proposals.map((proposal, index) => {
              const isInitialRequest = index === 0;
              const roundNumber = index + 1;
              
              return (
                <Card 
                  key={proposal.id} 
                  className={`${isInitialRequest ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-purple-500'} relative`}
                >
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
                              {isInitialRequest ? 'Initial Request' : `Negotiation Round ${roundNumber}`}
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
                        
                        <div className="flex items-center gap-2">
                          {!isInitialRequest && (
                            <Badge variant="outline" className="text-xs">
                              Round {roundNumber}
                            </Badge>
                          )}
                          <Badge className={`${getStatusColor(proposal.status)} border font-medium`}>
                            {getStatusIcon(proposal.status)}
                            <span className="ml-1">
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </span>
                          </Badge>
                        </div>
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
                              Scope Document
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
                              Terms Document
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      )}

                      {canUserActOnProposal(proposal) && (
                        <>
                          <Separator className="my-4" />
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
                            {isInitialRequest && (
                              <Button
                                onClick={() => handleRejectProposal(proposal)}
                                disabled={loading}
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject & Cancel Request
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
