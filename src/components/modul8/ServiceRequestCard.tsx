
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User } from 'lucide-react';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onView?: (request: ServiceRequest) => void;
  onEdit?: (request: ServiceRequest) => void;
  onDelete?: (request: ServiceRequest) => void;
}

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
          <Badge className={getStatusColor(request.status)}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {request.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {request.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {request.budget_range && (
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>
                  ${request.budget_range.min || 0} - ${request.budget_range.max || 0}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(request.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {request.organizer && (
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{request.organizer.organization_name}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          {onView && (
            <Button size="sm" variant="outline" onClick={() => onView(request)}>
              View
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(request)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={() => onDelete(request)}>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestCard;
