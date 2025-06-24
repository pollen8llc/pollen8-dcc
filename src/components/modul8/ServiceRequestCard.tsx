
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceRequest } from '@/types/modul8';
import { DollarSign, Clock, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import ServiceRequestActions from './ServiceRequestActions';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onUpdate: () => void;
}

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ request, onUpdate }) => {
  const navigate = useNavigate();
  const { session } = useSession();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'negotiating':
        return 'bg-[#00eada]/10 text-[#00eada]';
      case 'agreed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'none':
        return 'bg-muted text-muted-foreground';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'affiliated':
        return 'bg-[#00eada]/10 text-[#00eada]';
      default:
        return 'bg-muted text-muted-foreground';
    }
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

  // Check if current user is the organizer who created this request
  const isOwner = session?.user?.id && request.organizer?.user_id === session.user.id;

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Badge className={getStatusColor(request.status)} variant="secondary">
                {request.status}
              </Badge>
              <Badge className={getEngagementColor(request.engagement_status)} variant="outline">
                {request.engagement_status}
              </Badge>
            </div>
            {isOwner && (
              <ServiceRequestActions 
                request={request} 
                onUpdate={onUpdate}
              />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {request.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {request.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatBudget(request.budget_range)}</span>
          </div>
          
          {request.timeline && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{request.timeline}</span>
            </div>
          )}
          
          {request.organizer && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{request.organizer.organization_name}</span>
            </div>
          )}
        </div>

        {request.milestones && Array.isArray(request.milestones) && request.milestones.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Milestones</h4>
            <div className="space-y-1">
              {request.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {typeof milestone === 'string' ? milestone : JSON.stringify(milestone)}
                </div>
              ))}
              {request.milestones.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{request.milestones.length - 3} more milestones
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/modul8/request/${request.id}`)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestCard;
