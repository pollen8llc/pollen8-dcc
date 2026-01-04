import { useQuery } from "@tanstack/react-query";
import { getDevelopmentPath, getStepInstances, StepInstance } from "@/services/actv8Service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Calendar, ExternalLink, Check, ChevronRight, Play, SkipForward, History, Clock } from "lucide-react";
import { Outreach } from "@/services/rel8t/outreachService";
import { PathHistoryEntry, SkippedPathEntry } from "@/hooks/useActv8Contacts";
import { TierProgressBar } from "./TierProgressBar";

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
  pathHistory?: PathHistoryEntry[];
  skippedPaths?: SkippedPathEntry[];
  onPlanTouchpoint?: (stepIndex: number) => void;
  onAdvanceStep?: () => void;
  onChangePath?: () => void;
}

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth",
  3: "Professional",
  4: "Advanced",
};

export function DevelopmentPathCard({
  pathId,
  currentStepIndex,
  completedSteps,
  linkedOutreaches = [],
  actv8ContactId,
  pathTier = 1,
  pathHistory = [],
  skippedPaths = [],
  onPlanTouchpoint,
  onChangePath
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
      <div className="py-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">No development path assigned</p>
        <Button 
          variant="outline" 
          onClick={onChangePath}
          className="rounded-xl gap-2"
        >
          <Play className="h-4 w-4" />
          Start a Path
        </Button>
      </div>
    );
  }

  const stepIndex = currentStepIndex ?? 0;
  const completed = completedSteps ?? [];
  const progress = ((stepIndex) / (path.steps?.length || 1)) * 100;
  const isComplete = path.steps && stepIndex >= path.steps.length;

  const getLinkedOutreach = (index: number) => {
    return linkedOutreaches.find(lo => lo.stepIndex === index);
  };

  const getStepInstance = (stepId: string): StepInstance | undefined => {
    return stepInstances.find(si => si.step_id === stepId);
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
        pathHistory={pathHistory}
        skippedPaths={skippedPaths}
        size="md"
        showLabels
        animated
      />
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-2">
        {pathHistory.length} paths completed
        {skippedPaths.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 text-amber-500 cursor-help">
                  • {skippedPaths.length} skipped
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs font-medium mb-1">Skipped Paths:</p>
                <ul className="text-xs space-y-1">
                  {skippedPaths.map((skip, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <SkipForward className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>
                        {skip.path_name}
                        {skip.reason && <span className="text-muted-foreground"> - {skip.reason}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </p>

      {/* Path Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">{path.name}</h4>
          <p className="text-xs text-muted-foreground">{path.description}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onChangePath} 
          className="text-xs text-primary h-8 rounded-lg"
        >
          View Options
        </Button>
      </div>

      {/* Progress Bar - Android style */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.min(stepIndex + 1, path.steps?.length || 0)} of {path.steps?.length || 0}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Path History (if any) */}
      {pathHistory.length > 0 && (
        <div className="p-2 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <History className="h-3 w-3" />
            <span>Completed Paths</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {pathHistory.map((history, i) => (
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
          const isUnlocked = index <= stepIndex; // Step is unlocked if current or previous completed
          const linkedOutreach = getLinkedOutreach(index);
          const stepInstance = getStepInstance(step.id);

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
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <span className="font-medium text-emerald-500">Path Complete!</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onChangePath}
            className="text-xs"
          >
            Choose Next Path
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
