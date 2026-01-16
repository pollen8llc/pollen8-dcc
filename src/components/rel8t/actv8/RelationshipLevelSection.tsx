import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Check, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useRelationshipLevels,
  getIconComponent,
  checkLevelCompletion,
  switchRelationshipLevel,
  RelationshipLevel,
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

  // Get switch count for a specific level
  const getSwitchCount = (level: number) => {
    return levelSwitches.filter((s) => s.to_level === level).length;
  };

  // Check if level is completed (previous level completed)
  const isLevelUnlocked = (level: number) => {
    // Level 1 is always unlocked
    if (level === 1) return true;
    // For now, check if we're at or past that level
    return currentLevel >= level;
  };

  // Handle level switch
  const handleSwitchLevel = async (targetLevel: number) => {
    if (targetLevel === currentLevel) return;

    setSwitchingTo(targetLevel);

    try {
      // If advancing to higher level, check completion first
      if (targetLevel > currentLevel) {
        const canAdvance = await checkLevelCompletion(actv8ContactId, currentLevel);
        if (!canAdvance) {
          toast.error(`Complete Level ${currentLevel} before advancing`);
          setSwitchingTo(null);
          return;
        }
      }

      const result = await switchRelationshipLevel(actv8ContactId, targetLevel);

      if (result.success) {
        toast.success(`Switched to Level ${targetLevel}`);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["actv8-contact"] });
        queryClient.invalidateQueries({ queryKey: ["step-instances"] });
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

  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Relationship Standing</span>
          <Badge variant="secondary" className="text-xs">
            Level {currentLevel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {levels
          .sort((a, b) => a.level - b.level)
          .map((level, index) => {
            const Icon = getIconComponent(level.icon_name);
            const isCurrent = level.level === currentLevel;
            const isUnlocked = isLevelUnlocked(level.level);
            const switchCount = getSwitchCount(level.level);
            const isCompleted = level.level < currentLevel;
            const isSwitching = switchingTo === level.level;

            return (
              <div
                key={level.id}
                className={cn(
                  "relative rounded-lg border p-4 transition-all duration-200",
                  isCurrent
                    ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
                    : isUnlocked
                    ? "bg-card/80 border-border hover:border-primary/50 cursor-pointer"
                    : "bg-muted/30 border-muted cursor-not-allowed opacity-60",
                  // Terraced effect - indent higher levels slightly
                  index === 0 && "ml-0",
                  index === 1 && "ml-2",
                  index === 2 && "ml-4",
                  index === 3 && "ml-6"
                )}
                onClick={() => isUnlocked && !isCurrent && handleSwitchLevel(level.level)}
              >
                <div className="flex items-start gap-3">
                  {/* Level Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-blue-500/20 text-blue-400"
                        : isUnlocked
                        ? "bg-muted text-muted-foreground"
                        : "bg-muted/50 text-muted-foreground/50"
                    )}
                  >
                    {!isUnlocked ? (
                      <Lock className="h-4 w-4" />
                    ) : isCompleted ? (
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
                          "font-medium",
                          isCurrent && "text-primary",
                          !isUnlocked && "text-muted-foreground"
                        )}
                      >
                        Lvl {level.level}: {level.label}
                      </span>

                      {/* Status Badges */}
                      {isCurrent && (
                        <Badge className="bg-primary/20 text-primary text-xs">
                          Current
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                          Done
                        </Badge>
                      )}
                      {switchCount > 0 && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <RefreshCw className="h-2.5 w-2.5" />
                          {switchCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {level.description}
                    </p>
                  </div>

                  {/* Action Arrow */}
                  {isUnlocked && !isCurrent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      disabled={isSwitching}
                    >
                      {isSwitching ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

        {/* Helper text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Complete each level's path to unlock the next level
        </p>
      </CardContent>
    </Card>
  );
}
