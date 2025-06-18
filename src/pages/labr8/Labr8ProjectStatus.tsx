
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { getServiceRequests, getUserServiceProvider, createProposal } from "@/services/modul8Service";
import { getProposalsByRequestId } from "@/services/proposalService";
import { createServiceRequestComment, updateServiceRequestStatus } from "@/services/commentService";
import { ServiceRequest, ServiceProvider } from "@/types/modul8";
import { Proposal } from "@/services/proposalService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import { 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  User,
  Building,
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Send,
  Link,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Labr8ProjectStatus = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { session } = useSession();
  const navigate = useNavigate();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms_url: '',
    proposal_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) {
      navigate('/labr8/auth');
      return;
    }
    
    setLoading(true);
    try {
      const [requests, provider] = await Promise.all([
        getServiceRequests(),
        getUserServiceProvider(session.user.id)
      ]);
      
      const req = requests.find(r => r.id === requestId);
      if (!req) {
        toast({ 
          title: "Request Not Found", 
          description: "The service request could not be found", 
          variant: "destructive" 
        });
        navigate('/labr8/dashboard');
        return;
      }
      
      setServiceRequest(req);
      setServiceProvider(provider ?? null);
      
      await loadProposals(req.id);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load request details", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProposals = async (serviceRequestId: string) => {
    setProposalsLoading(true);
    setProposalError(null);
    try {
      const proposalsList = await getProposalsByRequestId(serviceRequestId);
      setProposals(proposalsList);
    } catch (error) {
      console.error('Error loading proposals:', error);
      setProposalError('Failed to load proposals');
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive"
      });
    } finally {
      setProposalsLoading(false);
    }
  };

  const validateProposalData = () => {
    if (!proposalData.quote_amount || isNaN(parseFloat(proposalData.quote_amount))) {
      return "Please enter a valid quote amount";
    }
    if (!proposalData.timeline.trim()) {
      return "Please provide an estimated timeline";
    }
    if (!proposalData.scope_details.trim()) {
      return "Please describe your approach and scope";
    }
    if (proposalData.terms_url && !isValidUrl(proposalData.terms_url)) {
      return "Please enter a valid URL for terms and conditions";
    }
    if (proposalData.proposal_url && !isValidUrl(proposalData.proposal_url)) {
      return "Please enter a valid URL for proposal document";
    }
    return null;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleStatusUpdate = async (
    status: ServiceRequest['status'],
    reason: string
  ) => {
    if (!serviceRequest || !session?.user?.id) return;
    setSubmitting(true);
    try {
      await updateServiceRequestStatus(
        serviceRequest.id,
        status,
        session.user.id,
        serviceRequest.status,
        reason
      );
      toast({ 
        title: "Status Updated", 
        description: `Request status changed to ${status.replace('_', ' ')}` 
      });
      setServiceRequest(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update status", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceRequest || !session?.user?.id) return;
    
    const validationError = validateProposalData();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await createProposal({
        service_request_id: serviceRequest.id,
        from_user_id: session.user.id,
        proposal_type: 'initial',
        quote_amount: parseFloat(proposalData.quote_amount),
        timeline: proposalData.timeline,
        scope_details: proposalData.scope_details,
        terms: proposalData.terms_url || undefined
      });
      
      await handleStatusUpdate('negotiating', 'Provider submitted proposal');
      
      toast({ 
        title: "Proposal Submitted!", 
        description: "Your proposal has been sent to the organizer for review." 
      });
      
      setShowProposalForm(false);
      setProposalData({ 
        quote_amount: '', 
        timeline: '', 
        scope_details: '', 
        terms_url: '',
        proposal_url: '' 
      });

      await loadProposals(serviceRequest.id);
      
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({ 
        title: "Error", 
        description: "Failed to submit proposal", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!serviceRequest || !session?.user?.id || !newComment.trim()) return;
    setSubmitting(true);
    try {
      await createServiceRequestComment({
        service_request_id: serviceRequest.id,
        user_id: session.user.id,
        comment_type: 'general',
        content: newComment.trim()
      });
      if (serviceRequest.status === 'pending') {
        await handleStatusUpdate('negotiating', 'Provider responded');
      }
      toast({ title: "Comment Added", description: "Discussion started" });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: "Error", description: "Failed to send comment", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async () => await handleStatusUpdate('agreed', 'Provider accepted the request');
  const handleDecline = async () => await handleStatusUpdate('declined', 'Provider declined the request');

  const isProvider = session?.user?.id && serviceProvider?.user_id === session.user.id;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'negotiating':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'agreed':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#00eada]" />
            <p className="text-muted-foreground">Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-semibold">Request Not Found</h2>
            <p className="text-muted-foreground">The service request could not be found or may have been removed.</p>
            <Button onClick={() => navigate('/labr8/dashboard')} className="bg-[#00eada] hover:bg-[#00eada]/90 text-black">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="sm"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/labr8/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        
        {/* Request Header */}
        <Card className="mb-8 card-hover-effect">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <CardTitle className="text-2xl">{serviceRequest.title}</CardTitle>
                  <Badge className={`${getStatusColor(serviceRequest.status)} font-medium`} variant="outline">
                    {serviceRequest.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{serviceRequest.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceRequest.budget_range?.min && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Budget: ${serviceRequest.budget_range.min?.toLocaleString()}
                        {serviceRequest.budget_range.max && 
                          ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}
                  
                  {serviceRequest.timeline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{serviceRequest.timeline}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {serviceRequest.organizer && (
                <Card className="w-full lg:w-auto lg:min-w-[280px]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={serviceRequest.organizer.logo_url} />
                        <AvatarFallback>
                          <Building className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{serviceRequest.organizer.organization_name}</h3>
                        <p className="text-sm text-muted-foreground">Client Organization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Created {new Date(serviceRequest.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* Provider Actions - Only show to providers */}
        {isProvider && ["pending", "negotiating"].includes(serviceRequest.status) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Respond to Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  onClick={() => setShowProposalForm(!showProposalForm)}
                  className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  disabled={submitting}
                >
                  <FileText className="h-4 w-4" />
                  {showProposalForm ? 'Hide Proposal Form' : 'Submit Proposal'}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" disabled={submitting}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Accept Request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will change status to agreed and notify the organizer that you accept their request.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAccept} disabled={submitting}>
                        {submitting ? "Accepting..." : "Accept Request"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" disabled={submitting}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Decline Request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to decline this request? The organizer will be notified and this action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDecline} disabled={submitting}>
                        {submitting ? "Declining..." : "Decline Request"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Proposal Form */}
              {showProposalForm && (
                <Card className="border-2 border-[#00eada]/20 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Submit Your Proposal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitProposal} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quote_amount" className="required">Quote Amount ($)</Label>
                          <Input
                            id="quote_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={proposalData.quote_amount}
                            onChange={(e) => setProposalData(prev => ({ ...prev, quote_amount: e.target.value }))}
                            placeholder="5000.00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline" className="required">Estimated Timeline</Label>
                          <Input
                            id="timeline"
                            value={proposalData.timeline}
                            onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                            placeholder="2-3 weeks"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scope_details" className="required">Scope & Approach</Label>
                        <Textarea
                          id="scope_details"
                          value={proposalData.scope_details}
                          onChange={(e) => setProposalData(prev => ({ ...prev, scope_details: e.target.value }))}
                          placeholder="Describe your approach, deliverables, and what you will provide..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proposal_url" className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Proposal Document URL (Optional)
                        </Label>
                        <Input
                          id="proposal_url"
                          type="url"
                          value={proposalData.proposal_url}
                          onChange={(e) => setProposalData(prev => ({ ...prev, proposal_url: e.target.value }))}
                          placeholder="https://your-proposal-document.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="terms_url" className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Terms & Conditions URL (Optional)
                        </Label>
                        <Input
                          id="terms_url"
                          type="url"
                          value={proposalData.terms_url}
                          onChange={(e) => setProposalData(prev => ({ ...prev, terms_url: e.target.value }))}
                          placeholder="https://your-terms-document.com"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProposalForm(false)}
                          className="flex-1"
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Proposal
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Quick Comment */}
              <div className="space-y-3">
                <Label>Or send a quick message:</Label>
                <Textarea
                  placeholder="Ask a question or add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proposals Section */}
        {(proposals.length > 0 || proposalsLoading || proposalError) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Proposals {proposals.length > 0 && `(${proposals.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proposalsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#00eada]" />
                    <p className="text-muted-foreground">Loading proposals...</p>
                  </div>
                </div>
              ) : proposalError ? (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {proposalError}
                  </AlertDescription>
                </Alert>
              ) : proposals.length > 0 ? (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <Card key={proposal.id} className="border-l-4 border-l-[#00eada]">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Badge variant="outline" className="mb-2 bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30">
                              {proposal.proposal_type.charAt(0).toUpperCase() + proposal.proposal_type.slice(1)} Proposal
                            </Badge>
                            {proposal.quote_amount && (
                              <p className="text-xl font-semibold text-green-600">
                                ${proposal.quote_amount.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(proposal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {proposal.timeline && (
                          <div className="mb-3">
                            <strong className="text-sm">Timeline:</strong>
                            <p className="text-sm text-muted-foreground">{proposal.timeline}</p>
                          </div>
                        )}
                        
                        {proposal.scope_details && (
                          <div className="mb-3">
                            <strong className="text-sm">Scope & Approach:</strong>
                            <p className="text-sm text-muted-foreground mt-1">{proposal.scope_details}</p>
                          </div>
                        )}
                        
                        {proposal.terms && (
                          <div className="text-sm">
                            <strong>Terms & Conditions:</strong>
                            {proposal.terms.startsWith('http') ? (
                              <a 
                                href={proposal.terms} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-[#00eada] hover:underline flex items-center gap-1 inline-flex"
                              >
                                View Terms Document <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="ml-2 text-muted-foreground">{proposal.terms}</span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No proposals submitted yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Status Cards for Declined/Agreed */}
        {serviceRequest.status === "agreed" && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Request Accepted!</h3>
                    <p className="text-green-700 dark:text-green-300">The organizer can now proceed to lock the deal and start the project.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {serviceRequest.status === "declined" && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Request Declined</h3>
                  <p className="text-red-700 dark:text-red-300">The organizer has been notified of your decision.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Communication Thread Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Thread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Communication and status history coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8ProjectStatus;
