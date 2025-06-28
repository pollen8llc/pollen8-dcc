
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceRequest } from '@/types/modul8';
import { DollarSign, Clock, Users, MessageSquare, Eye } from 'lucide-react';
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
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'agreed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'none':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'affiliated':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
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
    <Card className="group h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {request.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2">
              <Badge className={`${getStatusColor(request.status)} text-xs font-semibold px-3 py-1`}>
                {request.status}
              </Badge>
              <Badge className={`${getEngagementColor(request.engagement_status)} text-xs font-semibold px-3 py-1`} variant="outline">
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
      
      <CardContent className="space-y-6">
        {request.description && (
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
            {request.description}
          </p>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-muted-foreground font-medium">{formatBudget(request.budget_range)}</span>
          </div>
          
          {request.timeline && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground font-medium">{request.timeline}</span>
            </div>
          )}
          
          {request.organizer && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground font-medium">{request.organizer.organization_name}</span>
            </div>
          )}
        </div>

        {request.milestones && Array.isArray(request.milestones) && request.milestones.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Project Milestones</h4>
            <div className="space-y-2">
              {request.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/30">
                  {typeof milestone === 'string' ? milestone : JSON.stringify(milestone)}
                </div>
              ))}
              {request.milestones.length > 3 && (
                <div className="text-xs text-muted-foreground font-medium">
                  +{request.milestones.length - 3} more milestones
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t border-border/30">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full justify-center gap-3 text-base font-semibold py-3 h-auto border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate(`/modul8/request/${request.id}`)}
          >
            <Eye className="h-5 w-5" />
            View Project Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestCard;
