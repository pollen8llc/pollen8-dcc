import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Circle, Clock, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { TierProgressBar } from "./TierProgressBar";
import { StepOutreachActions } from "./StepOutreachActions";
import { StepInstance, useTierLabels } from "@/hooks/useRelationshipLevels";
import { useNavigate } from "react-router-dom";
import { format, isPast, isToday } from "date-fns";

interface PathStep {
  id: string;
  name: string;
  description: string;
  step_order: number;
  suggested_action: string;
  suggested_channel: string;
  icon_name?: string;
}

interface LinkedOutreach {
  id: string;
  title: string;
  status: string;
  due_date: string;
}

interface CompletedPathInstance {
  id: string;
  path_id: string;
  status: "active" | "ended" | "skipped";
  tier?: number;
}

interface DevelopmentProgressSectionProps {
  actv8ContactId: string;
  contactId: string;
  pathId: string | null;
  pathInstanceId: string | null;
  currentTier: number;
  currentStepIndex: number;
  stepInstances: StepInstance[];
  completedPathInstances: CompletedPathInstance[];
  onStepAction?: () => void;
}

export function DevelopmentProgressSection({
  actv8ContactId,
  contactId,
  pathId,
  pathInstanceId,
  currentTier,
  currentStepIndex,
  stepInstances,
  completedPathInstances,
  onStepAction,
}: DevelopmentProgressSectionProps) {
  const navigate = useNavigate();
  const tierLabels = useTierLabels();
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [outreaches, setOutreaches] = useState<Record<number, LinkedOutreach>>({});
  const [loading, setLoading] = useState(true);
  const [pathName, setPathName] = useState<string>("");

  // Fetch path steps and linked outreaches
  useEffect(() => {
    const fetchData = async () => {
      if (!pathId) {
        setSteps([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch path info and steps
        const { data: pathData, error: pathError } = await supabase
          .from("rms_actv8_paths")
          .select("name, rms_actv8_path_steps(*)")
          .eq("id", pathId)
          .single();

        if (pathError) throw pathError;

        setPathName(pathData?.name || "");
        const pathSteps = (pathData?.rms_actv8_path_steps || []).sort(
          (a: PathStep, b: PathStep) => a.step_order - b.step_order
        );
        setSteps(pathSteps);

        // Fetch outreaches for this path instance
        if (pathInstanceId) {
          const { data: outreachData } = await supabase
            .from("rms_outreach")
            .select("id, title, status, due_date, actv8_step_index")
            .eq("path_instance_id", pathInstanceId);

          const outreachMap: Record<number, LinkedOutreach> = {};
          (outreachData || []).forEach((o: any) => {
            if (o.actv8_step_index !== null) {
              outreachMap[o.actv8_step_index] = {
                id: o.id,
                title: o.title,
                status: o.status,
                due_date: o.due_date,
              };
            }
          });
          setOutreaches(outreachMap);
        }
      } catch (error) {
        console.error("Error fetching development data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathId, pathInstanceId]);

  // Get step status from instance
  const getStepStatus = (stepIndex: number) => {
    const instance = stepInstances.find((s) => s.step_index === stepIndex);
    return instance?.status || "pending";
  };

  // Get outreach status display
  const getOutreachBadge = (outreach: LinkedOutreach) => {
    const dueDate = new Date(outreach.due_date);
    const isOverdue = isPast(dueDate) && outreach.status === "pending";
    const isDueToday = isToday(dueDate);

    if (outreach.status === "completed") {
      return <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">Done</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive" className="text-[10px]">Overdue</Badge>;
    }
    if (isDueToday) {
      return <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Today</Badge>;
    }
    return (
      <Badge variant="outline" className="text-[10px]">
        {format(dueDate, "MMM d")}
      </Badge>
    );
  };

  // Handle plan touchpoint
  const handlePlanTouchpoint = (stepIndex: number, step: PathStep) => {
    // Navigate to wizard with step context
    navigate(`/rel8/triggers/wizard?actv8=${actv8ContactId}&step=${stepIndex}&contact=${contactId}`);
  };

  // Progress percentage
  const completedSteps = stepInstances.filter((s) => s.status === "completed").length;
  const progressPercent = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  if (loading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted/50 rounded w-3/4" />
            <div className="h-8 bg-muted/50 rounded" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pathId) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Select a development path to begin</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{pathName || "Development Progress"}</span>
          <Badge variant="outline" className="text-xs">
            {completedSteps}/{steps.length} Steps
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 16-Dot Progress Bar */}
        <TierProgressBar
          currentTier={currentTier}
          currentStepIndex={currentStepIndex}
          totalStepsInCurrentPath={steps.length}
          completedPathInstances={completedPathInstances}
          stepInstances={stepInstances}
          size="md"
        />

        {/* Linear Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Path Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const outreach = outreaches[index];
            const stepInstance = stepInstances.find((s) => s.step_index === index);
            const isActive = index === currentStepIndex;
            const isCompleted = status === "completed";
            const isMissed = status === "missed";
            const isRetrying = status === "retrying";

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all",
                  isActive && "bg-primary/5 border-primary/50",
                  isCompleted && "bg-blue-500/5 border-blue-500/30",
                  isMissed && "bg-red-500/5 border-red-500/30",
                  isRetrying && "bg-purple-500/5 border-purple-500/30",
                  !isActive && !isCompleted && !isMissed && !isRetrying && "bg-card/50 border-border"
                )}
              >
                {/* Step Indicator */}
                <div
                  className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                    isCompleted && !stepInstance?.retry_count && "bg-blue-500 text-white",
                    isCompleted && stepInstance?.retry_count && "bg-purple-500 text-white",
                    isMissed && "bg-red-500 text-white",
                    isRetrying && "bg-purple-500/20 text-purple-400 border-2 border-purple-500",
                    isActive && !isMissed && !isRetrying && "bg-primary text-primary-foreground animate-pulse",
                    !isActive && !isCompleted && !isMissed && !isRetrying && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isMissed ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{step.name}</span>
                    {outreach && getOutreachBadge(outreach)}
                    {stepInstance?.retry_count ? (
                      <Badge variant="outline" className="text-[10px] text-purple-400">
                        Retry #{stepInstance.retry_count}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {step.description}
                  </p>

                  {/* Outreach Actions */}
                  {outreach && (outreach.status === "pending" || isPast(new Date(outreach.due_date))) && (
                    <div className="mt-2">
                      <StepOutreachActions
                        outreachId={outreach.id}
                        actv8ContactId={actv8ContactId}
                        stepIndex={index}
                        isOverdue={isPast(new Date(outreach.due_date)) && outreach.status === "pending"}
                        onAction={onStepAction}
                      />
                    </div>
                  )}

                  {/* Plan Touchpoint Button */}
                  {isActive && !outreach && (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => handlePlanTouchpoint(index, step)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Plan Touchpoint
                    </Button>
                  )}

                  {/* Step Instance Metadata */}
                  {stepInstance && (
                    <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-muted-foreground">
                      {stepInstance.interaction_outcome && (
                        <Badge variant="secondary" className="text-[10px]">
                          {stepInstance.interaction_outcome}
                        </Badge>
                      )}
                      {stepInstance.rapport_progress && (
                        <Badge variant="secondary" className="text-[10px]">
                          {stepInstance.rapport_progress}
                        </Badge>
                      )}
                      {stepInstance.days_to_complete !== null && (
                        <span>Took {stepInstance.days_to_complete} days</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
