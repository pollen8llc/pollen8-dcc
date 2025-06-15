
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, MessageSquare, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ServiceRequest, ProjectRevision, ProjectCompletion, ProjectRating } from '@/types/modul8';
import { getServiceRequests } from '@/services/modul8Service';
import { 
  getProjectRevisions, 
  getProjectCompletion, 
  getProjectRating,
  createProjectRevision 
} from '@/services/modul8ProjectService';
import { toast } from '@/hooks/use-toast';
import ProjectCompletionModal from '@/components/labr8/ProjectCompletionModal';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const [project, setProject] = useState<ServiceRequest | null>(null);
  const [revisions, setRevisions] = useState<ProjectRevision[]>([]);
  const [completion, setCompletion] = useState<ProjectCompletion | null>(null);
  const [rating, setRating] = useState<ProjectRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [revisionResponse, setRevisionResponse] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [id, session?.user?.id]);

  const loadProjectData = async () => {
    if (!id || !session?.user?.id) return;
    
    try {
      const requests = await getServiceRequests();
      const projectData = requests.find(r => r.id === id);
      
      if (!projectData) {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }

      setProject(projectData);
      
      // Load project-related data
      const [revisionsData, completionData, ratingData] = await Promise.all([
        getProjectRevisions(id),
        getProjectCompletion(id),
        getProjectRating(id)
      ]);
      
      setRevisions(revisionsData);
      setCompletion(completionData);
      setRating(ratingData);
    } catch (error) {
      console.error('Error loading project data:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevisionResponse = async () => {
    if (!project || !session?.user?.id || !revisionResponse.trim()) return;

    setSubmittingRevision(true);
    try {
      await createProjectRevision({
        service_request_id: project.id,
        organizer_id: project.organizer_id,
        service_provider_id: project.service_provider_id!,
        revision_type: 'response',
        description: revisionResponse
      });

      setRevisionResponse('');
      await loadProjectData();
      
      toast({
        title: "Success",
        description: "Revision response submitted successfully"
      });
    } catch (error) {
      console.error('Error submitting revision response:', error);
      toast({
        title: "Error",
        description: "Failed to submit revision response",
        variant: "destructive"
      });
    } finally {
      setSubmittingRevision(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Button onClick={() => navigate('/labr8/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'revision_requested': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const pendingRevisions = revisions.filter(r => r.revision_type === 'requested' && r.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/labr8/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      {project.organizer && (
                        <p className="text-muted-foreground">
                          {project.organizer.organization_name}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-2"
                    >
                      {getStatusIcon(project.status)}
                      {formatStatus(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {project.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>
                  )}

                  {/* Progress */}
                  {project.project_progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span>{project.project_progress}%</span>
                      </div>
                      <Progress value={project.project_progress} className="h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revision Requests */}
              {pendingRevisions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Revision Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingRevisions.map((revision) => (
                      <div key={revision.id} className="bg-yellow-50 border border-yellow-200 rounded p-4">
                        <p className="text-yellow-800 mb-3">{revision.description}</p>
                        <p className="text-xs text-yellow-600">
                          Requested on {new Date(revision.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}

                    {/* Revision Response Form */}
                    <div className="space-y-3 pt-4 border-t">
                      <Label htmlFor="revision_response">Response to Revisions</Label>
                      <Textarea
                        id="revision_response"
                        placeholder="Describe how you've addressed the requested revisions..."
                        value={revisionResponse}
                        onChange={(e) => setRevisionResponse(e.target.value)}
                        rows={3}
                      />
                      <Button
                        onClick={handleRevisionResponse}
                        disabled={submittingRevision || !revisionResponse.trim()}
                        className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                      >
                        {submittingRevision ? 'Submitting...' : 'Submit Response'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Completion */}
              {project.status === 'in_progress' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Complete?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Once you mark this project as complete, it will be submitted to the organizer for review.
                    </p>
                    <Button
                      onClick={() => setShowCompletionModal(true)}
                      className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                    >
                      Mark as Complete
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Completion Status */}
              {completion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Completion Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant={completion.status === 'confirmed' ? 'default' : 'secondary'}>
                          {completion.status === 'confirmed' ? 'Confirmed' : 'Pending Review'}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p className="text-muted-foreground">
                          {new Date(completion.submitted_at).toLocaleDateString()}
                        </p>
                      </div>

                      {completion.completion_notes && (
                        <div>
                          <span className="font-medium">Your Notes:</span>
                          <p className="text-muted-foreground">{completion.completion_notes}</p>
                        </div>
                      )}

                      {completion.deliverables.length > 0 && (
                        <div>
                          <span className="font-medium">Deliverables:</span>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {completion.deliverables.map((deliverable, index) => (
                              <li key={index}>{deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rating */}
              {rating && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Project Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="font-medium">{rating.rating}/5</span>
                    </div>
                    {rating.feedback && (
                      <p className="text-muted-foreground">{rating.feedback}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.timeline && (
                    <div>
                      <span className="font-medium">Timeline:</span>
                      <p className="text-muted-foreground">{project.timeline}</p>
                    </div>
                  )}

                  {project.budget_range && (project.budget_range.min || project.budget_range.max) && (
                    <div>
                      <span className="font-medium">Budget:</span>
                      <p className="text-muted-foreground">
                        {project.budget_range.currency} {project.budget_range.min?.toLocaleString()}
                        {project.budget_range.max && ` - ${project.budget_range.max.toLocaleString()}`}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Communication History */}
              {revisions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {revisions.map((revision) => (
                        <div key={revision.id} className="border-l-2 border-muted pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" size="sm">
                              {revision.revision_type === 'requested' ? 'Request' : 'Response'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(revision.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {revision.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Completion Modal */}
      {project && (
        <ProjectCompletionModal
          project={project}
          open={showCompletionModal}
          onOpenChange={setShowCompletionModal}
          onComplete={() => {
            loadProjectData();
            setShowCompletionModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
