import { useState } from "react";
import { Link } from "react-router-dom";
import { Actv8ContactDisplay, useDeactivateContact } from "@/hooks/useActv8Contacts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreVertical, Pause, Play, Trash2, ChevronRight, TrendingUp } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { relationshipTypes } from "@/services/actv8Service";

interface NetworkContactCardProps {
  contact: Actv8ContactDisplay;
  viewMode: 'grid' | 'list';
}

const strengthColors: Record<string, string> = {
  thin: 'bg-red-500',
  growing: 'bg-amber-500',
  solid: 'bg-emerald-500',
  thick: 'bg-primary',
};

const strengthLabels: Record<string, string> = {
  thin: 'New',
  growing: 'Growing',
  solid: 'Strong',
  thick: 'Core',
};

export function NetworkContactCard({ contact }: NetworkContactCardProps) {
  const { deactivate } = useDeactivateContact();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(contact.status === 'paused');
  
  const relationshipType = relationshipTypes.find(rt => rt.id === contact.relationshipType);
  const currentStep = contact.currentStepIndex ?? 0;
  const totalSteps = contact.totalSteps ?? 1;
  const pathProgress = (currentStep / totalSteps) * 100;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastInteraction = (dateStr: string) => {
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleRemove = async () => {
    await deactivate(contact.id, contact.name);
    setShowRemoveDialog(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    setShowPauseDialog(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <Link to={`/rel8/actv8/${contact.id}/profile`}>
        <div className="notification-card group">
          <div className="p-4">
            {/* Top Row: Avatar + Name + Menu */}
            <div className="flex items-start gap-3">
              {/* Avatar with strength indicator */}
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-background">
                  <AvatarFallback className="bg-secondary text-foreground font-semibold">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                {/* Strength dot */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${strengthColors[contact.connectionStrength]}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {contact.name}
                  </h3>
                  {isPaused && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-amber-500 border-amber-500/50 shrink-0">
                      Paused
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.role} · {contact.company}
                </p>
              </div>

              {/* Menu + Chevron */}
              <div className="flex items-center gap-1" onClick={handleMenuClick}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="icon-button h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 bg-popover border border-border">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPauseDialog(true);
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowRemoveDialog(true);
                      }}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Bottom Row: Stats */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
              {/* Connection Strength */}
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {strengthLabels[contact.connectionStrength]}
                </span>
              </div>

              {/* Relationship Type */}
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-5 bg-secondary/80">
                {relationshipType?.label || contact.relationshipType}
              </Badge>

              {/* Path Progress */}
              {contact.developmentPathName && (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pathProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {currentStep}/{totalSteps}
                  </span>
                </div>
              )}

              {/* Last Interaction - Only on larger screens */}
              <span className="text-[10px] text-muted-foreground hidden sm:block ml-auto">
                {formatLastInteraction(contact.lastInteraction)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Remove Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="md-surface-2 max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Actv8?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {contact.name} from your active relationships. You can add them back anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemove} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pause Dialog */}
      <AlertDialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <AlertDialogContent className="md-surface-2 max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>{isPaused ? 'Resume' : 'Pause'} Development?</AlertDialogTitle>
            <AlertDialogDescription>
              {isPaused 
                ? `Resume developing your relationship with ${contact.name}.`
                : `Pause ${contact.name}. They'll stay in your list but won't appear in active tasks.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePauseResume} className="rounded-xl">
              {isPaused ? 'Resume' : 'Pause'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
