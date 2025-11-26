import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Bell, User, Building2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface CrossPlatformNotificationCardProps {
  notification: {
    id: string;
    title: string;
    message: string;
    notification_type: string;
    is_read: boolean;
    created_at: string;
    metadata: any;
  };
  onDelete: (id: string) => void;
}

export const CrossPlatformNotificationCard = ({ 
  notification, 
  onDelete 
}: CrossPlatformNotificationCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Extract reference from metadata
  const getReference = () => {
    const meta = notification.metadata || {};
    if (meta.contactName || meta.contact_name) {
      return { type: 'contact', name: meta.contactName || meta.contact_name };
    }
    if (meta.userName || meta.user_name) {
      return { type: 'user', name: meta.userName || meta.user_name };
    }
    if (meta.communityName || meta.community_name) {
      return { type: 'community', name: meta.communityName || meta.community_name };
    }
    return { type: 'general', name: 'N/A' };
  };

  const ref = getReference();
  const ReferenceIcon = ref.type === 'user' ? User : ref.type === 'community' ? Building2 : User;

  const handleDelete = () => {
    onDelete(notification.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="group bg-card border-border/50 hover:border-border hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <div className={`relative ${notification.is_read ? 'opacity-50' : ''}`}>
                <Bell className="h-4 w-4 text-primary" />
                {!notification.is_read && (
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-medium text-sm leading-tight ${
                  notification.is_read ? 'text-foreground' : 'text-primary'
                }`}>
                  {notification.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {notification.message}
              </p>
              
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">{format(new Date(notification.created_at), "MMM d, h:mm a")}</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground/70 capitalize">{notification.notification_type.replace(/_/g, ' ')}</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground/70 capitalize flex items-center gap-1">
                  <ReferenceIcon className="h-3 w-3" />
                  {ref.name}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this notification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
