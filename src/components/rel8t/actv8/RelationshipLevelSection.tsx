import { useState } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Heart, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useRelationshipLevels,
  getIconComponent,
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

  // Get switch count for a specific level
  const getSwitchCount = (level: number) => {
    return levelSwitches.filter((s) => s.to_level === level).length;
  };

  // Handle level selection - all levels are freely selectable
  const handleSelectLevel = async (targetLevel: number) => {
    if (targetLevel === currentLevel) return;

    setSwitchingTo(targetLevel);

    try {
      const result = await switchRelationshipLevel(actv8ContactId, targetLevel);

      if (result.success) {
        const levelData = levels.find(l => l.level === targetLevel);
        toast.success(`Switched to ${levelData?.label || `Level ${targetLevel}`}`);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["actv8-contact"] });
        queryClient.invalidateQueries({ queryKey: ["step-instances"] });
        queryClient.invalidateQueries({ queryKey: ["path-instances"] });
        
        onLevelChanged?.();
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
  const hasSelectedLevel = currentLevel > 0;

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
              {hasSelectedLevel ? (
                <Badge variant="secondary" className="text-xs">
                  {currentLevelLabel}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Select your relationship level
                </span>
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
            {/* Prompt text */}
            <p className="text-sm text-muted-foreground mb-4">
              Select how you'd describe your current relationship with this contact:
            </p>

            {levels
              .sort((a, b) => a.level - b.level)
              .map((level, index) => {
                const Icon = getIconComponent(level.icon_name);
                const isCurrent = level.level === currentLevel;
                const switchCount = getSwitchCount(level.level);
                const isSwitching = switchingTo === level.level;
                const canClick = !isCurrent && switchingTo === null;

                return (
                  <div
                    key={level.id}
                    role="button"
                    tabIndex={canClick ? 0 : -1}
                    className={cn(
                      "relative rounded-lg border p-4 transition-all duration-200",
                      // Current/selected level styling
                      isCurrent && "bg-primary/10 border-primary shadow-md shadow-primary/20",
                      // Selectable level styling
                      !isCurrent && "bg-card/80 border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                      // Switching state
                      isSwitching && "opacity-70 border-primary/50 bg-primary/5",
                      switchingTo !== null && !isSwitching && "opacity-50 pointer-events-none",
                      // Terraced effect
                      index === 0 && "ml-0",
                      index === 1 && "ml-3",
                      index === 2 && "ml-6",
                      index === 3 && "ml-9"
                    )}
                    onClick={() => canClick && handleSelectLevel(level.level)}
                    onKeyDown={(e) => {
                      if (canClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleSelectLevel(level.level);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Level Icon / Selection Indicator */}
                      <div
                        className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                          isCurrent && "bg-primary text-primary-foreground",
                          !isCurrent && "bg-secondary text-secondary-foreground"
                        )}
                      >
                        {isSwitching ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isCurrent ? (
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
                              isCurrent && "text-primary"
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
                          {switchCount > 0 && (
                            <Badge variant="outline" className="text-xs h-5 gap-1 border-muted-foreground/30">
                              <RefreshCw className="h-2.5 w-2.5" />
                              {switchCount}×
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {level.description}
                        </p>
                      </div>

                      {/* Radio-style indicator for non-current levels */}
                      {!isCurrent && !isSwitching && (
                        <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Helper text */}
            <p className="text-xs text-muted-foreground text-center mt-4 px-4">
              You can change your relationship level anytime
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
