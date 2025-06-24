
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Edit3
} from 'lucide-react';

interface ServiceRequestActionsProps {
  request: ServiceRequest;
  onAccept?: (requestId: string) => void;
  onDecline?: (requestId: string) => void;
  onNegotiate?: (requestId: string) => void;
  onMessage?: (requestId: string) => void;
  onEdit?: (requestId: string) => void;
  onUpdate?: () => void;
  isServiceProvider?: boolean;
  isOrganizer?: boolean;
}

const ServiceRequestActions: React.FC<ServiceRequestActionsProps> = ({
  request,
  onAccept,
  onDecline,
  onNegotiate,
  onMessage,
  onEdit,
  isServiceProvider,
  isOrganizer
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'negotiating': return 'bg-purple-100 text-purple-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(request.status)}>
          {request.status.toUpperCase()}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {isServiceProvider && request.status === 'pending' && (
          <>
            {onAccept && (
              <Button 
                size="sm" 
                onClick={() => onAccept(request.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
            )}
            
            {onNegotiate && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onNegotiate(request.id)}
              >
                <Clock className="h-4 w-4 mr-1" />
                Negotiate
              </Button>
            )}
            
            {onDecline && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDecline(request.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            )}
          </>
        )}

        {isOrganizer && onEdit && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(request.id)}
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit Request
          </Button>
        )}

        {onMessage && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onMessage(request.id)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestActions;
