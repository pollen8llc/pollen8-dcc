import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Heart, Users, UserPlus, Handshake } from "lucide-react";
import { getDevelopmentPaths, getAvailablePaths, DevelopmentPath, updateRelationshipLevel } from "@/services/actv8Service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AssessmentLevel } from "./RelationshipAssessmentStep";
import { SkippedPathEntry, PathHistoryEntry } from "@/services/actv8Service";
import { 
  useRelationshipLevels, 
  useTierLabels, 
  getIconComponent,
  switchRelationshipLevel,
  checkLevelCompletion,
  RelationshipLevel,
} from "@/hooks/useRelationshipLevels";

interface RelationshipLevelAccordionProps {
  contactName: string;
  actv8ContactId: string;
  currentTier: number;
  currentLevel?: number; // 1-4, maps to relationship levels
  levelSwitches?: Array<{ from_level: number; to_level: number; switched_at: string }>;
  skippedPaths: SkippedPathEntry[];
  pathHistory: PathHistoryEntry[];
  currentPathId?: string;
  currentPathName?: string;
  hasCurrentPath: boolean;
  isPathComplete: boolean;
  onSelectPath: (pathId: string) => void;
  onLevelUpdated?: () => void;
}

export function RelationshipLevelAccordion({
  contactName,
  actv8ContactId,
  currentTier,
  currentLevel = 1,
  levelSwitches = [],
  skippedPaths,
  pathHistory,
  currentPathId,
  hasCurrentPath,
  isPathComplete,
  onSelectPath,
  onLevelUpdated,
}: RelationshipLevelAccordionProps) {
  const queryClient = useQueryClient();
  const tierLabels = useTierLabels();
  
  // Fetch relationship levels from database
  const { data: relationshipLevels = [], isLoading: levelsLoading } = useRelationshipLevels();
  
  const [selectedLevel, setSelectedLevel] = useState<number>(currentLevel);
  
  const { data: pathData, isLoading: pathsLoading } = useQuery({
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

  // Use the new database function for level switching
  const updateLevelMutation = useMutation({
    mutationFn: async (newLevel: number) => {
      return switchRelationshipLevel(actv8ContactId, newLevel);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['actv8-contact'] });
        queryClient.invalidateQueries({ queryKey: ['available-paths', actv8ContactId] });
        toast.success('Relationship level updated');
        onLevelUpdated?.();
      } else {
        toast.error(result.error || 'Failed to update level');
      }
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const handleUpdateLevel = async () => {
    if (selectedLevel === currentLevel) return;
    
    // If moving up, check if current level is completed
    if (selectedLevel > currentLevel) {
      const isComplete = await checkLevelCompletion(actv8ContactId, currentLevel);
      if (!isComplete) {
        toast.error(`Complete Level ${currentLevel} first`, {
          description: "You must complete the current level's path before advancing."
        });
        return;
      }
    }
    
    updateLevelMutation.mutate(selectedLevel);
  };

  const isLoading = levelsLoading || pathsLoading;
  const isPathInProgress = hasCurrentPath && !isPathComplete;
  const effectiveTier = pathData?.currentTier || currentTier;

  // Count switches to each level
  const getSwitchCount = (level: number) => {
    return levelSwitches.filter(s => s.to_level === level).length;
  };

  // Check if a level is locked (requires previous level completion)
  const isLevelLocked = (level: number) => {
    if (level <= currentLevel) return false;
    // Level is locked if there's a gap
    return level > currentLevel + 1;
  };

  // Get icon component for a level
  const getLevelIcon = (level: RelationshipLevel) => {
    const IconComponent = getIconComponent(level.icon_name);
    return <IconComponent className="h-4 w-4" />;
  };


  const currentLevelData = relationshipLevels.find(l => l.level === currentLevel);
  const currentLevelLabel = currentLevelData?.label || `Level ${currentLevel}`;

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
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-2 sm:px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 pt-2">
            {/* Terraced Level Cards */}
            <div className="p-2 sm:p-4 rounded-xl border border-border/50 bg-muted/20">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                How well do you know {contactName}?
              </h4>
              
              <div className="space-y-2">
                {relationshipLevels.map((level) => {
                  const isSelected = selectedLevel === level.level;
                  const isCurrent = level.level === currentLevel;
                  const locked = isLevelLocked(level.level);
                  const switchCount = getSwitchCount(level.level);
                  const isCompleted = level.level < currentLevel;
                  
                  return (
                    <div
                      key={level.id}
                      className={cn(
                        "flex items-center space-x-2 sm:space-x-3 rounded-lg border p-2 sm:p-3 transition-all",
                        locked 
                          ? "border-border/20 bg-muted/10 opacity-60 cursor-not-allowed"
                          : "cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                        isSelected && !locked
                          ? "border-primary bg-primary/10"
                          : !locked && "border-border/30 bg-card/30"
                      )}
                      onClick={() => !locked && setSelectedLevel(level.level)}
                    >
                      {/* Level Icon */}
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                          locked ? "bg-muted text-muted-foreground" :
                          isCompleted ? "bg-[hsl(224,76%,48%)] text-white" :
                          isSelected ? "bg-primary text-primary-foreground" :
                          "bg-muted text-muted-foreground"
                        )}
                      >
                        {locked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          getLevelIcon(level)
                        )}
                      </div>
                      
                      {/* Level Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-medium text-sm truncate",
                            locked && "text-muted-foreground"
                          )}>
                            {level.label}
                          </span>
                          
                          {/* Badges */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isCurrent && (
                              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                            {isCompleted && !isCurrent && (
                              <span className="text-[10px] bg-[hsl(224,76%,48%)]/20 text-[hsl(224,76%,48%)] px-2 py-0.5 rounded-full">
                                ✓ Done
                              </span>
                            )}
                            {switchCount > 0 && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                                {switchCount} switch{switchCount > 1 ? 'es' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <span className={cn(
                          "text-[10px] line-clamp-1",
                          locked ? "text-muted-foreground/50" : "text-muted-foreground"
                        )}>
                          {locked 
                            ? `Complete Level ${level.level - 1} to unlock` 
                            : level.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedLevel !== currentLevel && !isLevelLocked(selectedLevel) && (
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
                  ) : selectedLevel > currentLevel ? (
                    "Advance to Level " + selectedLevel
                  ) : (
                    "Switch to Level " + selectedLevel
                  )}
                </Button>
              )}
            </div>


          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
