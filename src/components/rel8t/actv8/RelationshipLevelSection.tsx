import { useState, useEffect, useCallback } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Lock, Check, ArrowRight, RefreshCw, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useRelationshipLevels,
  getIconComponent,
  checkLevelCompletion,
  switchRelationshipLevel,
} from "@/hooks/useRelationshipLevels";
import { useQueryClient } from "@tanstack/react-query";

interface LevelSwitch {
  from_level: number;
  to_level: number;
  switched_at: string;
}

interface RelationshipLevelSectionProps {
  actv8ContactId: string;
  currentLevel: number;
  levelSwitches: LevelSwitch[];
  onLevelChanged?: () => void;
}

export function RelationshipLevelSection({
  actv8ContactId,
  currentLevel,
  levelSwitches = [],
  onLevelChanged,
}: RelationshipLevelSectionProps) {
  const queryClient = useQueryClient();
  const { data: levels = [], isLoading } = useRelationshipLevels();
  const [switchingTo, setSwitchingTo] = useState<number | null>(null);
  const [levelCompletions, setLevelCompletions] = useState<Record<number, boolean>>({});
  const [checkingCompletions, setCheckingCompletions] = useState(false);

  // Check completion status for all levels on mount and when currentLevel changes
  const checkAllCompletions = useCallback(async () => {
    if (levels.length === 0) return;
    
    setCheckingCompletions(true);
    const completions: Record<number, boolean> = {};
    
    try {
      // Check each level's completion status
      for (const level of levels) {
        if (level.level >= 1) {
          // Check if this level has been completed (path ended)
          const isComplete = await checkLevelCompletion(actv8ContactId, level.level);
          completions[level.level] = isComplete;
        }
      }
      setLevelCompletions(completions);
    } catch (error) {
      console.error("Error checking level completions:", error);
    } finally {
      setCheckingCompletions(false);
    }
  }, [actv8ContactId, levels]);

  useEffect(() => {
    checkAllCompletions();
  }, [checkAllCompletions]);

  // Get switch count for a specific level
  const getSwitchCount = (level: number) => {
    return levelSwitches.filter((s) => s.to_level === level).length;
  };

  // Check if level is unlocked based on completion of previous level
  const isLevelUnlocked = (level: number) => {
    // Level 1 is always unlocked
    if (level === 1) return true;
    
    // If we've already been to this level or higher, it's unlocked
    if (currentLevel >= level) return true;
    
    // Otherwise, check if the previous level has been completed
    const prevLevelCompleted = levelCompletions[level - 1] === true;
    return prevLevelCompleted;
  };

  // Check if level is completed
  const isLevelCompleted = (level: number) => {
    return levelCompletions[level] === true;
  };

  // Handle level switch
  const handleSwitchLevel = async (targetLevel: number) => {
    if (targetLevel === currentLevel) return;
    if (!isLevelUnlocked(targetLevel)) {
      toast.error(`Complete Level ${targetLevel - 1} to unlock this level`);
      return;
    }

    setSwitchingTo(targetLevel);

    try {
      // If advancing to higher level, verify completion first
      if (targetLevel > currentLevel) {
        const canAdvance = await checkLevelCompletion(actv8ContactId, currentLevel);
        if (!canAdvance) {
          toast.error(`Complete Level ${currentLevel}'s path before advancing`);
          setSwitchingTo(null);
          return;
        }
      }

      const result = await switchRelationshipLevel(actv8ContactId, targetLevel);

      if (result.success) {
        toast.success(`Switched to Level ${targetLevel}`);
        
        // Refresh completions after switch
        await checkAllCompletions();
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["actv8-contact"] });
        queryClient.invalidateQueries({ queryKey: ["step-instances"] });
        queryClient.invalidateQueries({ queryKey: ["path-instances"] });
        
        onLevelChanged?.();
      } else if (result.requires_completion) {
        toast.error(`Complete Level ${result.requires_completion} first`);
      } else {
        toast.error(result.error || "Failed to switch level");
      }
    } catch (error) {
      console.error("Error switching level:", error);
      toast.error("Failed to switch level");
    } finally {
      setSwitchingTo(null);
    }
  };

  const currentLevelData = levels.find(l => l.level === currentLevel);
  const currentLevelLabel = currentLevelData?.label || `Level ${currentLevel}`;

  return (
    <AccordionItem 
      value="level" 
      className="border rounded-2xl bg-card/60 backdrop-blur-xl border-primary/20 overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
        <div className="flex items-center gap-3 text-left flex-1">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <span className="font-medium">Relationship Standing</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs">
                {currentLevelLabel}
              </Badge>
              {checkingCompletions && (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        {isLoading ? (
          <div className="animate-pulse space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {levels
              .sort((a, b) => a.level - b.level)
              .map((level, index) => {
                const Icon = getIconComponent(level.icon_name);
                const isCurrent = level.level === currentLevel;
                const isUnlocked = isLevelUnlocked(level.level);
                const isCompleted = isLevelCompleted(level.level);
                const switchCount = getSwitchCount(level.level);
                const isSwitching = switchingTo === level.level;
                const canClick = isUnlocked && !isCurrent && !isSwitching;

                return (
                  <div
                    key={level.id}
                    role={canClick ? "button" : undefined}
                    tabIndex={canClick ? 0 : undefined}
                    className={cn(
                      "relative rounded-lg border p-4 transition-all duration-200",
                      // Current level styling
                      isCurrent && "bg-primary/10 border-primary shadow-md shadow-primary/20",
                      // Unlocked but not current
                      !isCurrent && isUnlocked && "bg-card/80 border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                      // Locked styling
                      !isUnlocked && "bg-muted/20 border-muted/50 cursor-not-allowed opacity-50",
                      // Switching state
                      isSwitching && "opacity-70 pointer-events-none",
                      // Terraced effect
                      index === 0 && "ml-0",
                      index === 1 && "ml-3",
                      index === 2 && "ml-6",
                      index === 3 && "ml-9"
                    )}
                    onClick={() => canClick && handleSwitchLevel(level.level)}
                    onKeyDown={(e) => {
                      if (canClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleSwitchLevel(level.level);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Level Icon */}
                      <div
                        className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                          isCurrent && "bg-primary text-primary-foreground",
                          !isCurrent && isCompleted && "bg-blue-500/20 text-blue-500",
                          !isCurrent && isUnlocked && !isCompleted && "bg-secondary text-secondary-foreground",
                          !isUnlocked && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isSwitching ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : !isUnlocked ? (
                          <Lock className="h-4 w-4" />
                        ) : isCompleted && !isCurrent ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      {/* Level Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "font-medium text-sm",
                              isCurrent && "text-primary",
                              !isUnlocked && "text-muted-foreground"
                            )}
                          >
                            Lvl {level.level}: {level.label.replace(`Level ${level.level}: `, "")}
                          </span>

                          {/* Status Badges */}
                          {isCurrent && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs h-5">
                              Current
                            </Badge>
                          )}
                          {isCompleted && !isCurrent && (
                            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 text-xs h-5">
                              Done
                            </Badge>
                          )}
                          {switchCount > 0 && (
                            <Badge variant="outline" className="text-xs h-5 gap-1 border-muted-foreground/30">
                              <RefreshCw className="h-2.5 w-2.5" />
                              {switchCount}×
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {level.description}
                        </p>
                      </div>

                      {/* Action Indicator */}
                      {canClick && (
                        <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-full bg-primary/10">
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      {/* Locked indicator */}
                      {!isUnlocked && (
                        <div className="text-xs text-muted-foreground flex-shrink-0">
                          Complete Lvl {level.level - 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Helper text */}
            <p className="text-xs text-muted-foreground text-center mt-4 px-4">
              Complete each level's development path to unlock the next
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
