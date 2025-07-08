import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Building, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';
import { 
  getOrganizerServiceRequests,
  updateServiceRequest,
  getUserOrganizer
} from '@/services/modul8Service';
import { 
  getServiceRequestComments,
  createServiceRequestComment
} from '@/services/commentService';

const ProjectStatusView = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      loadComments(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    if (!currentUser) return;
    
    try {
      // First get the organizer profile
      const organizerProfile = await getUserOrganizer(currentUser.id);
      if (!organizerProfile) {
        toast({
          title: "Setup Required",
          description: "Please complete your organizer profile setup",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }
      
      setOrganizer(organizerProfile);
      
      // Get service requests for this organizer
      const userProjects = await getOrganizerServiceRequests(organizerProfile.id);
      setProjects(userProjects);
      
      // Auto-select the most recent active project
      const activeProject = userProjects.find(p => 
        ['pending', 'negotiating', 'agreed', 'in_progress'].includes(p.status)
      );
      if (activeProject) {
        setSelectedProject(activeProject);
      } else if (userProjects.length > 0) {
        setSelectedProject(userProjects[0]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (projectId) => {
    try {
      const projectComments = await getServiceRequestComments(projectId);
      setComments(projectComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedProject || !currentUser) return;

    setIsSubmittingComment(true);
    try {
      await createServiceRequestComment({
        service_request_id: selectedProject.id,
        user_id: currentUser.id,
        comment_type: 'general',
        content: newComment.trim()
      });
      
      setNewComment('');
      await loadComments(selectedProject.id);
      
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

  const handleAcceptProposal = async () => {
    if (!selectedProject) return;

    try {
      await updateServiceRequest(selectedProject.id, { status: 'agreed' });
      await loadProjects();
      
      toast({
        title: "Proposal Accepted",
        description: "The project is now ready to begin",
      });
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedProject) return;

    try {
      await updateServiceRequest(selectedProject.id, { status: 'completed' });
      await loadProjects();
      
      toast({
        title: "Project Completed",
        description: "The project has been marked as complete",
      });
    } catch (error) {
      console.error('Error marking complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark project complete",
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
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/modul8')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Projects Yet
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by creating your first service request
              </p>
              <Button onClick={() => navigate('/modul8')}>
                Browse Providers
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
            onClick={() => navigate('/modul8')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your service requests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Project List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Projects ({projects.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                        selectedProject?.id === project.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="font-medium truncate">{project.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status}</span>
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-3">
            {selectedProject && (
              <div className="space-y-6">
                {/* Project Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedProject.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {selectedProject.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {getStatusIcon(selectedProject.status)}
                        <span className="ml-1 capitalize">{selectedProject.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Provider</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Building className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Service Provider</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Budget</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedProject.budget_range?.min && selectedProject.budget_range?.max
                            ? `$${selectedProject.budget_range.min.toLocaleString()} - $${selectedProject.budget_range.max.toLocaleString()}`
                            : 'TBD'
                          }
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Timeline</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedProject.timeline || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-6">
                      {selectedProject.status === 'negotiating' && (
                        <Button onClick={handleAcceptProposal}>
                          Accept Proposal
                        </Button>
                      )}
                      {selectedProject.status === 'in_progress' && (
                        <Button onClick={handleMarkComplete}>
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Thread */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Communication Thread
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="border-l-2 border-muted pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.user_id === currentUser?.id ? 'You' : 'Provider'}
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
                          No comments yet. Start the conversation!
                        </p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="space-y-3">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment or question..."
                        rows={3}
                      />
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatusView;
