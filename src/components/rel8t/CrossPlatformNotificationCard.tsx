import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Bell, User, Building2, Check, X, Trophy, Clock, CalendarClock, ExternalLink, RotateCcw } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
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
  onMarkRead?: (id: string) => void;
}

// Status color helper inspired by Orbits page
function getStatusColor(type: string, isRead: boolean): string {
  if (type === 'actv8_path_complete') {
    return "bg-violet-500/20 text-violet-400 border-violet-500/30";
  }
  if (type === 'invite_contact') {
    return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  }
  if (!isRead) {
    return "bg-primary/20 text-primary border-primary/30";
  }
  return "bg-muted text-muted-foreground border-border/50";
}

// Type badge color
function getTypeBadgeColor(type: string): string {
  switch (type) {
    case 'actv8_path_complete':
      return "bg-violet-500/15 text-violet-400 border-violet-500/30";
    case 'invite_contact':
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case 'outreach_reminder':
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case 'level_switch':
      return "bg-teal-500/15 text-teal-400 border-teal-500/30";
    default:
      return "bg-muted text-muted-foreground border-border/50";
  }
}

export const CrossPlatformNotificationCard = ({ 
  notification, 
  onDelete,
  onApprove,
  onReject,
  onMarkRead
}: CrossPlatformNotificationCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const isPathCompletion = notification.notification_type === 'actv8_path_complete';
  const isInviteContact = notification.notification_type === 'invite_contact';
  
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
    return null;
  };

  const ref = getReference();
  const ReferenceIcon = ref?.type === 'user' ? User : ref?.type === 'community' ? Building2 : User;

  const handleDelete = () => {
    onDelete(notification.id);
    setShowDeleteDialog(false);
  };

  // Handle click for path completion - navigate to profile
  const handleViewProfile = () => {
    if (isPathCompletion && notification.metadata?.actv8ContactId) {
      navigate(`/rel8/actv8/${notification.metadata.actv8ContactId}/profile`);
    }
  };

  const createdDate = new Date(notification.created_at);
  const typeLabel = notification.notification_type.replace(/_/g, ' ');

  return (
    <>
      <Card 
        className={cn(
          "border transition-all duration-200",
          isPathCompletion 
            ? "border-2 animate-gradient-border-celebration bg-gradient-to-r from-primary/5 via-accent/5 to-violet-500/5" 
            : "border-border/30 bg-card/40 backdrop-blur-md hover:bg-card/50",
          !notification.is_read && "shadow-lg shadow-primary/10"
        )}
      >
        <CardContent className="p-4 space-y-3">
          {/* ROW 1: Header - Type Badge, Title, Time Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Status dot */}
              <div className={cn(
                "w-2.5 h-2.5 rounded-full shrink-0",
                !notification.is_read ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
              )} />
              
              {/* Type icon */}
              {isPathCompletion ? (
                <Trophy className="h-4 w-4 text-violet-400 shrink-0" />
              ) : isInviteContact ? (
                <User className="h-4 w-4 text-amber-400 shrink-0" />
              ) : (
                <Bell className="h-4 w-4 text-primary shrink-0" />
              )}
              
              {/* Title */}
              <h3 className={cn(
                "font-semibold text-sm truncate",
                isPathCompletion 
                  ? "bg-gradient-to-r from-primary via-accent to-violet-400 bg-clip-text text-transparent"
                  : !notification.is_read ? "text-foreground" : "text-muted-foreground"
              )}>
                {notification.title?.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim() || notification.title}
              </h3>
            </div>
            
            {/* Time badge */}
            <Badge variant="outline" className="shrink-0 text-xs bg-muted/50 border-border/50">
              <CalendarClock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(createdDate, { addSuffix: true })}
            </Badge>
          </div>

          {/* ROW 2: Message and Metadata */}
          <div className="space-y-2 pl-5">
            {/* Message */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {notification.message}
            </p>
            
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type badge */}
              <Badge variant="outline" className={cn("text-xs capitalize", getTypeBadgeColor(notification.notification_type))}>
                {typeLabel}
              </Badge>
              
              {/* Reference badge */}
              {ref && (
                <Badge variant="outline" className="text-xs bg-card/60 border-border/50">
                  <ReferenceIcon className="h-3 w-3 mr-1" />
                  {ref.name}
                </Badge>
              )}
              
              {/* ID badge */}
              <Badge variant="outline" className="text-xs font-mono bg-card/60 border-border/50 text-muted-foreground">
                #{notification.id.slice(0, 6)}
              </Badge>
            </div>
          </div>

          {/* ROW 3: Contact Details for invite_contact (Timeline/Details section) */}
          {isInviteContact && notification.metadata?.contact_id && (
            <div className="pl-5 pt-2 border-t border-border/30 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {notification.metadata.contact_email && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Email:</span>
                    <span className="text-foreground font-medium truncate">{notification.metadata.contact_email}</span>
                  </div>
                )}
                {notification.metadata.contact_phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Phone:</span>
                    <span className="text-foreground font-medium">{notification.metadata.contact_phone}</span>
                  </div>
                )}
              </div>
              {notification.metadata.contact_tags && notification.metadata.contact_tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {notification.metadata.contact_tags.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Path Completion Details */}
          {isPathCompletion && notification.metadata?.pathName && (
            <div className="pl-5 pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                  <Trophy className="h-3 w-3 mr-1" />
                  {notification.metadata.pathName}
                </Badge>
                {notification.metadata.contactName && (
                  <span className="text-muted-foreground">
                    completed for <span className="text-foreground font-medium">{notification.metadata.contactName}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ROW 4: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
            {/* Invite Contact Actions */}
            {isInviteContact && notification.metadata?.contact_id && (
              <>
                <Button 
                  size="sm" 
                  className="flex-1 sm:flex-none bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 hover:text-teal-300"
                  onClick={() => onApprove?.(notification.metadata.contact_id)}
                >
                  <Check className="h-4 w-4 mr-1.5" /> Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 sm:flex-none text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-300"
                  onClick={() => onReject?.(notification.metadata.contact_id)}
                >
                  <X className="h-4 w-4 mr-1.5" /> Reject
                </Button>
              </>
            )}

            {/* Path Completion Action */}
            {isPathCompletion && notification.metadata?.actv8ContactId && (
              <Button 
                size="sm" 
                className="flex-1 sm:flex-none bg-gradient-to-r from-primary/20 via-accent/20 to-violet-500/20 border border-primary/30 hover:from-primary/30 hover:via-accent/30 hover:to-violet-500/30"
                onClick={handleViewProfile}
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                <span className="bg-gradient-to-r from-primary via-accent to-violet-400 bg-clip-text text-transparent font-medium">
                  View Relationship
                </span>
              </Button>
            )}

            {/* Mark as Read (if not read) */}
            {!notification.is_read && onMarkRead && (
              <Button 
                size="sm" 
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onMarkRead(notification.id)}
              >
                <Check className="h-4 w-4 mr-1.5" /> Mark Read
              </Button>
            )}

            {/* Spacer for right-aligned delete */}
            <div className="flex-1" />

            {/* Clear/Delete Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Notification?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this notification from your feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
