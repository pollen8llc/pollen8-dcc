
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  User, 
  DollarSign, 
  Clock, 
  Eye, 
  Send,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { deleteServiceRequest } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

interface RequestCardProps {
  request: ServiceRequest;
  type: 'incoming' | 'active' | 'completed';
  onDelete?: () => void;
}

const RequestCard = ({ request, type, onDelete }: RequestCardProps) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

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
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return <Clock className="h-4 w-4" />;
      case 'negotiating':
        return <MessageSquare className="h-4 w-4" />;
      case 'agreed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Building className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleViewRequest = () => {
    navigate(`/labr8/request/${request.id}/status`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteServiceRequest(request.id);
      toast({
        title: "Request Deleted",
        description: "The service request has been deleted successfully",
      });
      onDelete?.();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete the request",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const canRespond = () => {
    return ['pending', 'assigned'].includes(request.status);
  };

  const getActionButton = () => {
    if (type === 'completed') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewRequest}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      );
    }

    if (canRespond()) {
      return (
        <Button 
          size="sm"
          onClick={handleViewRequest}
          className="bg-[#00eada] hover:bg-[#00eada]/90 text-black flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Respond
        </Button>
      );
    }

    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleViewRequest}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        View Status
      </Button>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getStatusColor(request.status)} border`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 font-medium">
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(request.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {request.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {request.budget_range?.min && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                ${request.budget_range.min.toLocaleString()}
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
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {request.organizer.organization_name}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {getActionButton()}
          
          {type === 'incoming' && request.status === 'pending' && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deleting ? 'Deleting...' : 'Decline'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
