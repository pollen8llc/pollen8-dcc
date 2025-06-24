
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star,
  FileText,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { useNavigate } from 'react-router-dom';

interface ProjectStatusCardProps {
  project: ServiceRequest;
  onComplete: () => void;
  onRefresh: () => void;
}

const ProjectStatusCard = ({ project, onComplete, onRefresh }: ProjectStatusCardProps) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'revision_requested': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending_review': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'pending_completion': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'revision_requested': return 'bg-yellow-100 text-yellow-800';
      case 'pending_review': return 'bg-purple-100 text-purple-800';
      case 'pending_completion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getNextAction = () => {
    switch (project.status) {
      case 'agreed':
        return { text: 'Start Project', action: () => {/* TODO: Start project */} };
      case 'in_progress':
        return { text: 'Mark Complete', action: onComplete };
      case 'revision_requested':
        return { text: 'Address Revisions', action: () => navigate(`/labr8/project/${project.id}`) };
      case 'pending_review':
        return { text: 'View Details', action: () => navigate(`/labr8/project/${project.id}`) };
      case 'pending_completion':
        return { text: 'View Status', action: () => navigate(`/labr8/project/${project.id}`) };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(project.status)} flex items-center gap-1`}
          >
            {getStatusIcon(project.status)}
            {formatStatus(project.status)}
          </Badge>
        </div>
        
        {project.organizer && (
          <p className="text-sm text-muted-foreground">
            {project.organizer.organization_name}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        {project.project_progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.project_progress}%</span>
            </div>
            <Progress value={project.project_progress} className="h-2" />
          </div>
        )}

        {/* Timeline */}
        {project.timeline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{project.timeline}</span>
          </div>
        )}

        {/* Budget */}
        {project.budget_range && (project.budget_range.min || project.budget_range.max) && (
          <div className="text-sm">
            <span className="font-medium">Budget: </span>
            <span className="text-muted-foreground">
              {project.budget_range.currency} {project.budget_range.min?.toLocaleString()}
              {project.budget_range.max && ` - ${project.budget_range.max.toLocaleString()}`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {nextAction && (
            <Button 
              onClick={nextAction.action}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              size="sm"
            >
              {nextAction.text}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/labr8/project/${project.id}`)}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            View
          </Button>
        </div>

        {/* Status Messages */}
        {project.status === 'revision_requested' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Revisions Requested</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              The organizer has requested changes to your work.
            </p>
          </div>
        )}

        {project.status === 'pending_completion' && (
          <div className="bg-orange-50 border border-orange-200 rounded p-3">
            <div className="flex items-center gap-2 text-orange-800 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Awaiting Confirmation</span>
            </div>
            <p className="text-orange-700 text-sm mt-1">
              Waiting for organizer to confirm completion.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
