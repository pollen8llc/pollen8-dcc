import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { getServiceRequests, getUserServiceProvider, createProposal } from "@/services/modul8Service";
import { createServiceRequestComment, updateServiceRequestStatus } from "@/services/commentService";
import { ServiceRequest, ServiceProvider } from "@/types/modul8";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Handshake,
  ExternalLink,
  User,
  Building,
  ArrowLeft,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Labr8ProjectStatus = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { session } = useSession();
  const navigate = useNavigate();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    setLoading(true);

    try {
      const [requests, provider] = await Promise.all([
        getServiceRequests(),
        getUserServiceProvider(session.user.id)
      ]);
      const req = requests.find(r => r.id === requestId);
      setServiceRequest(req ?? null);
      setServiceProvider(provider ?? null);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load request", variant: "destructive" });
      navigate("/labr8/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // --- FIX: status argument is now properly typed ---
  const handleStatusUpdate = async (
    status: ServiceRequest['status'], // restricts to allowed literal values
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
      toast({ title: "Status Updated", description: `Request status changed to ${status}` });
      // This set is now type safe!
      setServiceRequest(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceRequest || !session?.user?.id) return;
    
    setSubmitting(true);
    try {
      await createProposal({
        service_request_id: serviceRequest.id,
        from_user_id: session.user.id,
        proposal_type: 'initial',
        quote_amount: proposalData.quote_amount ? parseFloat(proposalData.quote_amount) : undefined,
        timeline: proposalData.timeline || undefined,
        scope_details: proposalData.scope_details || undefined,
        terms: proposalData.terms || undefined
      });
      
      // Update status to negotiating after proposal submission
      await handleStatusUpdate('negotiating', 'Provider submitted proposal');
      
      toast({ 
        title: "Proposal Submitted!", 
        description: "Your proposal has been sent to the organizer for review." 
      });
      
      setShowProposalForm(false);
      setProposalData({ quote_amount: '', timeline: '', scope_details: '', terms: '' });
      
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
    } catch {
      toast({ title: "Error", description: "Failed to send comment", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async () => await handleStatusUpdate('agreed', 'Provider accepted the request');
  const handleDecline = async () => await handleStatusUpdate('declined', 'Provider declined the request');

  const isOrganizer = session?.user?.id && serviceRequest?.organizer?.user_id === session.user.id;
  
  // ... keep existing code (getStatusColor function)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'agreed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
        <Button onClick={() => navigate('/labr8/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-2 py-8">
        <Button
          variant="outline"
          size="sm"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/labr8/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        
        {/* Request Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{serviceRequest.title}</CardTitle>
                <Badge className={`${getStatusColor(serviceRequest.status)} font-medium`} variant="outline">
                  {serviceRequest.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">{serviceRequest.description}</p>
              </div>
              {serviceRequest.organizer && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={serviceRequest.organizer.logo_url} />
                    <AvatarFallback>
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{serviceRequest.organizer.organization_name}</h3>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {serviceRequest.budget_range?.min
                    ? `From $${serviceRequest.budget_range.min?.toLocaleString()}`
                    : "Budget: TBD"}
                </span>
              </div>
              {serviceRequest.timeline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{serviceRequest.timeline}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Created {new Date(serviceRequest.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* Provider Actions */}
        {!isOrganizer && ["pending", "negotiating"].includes(serviceRequest.status) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Respond to Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={() => setShowProposalForm(!showProposalForm)}
                  className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  <FileText className="h-4 w-4" />
                  {showProposalForm ? 'Hide Proposal Form' : 'Submit Proposal'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                      Accept Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Accept Request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will change status to agreed and notify the organizer.
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
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Decline Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Decline Request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure? The organizer will be notified and cannot undo this action.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDecline} disabled={submitting}>
                        {submitting ? "Declining..." : "Decline"}
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
                          <Label htmlFor="quote_amount">Quote Amount ($)</Label>
                          <Input
                            id="quote_amount"
                            type="number"
                            value={proposalData.quote_amount}
                            onChange={(e) => setProposalData(prev => ({ ...prev, quote_amount: e.target.value }))}
                            placeholder="5000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Estimated Timeline</Label>
                          <Input
                            id="timeline"
                            value={proposalData.timeline}
                            onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                            placeholder="2-3 weeks"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scope_details">Scope & Approach</Label>
                        <Textarea
                          id="scope_details"
                          value={proposalData.scope_details}
                          onChange={(e) => setProposalData(prev => ({ ...prev, scope_details: e.target.value }))}
                          placeholder="Describe your approach and what you will deliver..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="terms">Terms & Conditions</Label>
                        <Textarea
                          id="terms"
                          value={proposalData.terms}
                          onChange={(e) => setProposalData(prev => ({ ...prev, terms: e.target.value }))}
                          placeholder="Payment terms, revision policy, etc..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProposalForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {submitting ? 'Submitting...' : 'Submit Proposal'}
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
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Cards for Declined/Agreed */}
        {serviceRequest.status === "agreed" && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Request Accepted!</h3>
                    <p className="text-green-700">Organizer can now lock the deal to start the project.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {serviceRequest.status === "declined" && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Request Declined</h3>
                  <p className="text-red-700">The organizer will see this update and can archive or delete the request.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Thread/History (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Thread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Communication and status history coming soon!
              {/* Here you'd map over the actual comment thread */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8ProjectStatus;
