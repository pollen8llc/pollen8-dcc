import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Bell, User, Building2, Check, X, Trophy } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  onApprove?: (contactId: string) => void;
  onReject?: (contactId: string) => void;
}

export const CrossPlatformNotificationCard = ({ 
  notification, 
  onDelete,
  onApprove,
  onReject
}: CrossPlatformNotificationCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const isPathCompletion = notification.notification_type === 'actv8_path_complete';
  
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

  const getStatusColor = () => {
    if (!notification.is_read) return 'bg-primary shadow-[0_0_8px_rgba(0,234,218,0.4)]';
    return 'bg-muted-foreground/50';
  };

  // Handle click for path completion - navigate to profile
  const handleCardClick = () => {
    if (isPathCompletion && notification.metadata?.actv8ContactId) {
      navigate(`/rel8/actv8/${notification.metadata.actv8ContactId}/profile`);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200",
          isPathCompletion && "border-2 animate-gradient-border-celebration cursor-pointer bg-gradient-to-r from-primary/5 via-accent/5 to-violet-500/5"
        )}
        onClick={isPathCompletion ? handleCardClick : undefined}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Status Indicator */}
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getStatusColor()} ${!notification.is_read ? 'animate-pulse' : ''}`} />
            
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {isPathCompletion ? (
                <Trophy className="h-4 w-4 text-primary" />
              ) : (
                <Bell className={`h-4 w-4 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header - Stack on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                <h3 className={cn(
                  "font-medium text-sm leading-tight sm:truncate sm:flex-1",
                  isPathCompletion 
                    ? "text-primary"
                    : notification.is_read ? 'text-foreground' : 'text-primary'
                )}>
                  {notification.title}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(notification.created_at), "h:mm a")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                    className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-destructive/10 hover:text-destructive transition-opacity`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Message */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
              
              {/* Metadata - Stack on mobile */}
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-1.5 text-xs`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-primary/80 capitalize">
                    {notification.notification_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-muted-foreground/50">|</span>
                  <ReferenceIcon className="h-3 w-3 text-muted-foreground/70" />
                  <span className="text-muted-foreground/70 capitalize">
                    {ref.type}: {ref.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {!isMobile && <span className="text-muted-foreground/50">|</span>}
                  <span className="text-muted-foreground/70 font-mono text-[10px]">
                    #{notification.id.slice(0, 6)}
                  </span>
                </div>
              </div>

              {/* Contact Details for invite_contact */}
              {notification.notification_type === 'invite_contact' && notification.metadata?.contact_id && (
                <>
                  <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                    <div className="text-xs space-y-1.5">
                      {notification.metadata.contact_email && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="text-foreground font-medium">{notification.metadata.contact_email}</span>
                        </div>
                      )}
                      {notification.metadata.contact_phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="text-foreground font-medium">{notification.metadata.contact_phone}</span>
                        </div>
                      )}
                      {notification.metadata.contact_tags && notification.metadata.contact_tags.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground shrink-0">Tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {notification.metadata.contact_tags.map((tag: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Approve/Reject Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-green-500 border-green-500/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/50 transition-all"
                      onClick={() => onApprove?.(notification.metadata.contact_id)}
                    >
                      <Check className="h-4 w-4 mr-1.5" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
                      onClick={() => onReject?.(notification.metadata.contact_id)}
                    >
                      <X className="h-4 w-4 mr-1.5" /> Reject
                    </Button>
                  </div>
                </>
              )}

              {/* Path Completion Action */}
              {isPathCompletion && notification.metadata?.actv8ContactId && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full bg-gradient-to-r from-primary/10 via-accent/10 to-violet-500/10 border-primary/30 hover:border-primary/50 hover:bg-primary/20 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/rel8/actv8/${notification.metadata.actv8ContactId}/profile`);
                    }}
                  >
                    <Trophy className="h-4 w-4 mr-1.5 text-primary" /> 
                    <span className="bg-gradient-to-r from-primary via-accent to-violet-400 bg-clip-text text-transparent font-medium">
                      View Relationship
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass-morphism border-border/50">
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
