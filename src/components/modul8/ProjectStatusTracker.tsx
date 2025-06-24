
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Building,
  RefreshCw,
  XCircle,
  Pause
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';

interface ProjectStatusTrackerProps {
  serviceRequest: ServiceRequest;
  className?: string;
}

const ProjectStatusTracker: React.FC<ProjectStatusTrackerProps> = ({
  serviceRequest,
  className = ""
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          progress: 10,
          description: 'Request created, awaiting provider response'
        };
      case 'negotiating':
        return {
          icon: <MessageSquare className="h-5 w-5" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          progress: 25,
          description: 'Proposal and comments being exchanged'
        };
      case 'agreed':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          progress: 40,
          description: 'Proposal accepted, awaiting provider confirmation'
        };
      case 'in_progress':
        return {
          icon: <Building className="h-5 w-5" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          progress: serviceRequest.project_progress || 60,
          description: 'Active work phase in progress'
        };
      case 'pending_review':
        return {
          icon: <RefreshCw className="h-5 w-5" />,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          progress: 85,
          description: 'Provider submitted deliverables for review'
        };
      case 'revisions':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          progress: 75,
          description: 'Revisions requested by organizer'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          progress: 100,
          description: 'Project completed and approved'
        };
      case 'declined':
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          progress: 0,
          description: 'Provider declined the request'
        };
      case 'cancelled':
        return {
          icon: <Pause className="h-5 w-5" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          progress: 0,
          description: 'Request cancelled by organizer'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          progress: 0,
          description: 'Unknown status'
        };
    }
  };

  const statusInfo = getStatusInfo(serviceRequest.status);
  const isCompleted = serviceRequest.status === 'completed';
  const isCancelled = ['declined', 'cancelled'].includes(serviceRequest.status);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Project Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center gap-3">
          <Badge className={`${statusInfo.color} border flex items-center gap-1`}>
            {statusInfo.icon}
            <span className="font-medium capitalize">
              {serviceRequest.status.replace('_', ' ')}
            </span>
          </Badge>
          <span className="text-sm text-muted-foreground">
            {statusInfo.description}
          </span>
        </div>

        {/* Progress Bar */}
        {!isCancelled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">{statusInfo.progress}%</span>
            </div>
            <Progress 
              value={statusInfo.progress} 
              className="h-2"
            />
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3 mt-4">
          <h4 className="font-medium text-sm">Project Timeline</h4>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Created</span>
              <span className="ml-auto">
                {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {serviceRequest.status !== 'pending' && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">In Progress</span>
                <span className="ml-auto">
                  {new Date(serviceRequest.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {isCompleted && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">Completed</span>
                <span className="ml-auto">
                  {new Date(serviceRequest.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Budget Range</span>
            <span className="text-muted-foreground">
              {serviceRequest.budget_range?.min ? 
                `$${serviceRequest.budget_range.min.toLocaleString()}${
                  serviceRequest.budget_range.max ? 
                    ` - $${serviceRequest.budget_range.max.toLocaleString()}` : '+'
                }` : 
                'Not specified'
              }
            </span>
          </div>
          
          {serviceRequest.timeline && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Timeline</span>
              <span className="text-muted-foreground">{serviceRequest.timeline}</span>
            </div>
          )}
          
          {serviceRequest.milestones && serviceRequest.milestones.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Milestones</span>
              <span className="text-muted-foreground">{serviceRequest.milestones.length} defined</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusTracker;
