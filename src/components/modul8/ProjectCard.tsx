
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/types/modul8';
import { Building, Clock, DollarSign } from 'lucide-react';

interface ProjectCardProps {
  request: ServiceRequest;
  type: 'details' | 'status' | 'proposal';
  children?: React.ReactNode;
}

const ProjectCard = ({ request, type, children }: ProjectCardProps) => {
  const getCardTitle = () => {
    switch (type) {
      case 'details':
        return 'Project Details';
      case 'status':
        return 'Request Status';
      case 'proposal':
        return 'Proposal';
      default:
        return 'Project Information';
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{getCardTitle()}</CardTitle>
          {type === 'status' && (
            <Badge className={`${getStatusColor(request.status)} border`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'details' && (
          <>
            <div>
              <h3 className="font-medium text-lg mb-2">{request.title}</h3>
              <p className="text-muted-foreground text-sm">{request.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.budget_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    ${request.budget_range.min?.toLocaleString()}
                    {request.budget_range.max && 
                      ` - $${request.budget_range.max.toLocaleString()}`
                    }
                  </span>
                </div>
              )}
              
              {request.timeline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{request.timeline}</span>
                </div>
              )}
            </div>

            {request.organizer && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {request.organizer.organization_name}
                </span>
              </div>
            )}
          </>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
