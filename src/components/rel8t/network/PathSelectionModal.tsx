import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export function PathSelectionModal({
  open,
  onOpenChange,
  onSelectPath,
  currentPathId,
  actv8ContactId,
  currentTier = 1,
  hasCurrentPath = false
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
      queryClient.invalidateQueries({ queryKey: ['actv8-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['available-paths'] });
      setShowSkipDialog(false);
      setSkipReason("");
    },
    onError: (error) => {
      toast.error("Failed to skip path", { description: String(error) });
    },
  });

  const handleSelect = (pathId: string) => {
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
                            disabled={isNextTier && !hasCurrentPath}
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
            <AlertDialogDescription className="space-y-3">
              <p>
                Skipping a path will be recorded in this contact's history. You'll advance to the next tier
                and can select a different path.
              </p>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Reason for skipping (optional)
                </label>
                <Textarea
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value)}
                  placeholder="e.g., Already have established rapport, relationship started professionally..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkipConfirm}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={skipMutation.isPending}
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
