import { useQuery } from "@tanstack/react-query";
import { getDevelopmentPath, getStepInstances, StepInstance } from "@/services/actv8Service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Calendar, ExternalLink, Check, ChevronRight, Play, SkipForward, History, Clock } from "lucide-react";
import { Outreach } from "@/services/rel8t/outreachService";
import { TierProgressBar, CompletedPathInstance } from "./TierProgressBar";

interface LinkedOutreach {
  stepIndex: number;
  outreach: Outreach;
}

interface DevelopmentPathCardProps {
  pathId?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  linkedOutreaches?: LinkedOutreach[];
  actv8ContactId?: string;
  pathTier?: number;
  completedPathInstances?: CompletedPathInstance[];
  onPlanTouchpoint?: (stepIndex: number) => void;
  onAdvanceStep?: () => void;
}

export function DevelopmentPathCard({
  pathId,
  currentStepIndex,
  completedSteps,
  linkedOutreaches = [],
  actv8ContactId,
  pathTier = 1,
  completedPathInstances = [],
  onPlanTouchpoint,
}: DevelopmentPathCardProps) {
  const navigate = useNavigate();
  
  const { data: path } = useQuery({
    queryKey: ['development-path', pathId],
    queryFn: () => pathId ? getDevelopmentPath(pathId) : null,
    enabled: !!pathId,
  });

  const { data: stepInstances = [] } = useQuery({
    queryKey: ['step-instances', actv8ContactId],
    queryFn: () => actv8ContactId ? getStepInstances(actv8ContactId) : [],
    enabled: !!actv8ContactId,
  });

  if (!path) {
    return (
      <div className="py-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50">
        <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Play className="h-5 w-5 text-primary" />
        </div>
        <h4 className="font-medium text-sm mb-1">No Path Active</h4>
        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
          Select a development path above to start building this relationship.
        </p>
      </div>
    );
  }

  const stepIndex = currentStepIndex ?? 0;
  const completed = completedSteps ?? [];
  const totalSteps = path.steps?.length || 1;
  const progress = (Math.min(stepIndex + 1, totalSteps) / totalSteps) * 100;
  const isComplete = path.steps && stepIndex >= path.steps.length;

  // Derive counts from completedPathInstances
  const completedPathsCount = completedPathInstances.filter(p => p.status === 'ended').length;
  const skippedPathsCount = completedPathInstances.filter(p => p.status === 'skipped').length;
  const skippedPathsList = completedPathInstances.filter(p => p.status === 'skipped');
  const completedPathsList = completedPathInstances.filter(p => p.status === 'ended');

  const getLinkedOutreach = (index: number) => {
    // First check if we have a linked outreach from step instances
    const instance = stepInstances.find(si => si.step_index === index);
    if (instance?.outreach_id) {
      // Find the outreach in linkedOutreaches by outreach_id
      const outreachFromInstance = linkedOutreaches.find(
        lo => lo.outreach.id === instance.outreach_id
      );
      if (outreachFromInstance) {
        return outreachFromInstance;
      }
    }
    // Fallback to legacy stepIndex matching
    return linkedOutreaches.find(lo => lo.stepIndex === index);
  };

  const getStepInstance = (stepId: string, stepIdx?: number): StepInstance | undefined => {
    // First try to find by step_id
    const byStepId = stepInstances.find(si => si.step_id === stepId);
    if (byStepId) return byStepId;
    // Fallback to step_index if provided
    if (stepIdx !== undefined) {
      return stepInstances.find(si => si.step_index === stepIdx);
    }
    return undefined;
  };

  const getOutreachStatusBadge = (outreach: Outreach) => {
    const dueDate = parseISO(outreach.due_date);
    const isOverdue = outreach.status === 'pending' && isPast(dueDate) && !isToday(dueDate);
    
    if (outreach.status === 'completed') {
      return <Badge className="bg-emerald-500 text-white text-[10px] h-5 rounded-md">Done</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive" className="text-[10px] h-5 rounded-md">Overdue</Badge>;
    }
    if (isToday(dueDate)) {
      return <Badge className="bg-amber-500 text-white text-[10px] h-5 rounded-md">Today</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px] h-5 rounded-md">Scheduled</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Full 16-Segment Tier Progress */}
      <TierProgressBar
        currentTier={pathTier}
        currentStepIndex={stepIndex}
        totalStepsInCurrentPath={path?.steps?.length || 4}
        completedPathInstances={completedPathInstances}
        size="md"
        showLabels
        animated
      />
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-2">
        {completedPathsCount} paths completed
        {skippedPathsCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 text-amber-500 cursor-help">
                  • {skippedPathsCount} skipped
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs font-medium mb-1">Skipped Paths:</p>
                <ul className="text-xs space-y-1">
                  {skippedPathsList.map((skip, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <SkipForward className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{skip.path_name}</span>
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </p>

      {/* Path Header */}
      <div>
        <h4 className="font-medium text-sm">{path.name}</h4>
        <p className="text-xs text-muted-foreground">{path.description}</p>
      </div>

      {/* Progress Bar - Android style */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.min(stepIndex + 1, path.steps?.length || 0)} of {path.steps?.length || 0}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-2 bg-[#00eada] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,234,218,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Path History (if any) */}
      {completedPathsCount > 0 && (
        <div className="p-2 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <History className="h-3 w-3" />
            <span>Completed Paths</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {completedPathsList.map((history, i) => (
              <Badge key={i} variant="secondary" className="text-[10px]">
                {history.path_name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Steps List - Settings list style */}
      <div className="space-y-1">
        {path.steps?.map((step, index) => {
          const isCompleted = index < stepIndex || completed.includes(step.id);
          const isCurrent = index === stepIndex;
          const linkedOutreach = getLinkedOutreach(index);
          const stepInstance = getStepInstance(step.id, index);

          return (
            <div
              key={step.id}
              className={`rounded-xl transition-all ${
                isCurrent 
                  ? 'bg-primary/10 border border-primary/30' 
                  : isCompleted
                    ? 'bg-secondary/30'
                    : 'bg-secondary/10'
              }`}
            >
              <div className="p-3 flex items-start gap-3">
                {/* Step Indicator */}
                <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${!isCurrent && !isCompleted ? 'text-muted-foreground' : ''}`}>
                      {step.name}
                    </span>
                    {linkedOutreach && getOutreachStatusBadge(linkedOutreach.outreach)}
                    {/* Step instance ID badge for tracking */}
                    {stepInstance && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-mono opacity-60">
                              #{stepInstance.id.slice(0, 6)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <p>Step Instance ID: {stepInstance.id}</p>
                            {stepInstance.status === 'completed' && stepInstance.days_to_complete && (
                              <p className="text-muted-foreground">Completed in {stepInstance.days_to_complete} day{stepInstance.days_to_complete !== 1 ? 's' : ''}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                  
                  {/* Step stats for completed steps */}
                  {stepInstance?.status === 'completed' && (
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                      {stepInstance.days_to_complete !== null && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stepInstance.days_to_complete} day{stepInstance.days_to_complete !== 1 ? 's' : ''}
                        </span>
                      )}
                      {stepInstance.interaction_outcome && (
                        <Badge variant="secondary" className="text-[9px] h-4 capitalize">
                          {stepInstance.interaction_outcome}
                        </Badge>
                      )}
                      {stepInstance.rapport_progress && (
                        <Badge 
                          variant="secondary" 
                          className={`text-[9px] h-4 capitalize ${
                            stepInstance.rapport_progress === 'strengthened' 
                              ? 'bg-emerald-500/20 text-emerald-500' 
                              : stepInstance.rapport_progress === 'declined'
                                ? 'bg-red-500/20 text-red-500'
                                : ''
                          }`}
                        >
                          {stepInstance.rapport_progress}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Linked Outreach Info */}
                  {linkedOutreach && (
                    <div className="mt-2 p-2 rounded-lg bg-background/50 border border-border/30">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {format(parseISO(linkedOutreach.outreach.due_date), 'MMM d')}
                          </span>
                        </div>
                        <button 
                          onClick={() => navigate(`/rel8/outreach/${linkedOutreach.outreach.id}`)}
                          className="text-xs text-primary flex items-center gap-1 hover:underline"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs text-foreground mt-1 truncate">
                        {linkedOutreach.outreach.title}
                      </p>
                    </div>
                  )}
                  
                  {/* Actions for current step without outreach */}
                  {isCurrent && !linkedOutreach && (
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => onPlanTouchpoint?.(index)}
                        className="h-8 text-xs rounded-lg gap-1"
                      >
                        Plan Touchpoint
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Path Complete State */}
      {isComplete && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <div className="flex items-center justify-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <span className="font-medium text-emerald-500">Path Complete!</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select your next path above to continue.
          </p>
        </div>
      )}
    </div>
  );
}