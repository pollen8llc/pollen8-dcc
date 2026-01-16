import { useState, useEffect } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Check, Play, ChevronRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTierLabels } from "@/hooks/useRelationshipLevels";
import { useQueryClient } from "@tanstack/react-query";

interface Path {
  id: string;
  name: string;
  description: string;
  tier: number;
  is_required: boolean;
  steps_count?: number;
}

interface PathSelectionSectionProps {
  actv8ContactId: string;
  currentTier: number;
  currentPathId: string | null;
  onPathSelected?: () => void;
}

export function PathSelectionSection({
  actv8ContactId,
  currentTier,
  currentPathId,
  onPathSelected,
}: PathSelectionSectionProps) {
  const queryClient = useQueryClient();
  const tierLabels = useTierLabels();
  const [paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingPath, setSelectingPath] = useState<string | null>(null);

  // Fetch available paths
  useEffect(() => {
    const fetchPaths = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("rms_actv8_paths")
          .select(`
            id,
            name,
            description,
            tier,
            is_required,
            rms_actv8_path_steps(count)
          `)
          .order("tier", { ascending: true })
          .order("tier_order", { ascending: true });

        if (error) throw error;

        const pathsWithCounts = (data || []).map((p: any) => ({
          ...p,
          steps_count: p.rms_actv8_path_steps?.[0]?.count || 4,
        }));

        setPaths(pathsWithCounts);
      } catch (error) {
        console.error("Error fetching paths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  // Handle path selection
  const handleSelectPath = async (path: Path) => {
    if (path.tier > currentTier + 1) {
      toast.error("Complete current tier first");
      return;
    }

    if (path.id === currentPathId) {
      return;
    }

    setSelectingPath(path.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create new path instance
      const { data: instance, error: instanceError } = await supabase
        .from("rms_actv8_path_instances")
        .insert({
          user_id: user.id,
          actv8_contact_id: actv8ContactId,
          path_id: path.id,
          status: "active",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (instanceError) throw instanceError;

      // Update contact with new path
      const { error: updateError } = await supabase
        .from("rms_actv8_contacts")
        .update({
          development_path_id: path.id,
          current_path_instance_id: instance.id,
          path_tier: path.tier,
          current_step_index: 0,
          completed_steps: [],
        })
        .eq("id", actv8ContactId);

      if (updateError) throw updateError;

      toast.success(`Started ${path.name}`);
      
      queryClient.invalidateQueries({ queryKey: ["actv8-contact"] });
      queryClient.invalidateQueries({ queryKey: ["step-instances"] });
      
      onPathSelected?.();
    } catch (error) {
      console.error("Error selecting path:", error);
      toast.error("Failed to select path");
    } finally {
      setSelectingPath(null);
    }
  };

  // Group paths by tier
  const pathsByTier = paths.reduce((acc, path) => {
    if (!acc[path.tier]) acc[path.tier] = [];
    acc[path.tier].push(path);
    return acc;
  }, {} as Record<number, Path[]>);

  const currentPath = paths.find(p => p.id === currentPathId);

  return (
    <AccordionItem 
      value="path" 
      className="border rounded-2xl bg-card/60 backdrop-blur-xl border-primary/20 overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
        <div className="flex items-center gap-3 text-left flex-1">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <span className="font-medium">
              {currentPath ? currentPath.name : "Choose Development Path"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-xs">
                {tierLabels[currentTier] || `Tier ${currentTier}`}
              </Badge>
              {currentPathId && (
                <Badge className="bg-primary/20 text-primary text-xs">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        {loading ? (
          <div className="animate-pulse space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {Object.entries(pathsByTier).map(([tierStr, tierPaths]) => {
              const tier = parseInt(tierStr);
              const isCurrentTier = tier === currentTier;
              const isLocked = tier > currentTier + 1;
              const isPastTier = tier < currentTier;

              return (
                <div key={tier} className="space-y-2">
                  {/* Tier Header */}
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        isCurrentTier && "bg-primary/20 text-primary",
                        isPastTier && "bg-blue-500/20 text-blue-400",
                        isLocked && "bg-muted text-muted-foreground"
                      )}
                    >
                      {tierLabels[tier] || `Tier ${tier}`}
                    </span>
                    {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>

                  {/* Paths in this tier */}
                  {tierPaths.map((path) => {
                    const isCurrent = path.id === currentPathId;
                    const isSelecting = selectingPath === path.id;

                    return (
                      <div
                        key={path.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all",
                          isCurrent
                            ? "bg-primary/10 border-primary"
                            : isLocked
                            ? "bg-muted/20 border-muted opacity-50 cursor-not-allowed"
                            : "bg-card/80 border-border hover:border-primary/50 cursor-pointer"
                        )}
                        onClick={() => !isLocked && !isCurrent && handleSelectPath(path)}
                      >
                        {/* Status Icon */}
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                            isCurrent
                              ? "bg-primary text-primary-foreground"
                              : isPastTier
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isCurrent ? (
                            <Play className="h-4 w-4 fill-current" />
                          ) : isPastTier ? (
                            <Check className="h-4 w-4" />
                          ) : isLocked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>

                        {/* Path Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-medium text-sm",
                                isCurrent && "text-primary"
                              )}
                            >
                              {path.name}
                            </span>
                            {path.is_required && (
                              <Badge variant="secondary" className="text-[10px]">
                                Required
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge className="bg-primary/20 text-primary text-[10px]">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {path.description}
                          </p>
                        </div>

                        {/* Step Count */}
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {path.steps_count} steps
                        </span>

                        {/* Select Button */}
                        {!isCurrent && !isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                            disabled={isSelecting}
                          >
                            {isSelecting ? "..." : "Start"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {paths.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No development paths available
              </p>
            )}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
