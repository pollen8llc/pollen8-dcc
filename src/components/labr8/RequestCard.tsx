
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
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
  Trash2,
  MessageSquare,
  FileText
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
      case 'negotiating': return <MessageSquare className="h-4 w-4" />;
      case 'agreed': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'in_progress': return <FileText className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewRequest = () => {
    // Navigate to the new request status page for full negotiation flow
    if (request.service_provider_id) {
      navigate(`/labr8/${request.service_provider_id}/${request.id}/status`);
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

  // Allow delete if organizer and status is pending OR cancelled
  const canDelete = isOrganizer && (request.status === 'pending' || request.status === 'cancelled');

  const getActionButtonText = () => {
    switch (request.status) {
      case 'pending':
        return 'Respond';
      case 'negotiating':
        return 'Continue';
      case 'agreed':
        return 'View Agreement';
      case 'in_progress':
        return 'View Project';
      case 'completed':
        return 'View Completed';
      default:
        return 'View Request';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{request.title}</h3>
              <Badge className={`${getStatusColor(request.status)} font-medium flex items-center gap-1 text-xs sm:text-sm self-start`}>
                {getStatusIcon(request.status)}
                <span className="hidden sm:inline">{request.status?.replace('_', ' ') || 'pending'}</span>
                <span className="sm:hidden">{request.status?.replace('_', ' ').slice(0, 4) || 'pend'}</span>
              </Badge>
            </div>
            
            {request.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {request.description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-3">
              {request.organizer && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage src={request.organizer.logo_url} />
                    <AvatarFallback>
                      <Building className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1 text-xs sm:text-sm">{request.organizer.organization_name}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{formatBudget(request.budget_range)}</span>
              </div>
              {request.timeline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{request.timeline}</span>
                </div>
              )}
            </div>
          </div>
          
          {canDelete && (
            <div className="self-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
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
                        <AlertDialogTitle>
                          Delete Service Request
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {request.status === "cancelled" ? (
                            <>
                              Are you sure you want to permanently delete the cancelled request "
                              {request.title}"? This action cannot be undone and will permanently remove the request.
                            </>
                          ) : (
                            <>
                              Are you sure you want to delete "{request.title}"? This action cannot be undone and will permanently remove the request.
                            </>
                          )}
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
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {type === 'incoming' ? 'Received' : 'Created'} {new Date(request.created_at).toLocaleDateString()}
          </span>
          <Button
            onClick={handleViewRequest}
            size="sm"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium text-xs sm:text-sm w-full sm:w-auto"
          >
            {getActionButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
