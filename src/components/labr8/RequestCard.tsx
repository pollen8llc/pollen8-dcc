
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Clock, 
  DollarSign, 
  Building, 
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { deleteServiceRequest } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

interface RequestCardProps {
  request: ServiceRequest;
  type: 'incoming' | 'active' | 'completed';
  onDelete?: () => void;
}

const RequestCard = ({ request, type, onDelete }: RequestCardProps) => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteRequest = async () => {
    if (!request || !session?.user?.id) return;
    
    setDeleting(true);
    try {
      await deleteServiceRequest(request.id);
      
      toast({
        title: "Request Deleted",
        description: "The service request has been deleted successfully"
      });
      
      if (onDelete) {
        onDelete();
      }
      
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  // Check if current user is the organizer who created this request
  const isOrganizer = session?.user?.id && request.organizer?.user_id === session.user.id;
  const canDelete = isOrganizer && request.status === 'pending';

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
          
          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Request
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Service Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{request.title}"? This action cannot be undone and will permanently remove the request.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteRequest}
                        disabled={deleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {deleting ? 'Deleting...' : 'Delete Request'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
