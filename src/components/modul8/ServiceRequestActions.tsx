
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, X, Archive } from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { closeServiceRequest, deleteServiceRequest } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

interface ServiceRequestActionsProps {
  request: ServiceRequest;
  onUpdate: () => void;
  canDelete?: boolean;
}

const ServiceRequestActions: React.FC<ServiceRequestActionsProps> = ({ 
  request, 
  onUpdate,
  canDelete = true
}) => {
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    setLoading(true);
    try {
      await closeServiceRequest(request.id);
      toast({
        title: "Success",
        description: "Service request has been closed"
      });
      onUpdate();
    } catch (error) {
      console.error('Error closing request:', error);
      toast({
        title: "Error",
        description: "Failed to close service request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowCloseDialog(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteServiceRequest(request.id);
      toast({
        title: "Success",
        description: "Service request has been deleted"
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete service request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const canCloseRequest = request.status !== 'cancelled' && request.status !== 'completed';
  const canDeleteRequest = canDelete && request.engagement_status === 'none' && !request.service_provider_id;

  if (!canCloseRequest && !canDeleteRequest) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canCloseRequest && (
            <DropdownMenuItem onClick={() => setShowCloseDialog(true)}>
              <Archive className="h-4 w-4 mr-2" />
              Close Request
            </DropdownMenuItem>
          )}
          {canDeleteRequest && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Delete Request
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Service Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close "{request.title}"? This will mark the request as cancelled 
              but keep it for historical records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClose}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Closing...' : 'Close Request'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{request.title}"? This will completely 
              remove the request and cannot be undone. This is only possible because there has been 
              no engagement yet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete Request'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceRequestActions;
