
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Building, 
  User, 
  MessageSquare,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';
import { ServiceRequest, ServiceProvider } from '@/types/modul8';
import { 
  getServiceRequestById, 
  getUserServiceProvider,
  getProposalsByRequestId 
} from '@/services/modul8Service';
import { submitProviderProposal } from '@/services/negotiationService';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ProviderResponseForm from '@/components/modul8/ProviderResponseForm';

const Labr8RequestStatus = () => {
  const { requestId, providerId } = useParams<{ requestId: string; providerId?: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);  
  const [loading, setLoading] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequestData();
  }, [requestId, session?.user?.id]);

  const loadRequestData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      // Check if current user is a service provider
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        toast({
          title: "Access Denied",
          description: "You need to be a registered service provider to view this page",
          variant: "destructive"
        });
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      const requestData = await getServiceRequestById(requestId);
      
      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate('/labr8/inbox');
        return;
      }

      setServiceRequest(requestData);
    } catch (error) {
      console.error('Error loading request:', error);
      toast({
        title: "Error",
        description: "Failed to load request information",
        variant: "destructive"
      });
      navigate('/labr8/inbox');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (data: {
    quoteAmount: number;
    timeline: string;
    scopeDetails: string;
    terms: string;
    clarifications?: string;
  }) => {
    if (!serviceRequest || !session?.user?.id) return;

    setSubmitting(true);
    try {
      await submitProviderProposal({
        serviceRequestId: serviceRequest.id,
        fromUserId: session.user.id,
        quoteAmount: data.quoteAmount,
        timeline: data.timeline,
        scopeDetails: data.scopeDetails,
        terms: data.terms,
        clarifications: data.clarifications
      });

      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been sent to the organizer",
      });

      setShowResponseForm(false);
      loadRequestData(); // Reload to get updated status
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'agreed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return <Clock className="h-4 w-4" />;
      case 'negotiating':
        return <MessageSquare className="h-4 w-4" />;
      case 'agreed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Building className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const canSubmitProposal = () => {
    if (!serviceRequest) return false;
    return ['pending', 'assigned'].includes(serviceRequest.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
            <Button onClick={() => navigate('/labr8/inbox')}>
              Back to Inbox
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/inbox')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border`}>
                {getStatusIcon(serviceRequest.status)}
                <span className="ml-1 font-medium">
                  {serviceRequest.status.charAt(0).toUpperCase() + serviceRequest.status.slice(1)}
                </span>
              </Badge>
              <span className="text-muted-foreground text-sm">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{serviceRequest.description}</p>
                </div>
                
                {serviceRequest.milestones && serviceRequest.milestones.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Milestones</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {serviceRequest.milestones.map((milestone, index) => (
                        <li key={index} className="text-muted-foreground">{milestone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Section */}
            {canSubmitProposal() && !showResponseForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Respond?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Submit your proposal for this project. Include your quote, timeline, and detailed scope.
                  </p>
                  <Button 
                    onClick={() => setShowResponseForm(true)}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Proposal
                  </Button>
                </CardContent>
              </Card>
            )}

            {showResponseForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProviderResponseForm
                    serviceRequest={serviceRequest}
                    onSubmit={handleResponseSubmit}
                    onCancel={() => setShowResponseForm(false)}
                    isSubmitting={submitting}
                  />
                </CardContent>
              </Card>
            )}

            {serviceRequest.status === 'negotiating' && (
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  Your proposal has been submitted and is under review by the organizer.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceRequest.budget_range?.min && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      ${serviceRequest.budget_range.min.toLocaleString()}
                      {serviceRequest.budget_range.max && 
                        ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}
                
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{serviceRequest.timeline}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {serviceRequest.organizer?.organization_name || 'Organizer'}
                    </div>
                    <div className="text-xs text-muted-foreground">Client</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8RequestStatus;
