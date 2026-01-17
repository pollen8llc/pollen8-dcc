import { useQuery } from "@tanstack/react-query";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Loader2, Check, Coffee, Users, Handshake, CalendarCheck, Lock, Target } from "lucide-react";
import { getDevelopmentPaths, getAvailablePaths, DevelopmentPath } from "@/services/actv8Service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PathSelectionAccordionProps {
  onSelectPath: (pathId: string) => void;
  currentPathId?: string;
  currentPathName?: string;
  actv8ContactId?: string;
  currentTier?: number;
  hasCurrentPath?: boolean;
  isPathComplete?: boolean;
  onPathSelected?: () => void;
}

const isBuildRapportPath = (pathId: string) => pathId === 'build_rapport';

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

export function PathSelectionAccordion({
  onSelectPath,
  currentPathId,
  currentPathName,
  actv8ContactId,
  currentTier = 1,
  hasCurrentPath = false,
  isPathComplete = false,
  onPathSelected
}: PathSelectionAccordionProps) {
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
  });

  // Allow path switching after level change - no blocking
  const handleSelect = (pathId: string) => {
    if (pathId === currentPathId) {
      toast.info("This path is already selected");
      return;
    }
    onSelectPath(pathId);
    onPathSelected?.();
  };

  const strengthLabels: Record<string, string> = {
    growing: 'Growing',
    solid: 'Solid',
    thick: 'Deep Bond'
  };

  const availablePaths = pathData?.available || [];
  const lockedPaths = pathData?.locked || [];
  const effectiveTier = pathData?.currentTier || currentTier;

  const pathsByTier = availablePaths.reduce((acc, path) => {
    const tier = path.tier || 1;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(path);
    return acc;
  }, {} as Record<number, DevelopmentPath[]>);

  // Determine if we should show the nudge animation (no path selected)
  const shouldNudge = !hasCurrentPath && !currentPathId;

  return (
    <AccordionItem 
      value="path-selection" 
      className={cn(
        "border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden",
        shouldNudge 
          ? "animate-pulse-border-teal border-[hsl(174,84%,45%)/0.5]" 
          : "border-primary/20"
      )}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
        <div className="flex items-center gap-3 text-left">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-medium text-sm">Select a Path</span>
            {hasCurrentPath && (
              <span className="block text-xs text-muted-foreground">
                {tierLabels[currentTier] || `Tier ${currentTier}`}
                {isPathComplete && " • Complete"}
                {!isPathComplete && " • In Progress"}
              </span>
            )}
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Tier Progress Indicator */}
            <div>
              <div className="flex items-center gap-2">
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
            </div>

            {/* Removed: Path in Progress blocking notice - users can now freely switch paths */}

            {/* Available Paths by Tier */}
            {Object.entries(pathsByTier)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([tier, paths]) => (
                <div key={tier}>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {tierLabels[Number(tier)] || `Tier ${tier}`}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {paths.map((path) => {
                      const isCurrent = path.id === currentPathId;
                      const isNextTier = path.tier > effectiveTier;
                      return (
                        <button
                          key={path.id}
                          onClick={() => handleSelect(path.id)}
                          disabled={isNextTier && !hasCurrentPath}
                          className={cn(
                            "text-left p-3 rounded-lg border transition-all",
                            "hover:border-primary/50 hover:bg-primary/5",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            isCurrent 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border/40 bg-card/30'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-medium text-sm leading-tight">{path.name}</h4>
                            <div className="flex items-center gap-1">
                              {path.is_required && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded">
                                  REQUIRED
                                </span>
                              )}
                              {isCurrent && (
                                <span className="shrink-0 flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{path.description}</p>
                          
                          {/* Step indicators */}
                          <div className="flex items-center gap-0.5 mb-1.5">
                            {isBuildRapportPath(path.id) ? (
                              path.steps?.map((_, index) => {
                                const Icon = getBuildRapportStepIcon(index);
                                return (
                                  <div
                                    key={index}
                                    className="h-5 flex-1 rounded bg-primary/10 flex items-center justify-center max-w-8"
                                  >
                                    <Icon className="h-3 w-3 text-primary" />
                                  </div>
                                );
                              })
                            ) : (
                              path.steps?.map((_, index) => (
                                <div
                                  key={index}
                                  className="h-1 flex-1 rounded-full bg-muted max-w-8"
                                />
                              ))
                            )}
                          </div>
                          
                          <div className="flex justify-between text-[10px] text-muted-foreground">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lockedPaths.map((path) => (
                    <div
                      key={path.id}
                      className="text-left p-3 rounded-lg border border-border/20 bg-muted/20 opacity-60"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-medium text-sm leading-tight text-muted-foreground">
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
      </AccordionContent>
    </AccordionItem>
  );
}
