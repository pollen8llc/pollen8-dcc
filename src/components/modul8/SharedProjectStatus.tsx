import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  User,
  Building2,
  FileText,
  Calendar
} from 'lucide-react';
import { ServiceRequest, ProjectComment } from '@/types/modul8';
import { getServiceRequests, getUserOrganizer, getUserServiceProvider } from '@/services/modul8Service';
import { 
  getProjectComments, 
  createProjectComment, 
  updateProjectStatus 
} from '@/services/enhancedModul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

const SharedProjectStatus: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { session } = useSession();
  const [project, setProject] = useState<ServiceRequest | null>(null);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [userRole, setUserRole] = useState<'organizer' | 'provider' | null>(null);

  useEffect(() => {
    if (projectId && session?.user?.id) {
      loadProjectData();
      determineUserRole();
    }
  }, [projectId, session?.user?.id]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      // Get all service requests and find the one with matching ID
      const requests = await getServiceRequests();
      const foundProject = requests.find(req => req.id === projectId);
      
      if (foundProject) {
        setProject(foundProject);
        const projectComments = await getProjectComments(foundProject.id);
        setComments(projectComments);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const determineUserRole = async () => {
    if (!session?.user?.id) return;

    try {
      const organizer = await getUserOrganizer(session.user.id);
      const provider = await getUserServiceProvider(session.user.id);

      if (organizer) {
        setUserRole('organizer');
      } else if (provider) {
        setUserRole('provider');
      }
    } catch (error) {
      console.error('Error determining user role:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !project || !session?.user?.id) return;

    setCommentLoading(true);
    try {
      await createProjectComment({
        service_request_id: project.id,
        user_id: session.user.id,
        comment_type: 'comment',
        content: newComment.trim()
      });

      setNewComment('');
      const updatedComments = await getProjectComments(project.id);
      setComments(updatedComments);

      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully."
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    if (!project || !session?.user?.id) return;

    try {
      await updateProjectStatus(project.id, newStatus, session.user.id, notes);
      await loadProjectData(); // Refresh data

      toast({
        title: "Status Updated",
        description: `Project status changed to ${newStatus}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending_review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'agreed':
        return 'bg-[#00eada]/10 text-[#00eada]';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Project Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <p className="text-muted-foreground mt-2">{project.description}</p>
            </div>
            <Badge className={getStatusColor(project.status)} variant="secondary">
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {project.budget_range?.min && project.budget_range?.max
                  ? `$${project.budget_range.min.toLocaleString()} - $${project.budget_range.max.toLocaleString()}`
                  : 'Budget: TBD'}
              </span>
            </div>
            
            {project.timeline && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.timeline}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Created {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Dual Profile Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organizer Profile */}
            <Card className="bg-muted/20">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Project Organizer</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={project.organizer?.logo_url} />
                    <AvatarFallback>
                      <Building2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.organizer?.organization_name}</p>
                    {project.organizer?.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {project.organizer.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Provider Profile */}
            <Card className="bg-muted/20">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Service Provider</h3>
              </CardHeader>
              <CardContent>
                {project.service_provider ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.service_provider.logo_url} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.service_provider.business_name}</p>
                      {project.service_provider.tagline && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {project.service_provider.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No provider assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Role-based Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {userRole === 'organizer' && (
              <>
                <Button 
                  onClick={() => handleStatusUpdate('completed', 'Project marked as completed by organizer')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('cancelled', 'Project cancelled by organizer')}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Project
                </Button>
              </>
            )}

            {userRole === 'provider' && project.service_provider && (
              <>
                <Button 
                  onClick={() => handleStatusUpdate('pending_review', 'Deliverables submitted for review')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Deliverables
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('declined', 'Assignment declined by provider')}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Assignment
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comment Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Project Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Comments */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-muted/20 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">User</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.comment_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Add New Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment to the project discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || commentLoading}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedProjectStatus;
