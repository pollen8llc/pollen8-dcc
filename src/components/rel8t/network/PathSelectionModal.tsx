import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Check, Coffee, Users, Handshake, CalendarCheck, Lock, SkipForward, AlertTriangle } from "lucide-react";
import { getDevelopmentPaths, getAvailablePaths, skipCurrentPath, DevelopmentPath } from "@/services/actv8Service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PathSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPath: (pathId: string) => void;
  currentPathId?: string;
  actv8ContactId?: string;
  currentTier?: number;
  hasCurrentPath?: boolean;
  isPathComplete?: boolean;
}

// Check if a path is the Build Rapport meeting-focused path
const isBuildRapportPath = (pathId: string) => pathId === 'build_rapport';

// Get icon for Build Rapport steps
const getBuildRapportStepIcon = (index: number) => {
  const icons = [Coffee, Users, Handshake, CalendarCheck];
  return icons[index] || Coffee;
};

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth",
  3: "Professional",
  4: "Advanced",
};

const SKIP_REASONS = [
  { id: "already_established", label: "Already have established rapport", description: "Relationship is already beyond this stage" },
  { id: "not_relevant", label: "Path not relevant", description: "This path doesn't fit the relationship type" },
  { id: "contact_unresponsive", label: "Contact unresponsive", description: "Unable to engage with this contact currently" },
  { id: "priorities_changed", label: "Priorities changed", description: "Focus has shifted to other relationships" },
] as const;

export function PathSelectionModal({
  open,
  onOpenChange,
  onSelectPath,
  currentPathId,
  actv8ContactId,
  currentTier = 1,
  hasCurrentPath = false,
  isPathComplete = false
}: PathSelectionModalProps) {
  const queryClient = useQueryClient();
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [skipReason, setSkipReason] = useState("");

  const { data: pathData, isLoading } = useQuery({
    queryKey: ['available-paths', actv8ContactId],
    queryFn: async () => {
      if (actv8ContactId) {
        return getAvailablePaths(actv8ContactId);
      }
      const allPaths = await getDevelopmentPaths();
      return {
        available: allPaths.filter(p => p.tier <= currentTier + 1),
        locked: allPaths.filter(p => p.tier > currentTier + 1),
        currentTier,
      };
    },
    enabled: open,
  });

  const skipMutation = useMutation({
    mutationFn: async () => {
      if (!actv8ContactId) throw new Error("No contact ID");
      return skipCurrentPath(actv8ContactId, skipReason || undefined);
    },
    onSuccess: () => {
      toast.success("Path skipped", { description: "You can now select a new path" });
      queryClient.invalidateQueries({ queryKey: ['actv8-contact', actv8ContactId] });
      queryClient.invalidateQueries({ queryKey: ['available-paths', actv8ContactId] });
      setShowSkipDialog(false);
      setSkipReason("");
    },
    onError: (error) => {
      toast.error("Failed to skip path", { description: String(error) });
    },
  });

  // Can only select a new path if no current path OR path is complete
  const isPathInProgress = hasCurrentPath && !isPathComplete;

  const handleSelect = (pathId: string) => {
    if (isPathInProgress && pathId !== currentPathId) {
      toast.error("Complete or skip your current path first", {
        description: "Use the Skip Path option if you want to change paths."
      });
      return;
    }
    onSelectPath(pathId);
    onOpenChange(false);
  };

  const handleSkipConfirm = () => {
    skipMutation.mutate();
  };

  const strengthLabels: Record<string, string> = {
    growing: 'Growing',
    solid: 'Solid',
    thick: 'Deep Bond'
  };

  const availablePaths = pathData?.available || [];
  const lockedPaths = pathData?.locked || [];
  const effectiveTier = pathData?.currentTier || currentTier;

  // Group paths by tier
  const pathsByTier = availablePaths.reduce((acc, path) => {
    const tier = path.tier || 1;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(path);
    return acc;
  }, {} as Record<number, DevelopmentPath[]>);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
            <DialogTitle className="text-lg sm:text-xl">Choose Development Path</DialogTitle>
            <DialogDescription className="text-sm">
              Select a path to guide your relationship development. Paths unlock as you progress.
            </DialogDescription>
            {/* Tier Progress Indicator */}
            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3, 4].map((tier) => (
                <div
                  key={tier}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-colors",
                    tier <= effectiveTier ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current Tier: {tierLabels[effectiveTier] || `Tier ${effectiveTier}`}
            </p>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6 space-y-6">
              {/* Path in Progress Warning */}
              {isPathInProgress && (
                <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <p className="text-sm text-muted-foreground">
                    You have a path in progress. Complete all steps or use <strong>Skip Path</strong> to change paths.
                  </p>
                </div>
              )}
              {/* Skip Current Path Option */}
              {hasCurrentPath && actv8ContactId && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-center gap-2">
                    <SkipForward className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-700 dark:text-amber-300">
                      Want to skip the current path?
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSkipDialog(true)}
                    className="text-amber-600 border-amber-500/50 hover:bg-amber-500/20"
                  >
                    Skip Path
                  </Button>
                </div>
              )}

              {/* Available Paths by Tier */}
              {Object.entries(pathsByTier)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([tier, paths]) => (
                  <div key={tier}>
                    <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      {tierLabels[Number(tier)] || `Tier ${tier}`}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {paths.map((path) => {
                        const isCurrent = path.id === currentPathId;
                        const isNextTier = path.tier > effectiveTier;
                        return (
                          <button
                            key={path.id}
                            onClick={() => handleSelect(path.id)}
                            disabled={(isNextTier && !hasCurrentPath) || (isPathInProgress && !isCurrent)}
                            className={cn(
                              "text-left p-3 sm:p-4 rounded-lg border transition-all",
                              "hover:border-primary/50 hover:bg-primary/5",
                              "focus:outline-none focus:ring-2 focus:ring-primary/20",
                              "disabled:opacity-50 disabled:cursor-not-allowed",
                              isCurrent 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border/40 bg-card/30'
                            )}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                              <h4 className="font-medium text-sm sm:text-base leading-tight">{path.name}</h4>
                              <div className="flex items-center gap-1">
                                {path.is_required && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded">
                                    REQUIRED
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="shrink-0 flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                    <Check className="h-3 w-3" />
                                    <span className="hidden sm:inline">CURRENT</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{path.description}</p>
                            
                            {/* Step indicators - show meeting icons for Build Rapport */}
                            <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                              {isBuildRapportPath(path.id) ? (
                                path.steps?.map((_, index) => {
                                  const Icon = getBuildRapportStepIcon(index);
                                  return (
                                    <div
                                      key={index}
                                      className="h-5 sm:h-6 flex-1 rounded bg-primary/10 flex items-center justify-center max-w-8"
                                    >
                                      <Icon className="h-3 w-3 text-primary" />
                                    </div>
                                  );
                                })
                              ) : (
                                path.steps?.map((_, index) => (
                                  <div
                                    key={index}
                                    className="h-1 sm:h-1.5 flex-1 rounded-full bg-muted max-w-8"
                                  />
                                ))
                              )}
                            </div>
                            
                            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                              <span>{path.steps?.length || 0} steps</span>
                              <span>→ {strengthLabels[path.target_strength] || path.target_strength}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Locked Paths */}
              {lockedPaths.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Locked Paths
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {lockedPaths.map((path) => (
                      <div
                        key={path.id}
                        className="text-left p-3 sm:p-4 rounded-lg border border-border/20 bg-muted/20 opacity-60"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                          <h4 className="font-medium text-sm sm:text-base leading-tight text-muted-foreground">
                            {path.name}
                          </h4>
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{path.description}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Unlocks at {tierLabels[path.tier] || `Tier ${path.tier}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Skip Path Confirmation Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Skip Current Path?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Skipping a path will be recorded in this contact's history. You'll advance to the next tier
                  and can select a different path.
                </p>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Why are you skipping this path?
                  </p>
                  <RadioGroup
                    value={skipReason}
                    onValueChange={setSkipReason}
                    className="space-y-2"
                  >
                    {SKIP_REASONS.map((reason) => (
                      <div
                        key={reason.id}
                        className="flex items-start space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSkipReason(reason.id)}
                      >
                        <RadioGroupItem value={reason.id} id={reason.id} className="mt-0.5" />
                        <Label htmlFor={reason.id} className="cursor-pointer flex-1">
                          <span className="font-medium text-foreground">{reason.label}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {reason.description}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkipConfirm}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={skipMutation.isPending || !skipReason}
            >
              {skipMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <SkipForward className="h-4 w-4 mr-2" />
              )}
              Skip Path
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
