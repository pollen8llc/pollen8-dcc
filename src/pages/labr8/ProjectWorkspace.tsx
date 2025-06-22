
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Send,
  Eye,
  Calendar
} from 'lucide-react';
import { 
  getUserServiceProvider,
  updateServiceRequest,
  getServiceProviderById
} from '@/services/modul8Service';
import { 
  getServiceRequestComments,
  createServiceRequestComment
} from '@/services/commentService';

const ProjectWorkspace = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    loadWorkspaceData();
  }, [currentUser]);

  useEffect(() => {
    if (selectedRequest) {
      loadComments(selectedRequest.id);
    }
  }, [selectedRequest]);

  const loadWorkspaceData = async () => {
    if (!currentUser) return;

    try {
      // Get service provider profile
      const provider = await getUserServiceProvider(currentUser.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Get selected request from sessionStorage
      const storedRequest = sessionStorage.getItem('selectedRequest');
      if (storedRequest) {
        const request = JSON.parse(storedRequest);
        setSelectedRequest(request);
      } else {
        navigate('/labr8/inbox');
        return;
      }
    } catch (error) {
      console.error('Error loading workspace data:', error);
      toast({
        title: "Error",
        description: "Failed to load workspace data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (requestId) => {
    try {
      const requestComments = await getServiceRequestComments(requestId);
      setComments(requestComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedRequest || !currentUser) return;

    setIsSubmittingComment(true);
    try {
      await createServiceRequestComment({
        service_request_id: selectedRequest.id,
        user_id: currentUser.id,
        comment_type: 'general',
        content: newComment.trim()
      });
      
      setNewComment('');
      await loadComments(selectedRequest.id);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedRequest) return;

    try {
      await updateServiceRequest(selectedRequest.id, { status: newStatus });
      
      // Update local state
      setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      
      toast({
        title: "Status Updated",
        description: `Project status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'negotiating': return <MessageSquare className="h-4 w-4" />;
      case 'agreed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBudget = (budget) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Project Selected
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Please select a project from your inbox
              </p>
              <Button onClick={() => navigate('/labr8/inbox')}>
                Back to Inbox
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/labr8/inbox')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inbox
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-[#00eada] flex items-center justify-center">
              <Building2 className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Project Workspace</h1>
              <p className="text-muted-foreground">
                Manage your current project
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedRequest.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {selectedRequest.description}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {getStatusIcon(selectedRequest.status)}
                  <span className="ml-1 capitalize">{selectedRequest.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Client</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Building2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {selectedRequest.organizer?.organization_name || 'Organization'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Budget</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatBudget(selectedRequest.budget_range)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Timeline</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.timeline || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6">
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleStatusUpdate('negotiating')}
                      className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                    >
                      Start Negotiation
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate('declined')}
                      variant="outline"
                    >
                      Decline
                    </Button>
                  </>
                )}
                {selectedRequest.status === 'negotiating' && (
                  <Button 
                    onClick={() => handleStatusUpdate('agreed')}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    Accept Terms
                  </Button>
                )}
                {selectedRequest.status === 'agreed' && (
                  <Button 
                    onClick={() => handleStatusUpdate('in_progress')}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    Start Project
                  </Button>
                )}
                {selectedRequest.status === 'in_progress' && (
                  <Button 
                    onClick={() => handleStatusUpdate('completed')}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Communication Thread */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Project Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user_id === currentUser?.id ? 'You' : 'Client'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a message or update..."
                  rows={3}
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  size="sm"
                  className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmittingComment ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
