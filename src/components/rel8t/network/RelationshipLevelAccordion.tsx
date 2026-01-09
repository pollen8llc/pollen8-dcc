import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Coffee, Users, Handshake, CalendarCheck, Lock, Heart, UserPlus } from "lucide-react";
import { getDevelopmentPaths, getAvailablePaths, DevelopmentPath, updateRelationshipLevel } from "@/services/actv8Service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ASSESSMENT_LEVELS, AssessmentLevel } from "./RelationshipAssessmentStep";
import { SkippedPathEntry, PathHistoryEntry } from "@/services/actv8Service";

interface RelationshipLevelAccordionProps {
  contactName: string;
  actv8ContactId: string;
  currentTier: number;
  skippedPaths: SkippedPathEntry[];
  pathHistory: PathHistoryEntry[];
  currentPathId?: string;
  currentPathName?: string;
  hasCurrentPath: boolean;
  isPathComplete: boolean;
  onSelectPath: (pathId: string) => void;
}

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth",
  3: "Professional",
  4: "Advanced",
};

const levelLabels: Record<string, string> = {
  just_met: "Just Met",
  few_conversations: "Building Rapport",
  established: "Established",
  close: "Close Relationship",
};

const isBuildRapportPath = (pathId: string) => pathId === 'build_rapport';

const getBuildRapportStepIcon = (index: number) => {
  const icons = [Coffee, Users, Handshake, CalendarCheck];
  return icons[index] || Coffee;
};

export function RelationshipLevelAccordion({
  contactName,
  actv8ContactId,
  currentTier,
  skippedPaths,
  pathHistory,
  currentPathId,
  currentPathName,
  hasCurrentPath,
  isPathComplete,
  onSelectPath,
}: RelationshipLevelAccordionProps) {
  const queryClient = useQueryClient();
  
  // Derive current level from tier
  const getCurrentLevelId = () => {
    const level = ASSESSMENT_LEVELS.find(l => l.startingTier === currentTier);
    return level?.id || 'just_met';
  };
  
  const [selectedLevel, setSelectedLevel] = useState<string>(getCurrentLevelId());
  
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

  const updateLevelMutation = useMutation({
    mutationFn: async (level: AssessmentLevel) => {
      return updateRelationshipLevel(actv8ContactId, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actv8-contact'] });
      queryClient.invalidateQueries({ queryKey: ['available-paths', actv8ContactId] });
      toast.success('Relationship level updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const handleUpdateLevel = () => {
    const level = ASSESSMENT_LEVELS.find(l => l.id === selectedLevel);
    if (level && level.id !== getCurrentLevelId()) {
      updateLevelMutation.mutate(level);
    }
  };

  const isPathInProgress = hasCurrentPath && !isPathComplete;

  const handleSelect = (pathId: string) => {
    if (isPathInProgress && pathId !== currentPathId) {
      toast.error("Complete your current path first", {
        description: "You must complete all steps before selecting a new path."
      });
      return;
    }
    onSelectPath(pathId);
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

  // Calculate segment colors for mini tier bar
  const skippedTiers = skippedPaths.map(s => s.tier_at_skip).filter(Boolean) as number[];
  // PathHistory doesn't have tier, but we can infer completed tiers from path history length
  const completedTiersCount = pathHistory.length;
  const getSegmentColor = (tier: number) => {
    // Tiers 1 through completedTiersCount are completed (paths were finished)
    if (tier <= completedTiersCount && !skippedTiers.includes(tier)) return 'bg-[hsl(224,76%,48%)]'; // Blue
    if (skippedTiers.includes(tier)) return 'bg-amber-500'; // Yellow
    if (tier === effectiveTier) return 'bg-white'; // Current
    return 'bg-muted'; // Future
  };

  const currentLevelLabel = levelLabels[getCurrentLevelId()] || 'Unknown';

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="relationship-level" className="border rounded-2xl bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
          <div className="flex items-center gap-3 text-left flex-1">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-sm">Relationship Level</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {currentLevelLabel} • {tierLabels[effectiveTier] || `Tier ${effectiveTier}`}
                </span>
              </div>
            </div>
            {/* Mini Tier Bar */}
            <div className="flex items-center gap-1 mr-2">
              {[1, 2, 3, 4].map((tier) => (
                <div
                  key={tier}
                  className={cn(
                    "h-2 w-4 rounded-sm transition-colors",
                    getSegmentColor(tier)
                  )}
                />
              ))}
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              {/* Relationship Level Selection */}
              <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  How well do you know {contactName}?
                </h4>
                <RadioGroup
                  value={selectedLevel}
                  onValueChange={setSelectedLevel}
                  className="space-y-2"
                >
                  {ASSESSMENT_LEVELS.map((level) => {
                    const isSelected = selectedLevel === level.id;
                    const isCurrent = level.id === getCurrentLevelId();
                    return (
                      <div
                        key={level.id}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-all",
                          "hover:border-primary/50 hover:bg-primary/5",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border/30 bg-card/30"
                        )}
                        onClick={() => setSelectedLevel(level.id)}
                      >
                        <RadioGroupItem value={level.id} id={level.id} />
                        <div className="flex-1">
                          <Label
                            htmlFor={level.id}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <div
                              className={cn(
                                "h-7 w-7 rounded-full flex items-center justify-center",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {level.icon}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-sm block">
                                {level.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {level.description}
                              </span>
                            </div>
                            {isCurrent && (
                              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
                
                {selectedLevel !== getCurrentLevelId() && (
                  <Button
                    onClick={handleUpdateLevel}
                    disabled={updateLevelMutation.isPending}
                    className="w-full mt-3"
                    size="sm"
                  >
                    {updateLevelMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Relationship Level"
                    )}
                  </Button>
                )}
              </div>

              {/* Tier Progress Indicator */}
              <div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((tier) => (
                    <div key={tier} className="flex-1 space-y-1">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-colors",
                          getSegmentColor(tier)
                        )}
                      />
                      <span className={cn(
                        "text-[9px] block text-center",
                        tier <= completedTiersCount && !skippedTiers.includes(tier) && "text-[hsl(224,76%,48%)] font-medium",
                        skippedTiers.includes(tier) && "text-amber-500",
                        tier === effectiveTier && "text-foreground font-medium",
                        tier > effectiveTier && !skippedTiers.includes(tier) && tier > completedTiersCount && "text-muted-foreground"
                      )}>
                        {tierLabels[tier]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Path in Progress Notice */}
              {isPathInProgress && (
                <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <p className="text-sm text-muted-foreground">
                    Complete all steps in your current path to unlock new paths.
                  </p>
                </div>
              )}

              {/* Available Paths by Tier */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Development Paths
                </h4>
                {Object.entries(pathsByTier)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([tier, paths]) => (
                    <div key={tier}>
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">
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
                              disabled={(isNextTier && !hasCurrentPath) || (isPathInProgress && !isCurrent)}
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
                    <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
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
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
