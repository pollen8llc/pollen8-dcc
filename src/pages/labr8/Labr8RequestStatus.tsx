import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceRequests, getUserServiceProvider } from '@/services/modul8Service';
import { createServiceRequestComment, updateServiceRequestStatus } from '@/services/commentService';
import { ServiceRequest, ServiceProvider } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Building,
  DollarSign,
  Calendar,
  Send,
  Handshake,
  ExternalLink,
  Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Labr8RequestStatus = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    try {
      setLoading(true);
      
      const [requests, provider] = await Promise.all([
        getServiceRequests(),
        getUserServiceProvider(session.user.id)
      ]);
      
      const request = requests.find(r => r.id === requestId);
      
      if (!request) {
        toast({
          title: "Error",
          description: "Service request not found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }

      if (!provider) {
        toast({
          title: "Error",
          description: "Service provider profile not found",
          variant: "destructive"
        });
        navigate('/labr8/setup');
        return;
      }
      
      setServiceRequest(request);
      setServiceProvider(provider);
      
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

  const handleStatusUpdate = async (newStatus: string, reason?: string) => {
    if (!serviceRequest || !session?.user?.id) return;
    
    setSubmitting(true);
    try {
      await updateServiceRequestStatus(
        serviceRequest.id,
        newStatus,
        session.user.id,
        serviceRequest.status,
        reason
      );
      
      setServiceRequest(prev => prev ? { ...prev, status: newStatus as any } : null);
      
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus.replace('_', ' ')}`
      });
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
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
      
      // If this is the first response, update status to negotiating
      if (serviceRequest.status === 'pending') {
        await handleStatusUpdate('negotiating', 'Provider responded to request');
      }
      
      setNewComment('');
      toast({
        title: "Comment Added",
        description: "Your response has been sent to the organizer"
      });
      
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to send comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeclineRequest = async () => {
    await handleStatusUpdate('declined', 'Provider declined the request');
  };

  const handleAcceptRequest = async () => {
    await handleStatusUpdate('agreed', 'Provider accepted the request');
  };

  const handleDeleteRequest = async () => {
    if (!serviceRequest || !session?.user?.id) return;
    
    setDeleting(true);
    try {
      // Only allow deletion if request is in pending status and provider hasn't responded yet
      if (serviceRequest.status !== 'pending') {
        toast({
          title: "Cannot Delete",
          description: "Requests can only be deleted while in pending status",
          variant: "destructive"
        });
        return;
      }

      // Here we would call a delete service - for now we'll simulate it
      // await deleteServiceRequest(serviceRequest.id);
      
      toast({
        title: "Request Deleted",
        description: "The service request has been deleted"
      });
      
      navigate('/labr8/dashboard');
      
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleLockDeal = () => {
    if (!serviceRequest) return;
    
    const deelParams = new URLSearchParams({
      service_title: serviceRequest.title,
      client_name: serviceRequest.organizer?.organization_name || 'Client',
      description: serviceRequest.description || ''
    });

    const deelUrl = `https://app.deel.com/contracts/create?${deelParams.toString()}`;
    
    toast({
      title: "Redirecting to Deel",
      description: "Opening contract creation page..."
    });

    window.open(deelUrl, '_blank');
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget: TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Budget: TBD';
  };

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'New request awaiting your response';
      case 'negotiating':
        return 'In discussion with organizer';
      case 'declined':
        return 'You declined this request';
      case 'agreed':
        return 'Request accepted - organizer can now lock the deal';
      case 'in_progress':
        return 'Project is active';
      case 'completed':
        return 'Project completed';
      default:
        return 'Status unknown';
    }
  };

  const isOrganizer = session?.user?.id && serviceRequest?.organizer?.user_id === session.user.id;
  const canDeleteRequest = serviceRequest?.status === 'pending' && !isOrganizer;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
            <Button onClick={() => navigate('/labr8/dashboard')}>
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          {canDeleteRequest && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Request
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Service Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this service request? This action cannot be undone and will remove the request permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRequest} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Request'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Request Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{serviceRequest.title}</CardTitle>
                <Badge className={`${getStatusColor(serviceRequest.status)} font-medium`} variant="outline">
                  {serviceRequest.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {getStatusMessage(serviceRequest.status)}
                </p>
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
                    {serviceRequest.organizer.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{serviceRequest.organizer.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {serviceRequest.description && (
              <p className="text-muted-foreground mb-4">{serviceRequest.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{formatBudget(serviceRequest.budget_range)}</span>
              </div>
              {serviceRequest.timeline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{serviceRequest.timeline}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Created {new Date(serviceRequest.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {serviceRequest.milestones && serviceRequest.milestones.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Project Milestones</h4>
                <div className="space-y-1">
                  {serviceRequest.milestones.map((milestone, index) => (
                    <div key={index} className="text-sm bg-muted/50 px-3 py-2 rounded">
                      {typeof milestone === 'string' ? milestone : JSON.stringify(milestone)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Actions */}
        {serviceRequest.status === 'agreed' && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Request Accepted!</h3>
                    <p className="text-green-700">
                      {isOrganizer 
                        ? "You can now lock the deal to start the project"
                        : "Waiting for organizer to lock the deal"
                      }
                    </p>
                  </div>
                </div>
                {isOrganizer && (
                  <Button onClick={handleLockDeal} className="bg-green-600 hover:bg-green-700">
                    <Handshake className="h-4 w-4 mr-2" />
                    Lock Deal
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {serviceRequest.status === 'declined' && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Request Declined</h3>
                  <p className="text-red-700">
                    {isOrganizer 
                      ? "This request has been declined by the service provider"
                      : "You have declined this service request"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {(serviceRequest.status === 'pending' || serviceRequest.status === 'negotiating') && !isOrganizer && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Respond to Request
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, ask questions, or propose modifications..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              
              <div className="flex gap-4">
                <Button
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Send Response'}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                      Accept Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Accept Service Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to accept this request? This will notify the organizer that you're ready to proceed with the project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAcceptRequest} disabled={submitting}>
                        {submitting ? 'Accepting...' : 'Accept Request'}
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
                      <AlertDialogTitle>Decline Service Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to decline this request? This action cannot be undone and the organizer will be notified.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeclineRequest} disabled={submitting}>
                        {submitting ? 'Declining...' : 'Decline Request'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communication Thread */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication History
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Communication history will appear here as you and the organizer exchange messages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8RequestStatus;
