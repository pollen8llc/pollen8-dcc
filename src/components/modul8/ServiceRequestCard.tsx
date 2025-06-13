
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, DollarSign, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onUpdate: () => void;
}

const ServiceRequestCard = ({ request, onUpdate }: ServiceRequestCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEngagementColor = (status: string) => {
    switch (status) {
      case 'none': return 'bg-gray-100 text-gray-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'affiliated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
          <div className="flex flex-col gap-1">
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
            <Badge className={getEngagementColor(request.engagement_status)}>
              {request.engagement_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {request.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{request.description}</p>
        )}

        {request.service_provider && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={request.service_provider.logo_url} />
              <AvatarFallback>
                {request.service_provider.business_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {request.service_provider.business_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {request.service_provider.tagline}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {request.budget_range?.min && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>
                ${request.budget_range.min}
                {request.budget_range.max ? `-$${request.budget_range.max}` : '+'}
              </span>
            </div>
          )}
          
          {request.timeline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="truncate">{request.timeline}</span>
            </div>
          )}
        </div>

        {request.milestones && request.milestones.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-600" />
            <span>{request.milestones.length} milestone(s)</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/modul8/request/${request.id}`)}
          >
            View Details
          </Button>
          
          {request.engagement_status === 'negotiating' && (
            <Button 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate(`/modul8/request/${request.id}/negotiate`)}
            >
              <MessageSquare className="h-3 w-3" />
              Negotiate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestCard;
