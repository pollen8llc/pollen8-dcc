import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Actv8ContactDisplay, useDeactivateContact } from "@/hooks/useActv8Contacts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";
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
import { MoreVertical, Pause, Play, Trash2, MapPin, TrendingUp, Route } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { relationshipTypes } from "@/services/actv8Service";

interface NetworkContactCardProps {
  contact: Actv8ContactDisplay;
  viewMode: 'grid' | 'list';
}

const strengthConfig: Record<string, { label: string; percentage: number; color: string }> = {
  thin: { label: 'New', percentage: 10, color: 'from-rose-500 to-orange-500' },
  growing: { label: 'Growing', percentage: 40, color: 'from-amber-500 to-yellow-500' },
  solid: { label: 'Strong', percentage: 70, color: 'from-emerald-500 to-teal-500' },
  thick: { label: 'Core', percentage: 100, color: 'from-primary to-cyan-400' },
};

export function NetworkContactCard({ contact }: NetworkContactCardProps) {
  const { deactivate } = useDeactivateContact();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(contact.status === 'paused');
  const [animatedStrength, setAnimatedStrength] = useState(0);
  const [animatedSegments, setAnimatedSegments] = useState(0);
  
  const relationshipType = relationshipTypes.find(rt => rt.id === contact.relationshipType);
  const currentStep = contact.currentStepIndex ?? 0;
  const totalSteps = contact.totalSteps ?? 4; // Default to 4 steps for Build Rapport
  const strengthData = strengthConfig[contact.connectionStrength] || strengthConfig.thin;

  // Animate progress bars on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedStrength(strengthData.percentage), 100);
    const timer2 = setTimeout(() => setAnimatedSegments(currentStep), 200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [strengthData.percentage, currentStep]);

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
        <Card className="cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm border-2 bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl group relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          
          {/* Paused overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
              <Badge variant="outline" className="bg-amber-500/20 border-amber-500/50 text-amber-500">
                <Pause className="h-3 w-3 mr-1" />
                Paused
              </Badge>
            </div>
          )}

          <CardContent className="p-5 relative z-10 flex flex-col">
            {/* Top section: Avatar + Info + Menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Avatar with strength ring */}
                <div className="relative flex-shrink-0">
                  <div className="ring-2 ring-offset-2 ring-offset-background ring-primary/30 group-hover:ring-primary/50 transition-all rounded-full">
                    <UnifiedAvatar 
                      userId={contact.affiliatedUserId} 
                      size={48} 
                    />
                  </div>
                  {/* Strength indicator dot */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background bg-gradient-to-r ${strengthData.color}`} />
                </div>

                {/* Contact info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">
                    {contact.name}
                  </h3>
                  {(contact.role || contact.company) && (
                    <p className="text-muted-foreground text-sm truncate">
                      {contact.role}{contact.role && contact.company && ' · '}{contact.company}
                    </p>
                  )}
                  {contact.location !== 'Not specified' && contact.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{contact.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Menu */}
              <div className="flex-shrink-0" onClick={handleMenuClick}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
              </div>
            </div>

            {/* Progress bars section - replaces category badges */}
            <div className="mt-4 pt-4 border-t border-border/50 min-h-[80px] flex flex-col gap-3">
              {/* Connection Strength Progress */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Connection Strength</span>
                  </div>
                  <span className="text-xs font-medium text-primary">{strengthData.label}</span>
                </div>
                <div className="relative h-2 w-full rounded-full overflow-hidden backdrop-blur-md bg-muted/30 border border-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${strengthData.color} shadow-[0_0_10px_rgba(20,184,166,0.3)] transition-all duration-700 ease-out relative overflow-hidden`}
                    style={{ width: `${animatedStrength}%` }}
                  >
                    {/* Animated shimmer */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        animation: "shimmer 2s infinite",
                        backgroundSize: "200% 100%"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Development Path Progress - Segmented */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Route className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {contact.developmentPathName || 'Build Rapport'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary">{currentStep}/{totalSteps} steps</span>
                </div>
                {/* Segmented progress bar */}
                <div className="flex gap-1 w-full">
                  {Array.from({ length: totalSteps }).map((_, index) => {
                    const isCompleted = index < animatedSegments;
                    const isCurrent = index === currentStep;
                    return (
                      <div
                        key={index}
                        className={`
                          relative h-2 flex-1 rounded-full overflow-hidden transition-all duration-500
                          ${isCompleted 
                            ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(20,184,166,0.5)]' 
                            : 'bg-muted/30 border border-white/10 backdrop-blur-md'
                          }
                          ${isCurrent && !isCompleted ? 'border-primary/50' : ''}
                        `}
                        style={{
                          transitionDelay: isCompleted ? `${index * 100}ms` : '0ms'
                        }}
                      >
                        {/* Glow effect for completed segments */}
                        {isCompleted && (
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
                            style={{
                              animation: "shimmer 2s infinite",
                              backgroundSize: "200% 100%"
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom row: Relationship type + Last interaction */}
              <div className="flex items-center justify-between mt-1">
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-5 bg-secondary/50">
                  {relationshipType?.label || contact.relationshipType}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {formatLastInteraction(contact.lastInteraction)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
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
