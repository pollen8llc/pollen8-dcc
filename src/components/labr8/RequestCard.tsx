
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  DollarSign, 
  Building, 
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequestCardProps {
  request: ServiceRequest;
  type: 'incoming' | 'active' | 'completed';
}

const RequestCard = ({ request, type }: RequestCardProps) => {
  const navigate = useNavigate();

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'negotiating': return <AlertCircle className="h-4 w-4" />;
      case 'agreed': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewRequest = () => {
    if (type === 'active' || type === 'completed') {
      navigate(`/labr8/project/${request.id}`);
    } else {
      navigate(`/labr8/request/${request.id}/status`);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold line-clamp-1">{request.title}</h3>
              <Badge className={`${getStatusColor(request.status)} font-medium flex items-center gap-1`}>
                {getStatusIcon(request.status)}
                {request.status?.replace('_', ' ') || 'pending'}
              </Badge>
            </div>
            
            {request.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {request.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {request.organizer && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={request.organizer.logo_url} />
                    <AvatarFallback>
                      <Building className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{request.organizer.organization_name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatBudget(request.budget_range)}
              </div>
              {request.timeline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {request.timeline}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {type === 'incoming' ? 'Received' : 'Created'} {new Date(request.created_at).toLocaleDateString()}
          </span>
          <Button
            onClick={handleViewRequest}
            size="sm"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
          >
            {type === 'incoming' ? 'View Request' : 'View Project'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
