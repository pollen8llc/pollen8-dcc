
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
        return 'bg-muted text-muted-foreground border-[#00eada]/20';
      case 'negotiating':
        return 'bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30';
      case 'agreed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border/30';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'none':
        return 'bg-muted text-muted-foreground border-border/30';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-500/30';
      case 'affiliated':
        return 'bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30';
      default:
        return 'bg-muted text-muted-foreground border-border/30';
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
    <Card className="h-full group relative border-l-2 border-l-transparent hover:border-l-[#00eada] hover:shadow-lg hover:shadow-[#00eada]/10 transition-all duration-200 hover:scale-[1.01]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-[#00eada] transition-colors duration-200">
            {request.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Badge className={`${getStatusColor(request.status)} border transition-all duration-200`} variant="secondary">
                {request.status}
              </Badge>
              <Badge className={`${getEngagementColor(request.engagement_status)} border transition-all duration-200`} variant="outline">
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
            <DollarSign className="h-4 w-4 text-[#00eada] group-hover:scale-110 transition-transform duration-200" />
            <span className="text-muted-foreground">{formatBudget(request.budget_range)}</span>
          </div>
          
          {request.timeline && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-[#00eada] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-muted-foreground">{request.timeline}</span>
            </div>
          )}
          
          {request.organizer && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-[#00eada] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-muted-foreground">{request.organizer.organization_name}</span>
            </div>
          )}
        </div>

        {request.milestones && Array.isArray(request.milestones) && request.milestones.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Milestones</h4>
            <div className="space-y-1">
              {request.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border-l-2 border-l-[#00eada]/30">
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
            className="flex-1 border-[#00eada]/30 hover:border-[#00eada] hover:bg-[#00eada]/10 hover:text-[#00eada] transition-all duration-200 hover:shadow-md hover:shadow-[#00eada]/20"
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
