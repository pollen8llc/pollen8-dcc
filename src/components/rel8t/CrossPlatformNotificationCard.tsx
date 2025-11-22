import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, User } from "lucide-react";
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
  
  // Extract contact name from metadata if available
  const contactName = notification.metadata?.contactName || 
                      notification.metadata?.contact_name || 
                      notification.metadata?.name || 
                      "N/A";

  const handleDelete = () => {
    onDelete(notification.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1">
                <Mail className={`h-4 w-4 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-semibold truncate ${notification.is_read ? 'text-foreground' : 'text-primary'}`}>
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                      New
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {notification.notification_type.replace(/_/g, ' ')}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                
                <div className="text-xs text-muted-foreground">
                  {format(new Date(notification.created_at), "PPP 'at' p")}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-3 bg-muted/30 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-mono">ID: {notification.id.slice(0, 8)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>Contact: {contactName}</span>
          </div>
        </CardFooter>
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
