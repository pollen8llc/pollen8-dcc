import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
  onLevelUpdated?: () => void;
}

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth",
  3: "Professional",
  4: "Advanced",
};

const levelLabels: Record<string, string> = {
  level_1: "Lvl 1: Just Met",
  level_2: "Lvl 2: Building Rapport",
  level_3: "Lvl 3: Established",
  level_4: "Lvl 4: Close Bond",
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
  onLevelUpdated,
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
      onLevelUpdated?.();
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
      
      <AccordionContent className="px-2 sm:px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 pt-2">
            {/* Relationship Level Selection */}
            <div className="p-2 sm:p-4 rounded-xl border border-border/50 bg-muted/20">
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
                        "flex items-center space-x-2 sm:space-x-3 rounded-lg border p-2 sm:p-3 cursor-pointer transition-all",
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
                              "h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center flex-shrink-0",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {level.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm block truncate">
                              {level.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-clamp-1">
                              {level.description}
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="hidden sm:inline-block text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
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

          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
