import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Check, Lock, Heart, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ASSESSMENT_LEVELS } from "./RelationshipAssessmentStep";
import { SkippedPathEntry, PathHistoryEntry } from "@/services/actv8Service";
import { checkLevelCompletion, switchRelationshipLevel } from "@/hooks/useRelationshipLevels";
import { supabase } from "@/integrations/supabase/client";

interface LevelSwitch {
  from_level: number;
  to_level: number;
  switched_at: string;
}

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

const levelLabels: Record<string, string> = {
  level_1: "Lvl 1: Just Met",
  level_2: "Lvl 2: Building Rapport",
  level_3: "Lvl 3: Established",
  level_4: "Lvl 4: Close Bond",
};

export function RelationshipLevelAccordion({
  contactName: _contactName,
  actv8ContactId,
  currentTier,
  skippedPaths: _skippedPaths,
  pathHistory: _pathHistory,
  currentPathId: _currentPathId,
  currentPathName: _currentPathName,
  hasCurrentPath: _hasCurrentPath,
  isPathComplete: _isPathComplete,
  onSelectPath: _onSelectPath,
  onLevelUpdated,
}: RelationshipLevelAccordionProps) {
  const queryClient = useQueryClient();
  const [levelSwitches, setLevelSwitches] = useState<LevelSwitch[]>([]);
  const [currentRelationshipLevel, setCurrentRelationshipLevel] = useState<number | null>(null);
  const [switchingTo, setSwitchingTo] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [targetLevel, setTargetLevel] = useState<number | null>(null);
  const [isUnlockMode, setIsUnlockMode] = useState(false);
  
  // Fetch relationship_level and level_switches from database
  useQuery({
    queryKey: ['relationship-level-data', actv8ContactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rms_actv8_contacts')
        .select('relationship_level, level_switches')
        .eq('id', actv8ContactId)
        .single();
      
      if (error) throw error;
      
      // Only set level if it exists in DB (null means user hasn't selected yet)
      setCurrentRelationshipLevel(data?.relationship_level || null);
      setLevelSwitches((data?.level_switches as unknown as LevelSwitch[]) || []);
      
      return data;
    },
    enabled: !!actv8ContactId,
  });
  
  // Derive current level from tier (fallback if relationship_level not set)
  const getCurrentLevelId = () => {
    if (!currentRelationshipLevel) return null;
    const level = ASSESSMENT_LEVELS.find(l => l.level === currentRelationshipLevel || l.startingTier === currentTier);
    return level?.id || 'level_1';
  };
  
  // Get switch count for a specific level
  const getSwitchCount = (level: number) => {
    return levelSwitches.filter((s) => s.to_level === level).length;
  };
  
  // Levels are ONLY selectable when in unlock mode
  const isLevelSelectable = isUnlockMode;

  // Handle level selection - only works when unlocked
  const handleLevelCardClick = async (level: number) => {
    if (!isUnlockMode) return; // Must be in unlock mode
    if (level === currentRelationshipLevel) return; // Already at this level
    
    // Show confirm dialog
    setTargetLevel(level);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSwitch = async () => {
    if (!targetLevel) return;
    
    setSwitchingTo(targetLevel);
    setConfirmDialogOpen(false);
    
    try {
      const result = await switchRelationshipLevel(actv8ContactId, targetLevel);
      
      if (result.success) {
        setCurrentRelationshipLevel(targetLevel);
        setIsUnlockMode(false); // Exit unlock mode after selection
        // Update level switches by refetching
        queryClient.invalidateQueries({ queryKey: ['relationship-level-data', actv8ContactId] });
        queryClient.invalidateQueries({ queryKey: ['actv8-contact'] });
        queryClient.invalidateQueries({ queryKey: ['available-paths', actv8ContactId] });
        toast.success(`Selected Level ${targetLevel}`);
        onLevelUpdated?.();
      } else if (result.requires_completion) {
        toast.error(`Complete Level ${result.requires_completion} first`);
      } else {
        toast.error(result.error || "Failed to switch level");
      }
    } catch (error: any) {
      console.error("Error switching level:", error);
      toast.error("Failed to switch level");
    } finally {
      setSwitchingTo(null);
      setTargetLevel(null);
    }
  };
  
  const handleCancelUnlock = () => {
    setIsUnlockMode(false);
  };

  const currentLevelLabel = currentRelationshipLevel 
    ? (levelLabels[getCurrentLevelId() || ''] || 'Unknown')
    : 'Not Selected';

  return (
    <>
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
                  {currentLevelLabel}
                </span>
              </div>
            </div>
          </div>
        </AccordionTrigger>
      
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-3 pt-2">
            {/* Unlock/Change Level Button - shown when not in unlock mode */}
            {!isUnlockMode && (
              <div className={cn(
                "flex items-center mb-2",
                !currentRelationshipLevel ? "justify-center py-4 flex-col" : "justify-end"
              )}>
                {!currentRelationshipLevel && (
                  <p className="text-sm text-muted-foreground mb-3">
                    Select your relationship level to start developing this connection
                  </p>
                )}
                <Button 
                  onClick={() => setIsUnlockMode(true)}
                  className="gap-2"
                  variant={currentRelationshipLevel ? "outline" : "default"}
                  size={currentRelationshipLevel ? "sm" : "default"}
                >
                  <Lock className="h-4 w-4" />
                  {currentRelationshipLevel ? "Change Level" : "Unlock Levels"}
                </Button>
              </div>
            )}

            {/* Cancel button when in unlock mode */}
            {isUnlockMode && (
              <div className="flex justify-end mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancelUnlock}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            )}

            {ASSESSMENT_LEVELS.map((level, index) => {
              const isCurrent = level.level === currentRelationshipLevel;
              const canSelect = isUnlockMode; // Only selectable in unlock mode
              const switchCount = getSwitchCount(level.level);
              const isSwitching = switchingTo === level.level;
              const isLocked = !isUnlockMode; // Locked unless in unlock mode

              return (
                <div
                  key={level.id}
                  className={cn(
                    "relative rounded-lg border p-4 transition-all duration-200",
                    isCurrent
                      ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
                      : isLocked
                      ? "bg-muted/30 border-muted opacity-60"
                      : "bg-card/80 border-border hover:border-primary/50 cursor-pointer",
                    // Terraced effect
                    index === 0 && "ml-0",
                    index === 1 && "ml-2",
                    index === 2 && "ml-4",
                    index === 3 && "ml-6"
                  )}
                  onClick={() => canSelect && !isCurrent && handleLevelCardClick(level.level)}
                >
                  <div className="flex items-start gap-3">
                    {/* Level Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isLocked
                          ? "bg-muted/50 text-muted-foreground/50"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <div className="h-5 w-5">{level.icon}</div>
                      )}
                    </div>

                    {/* Level Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "font-medium",
                            isCurrent && "text-primary",
                            isLocked && "text-muted-foreground"
                          )}
                        >
                          {level.label}
                        </span>

                        {/* Status Badges */}
                        {isCurrent && (
                          <Badge className="bg-primary/20 text-primary text-xs">
                            Current
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

                    {/* Action Arrow - only show in unlock mode */}
                    {isUnlockMode && !isCurrent && (
                      <div className="h-8 w-8 flex items-center justify-center flex-shrink-0">
                        {isSwitching ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Helper text */}
            {isUnlockMode && !currentRelationshipLevel && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                Select the level that best describes your relationship
              </p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Relationship Level</DialogTitle>
            <DialogDescription>
              Are you sure you want to switch to {targetLevel ? ASSESSMENT_LEVELS.find(l => l.level === targetLevel)?.label : ''}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setTargetLevel(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSwitch} disabled={switchingTo !== null}>
              {switchingTo ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                "Confirm Switch"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
