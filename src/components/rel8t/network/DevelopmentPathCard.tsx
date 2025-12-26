import { getDevelopmentPath, DevelopmentPath } from "@/data/mockNetworkData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Calendar, ExternalLink, Link2 } from "lucide-react";
import { Outreach } from "@/services/rel8t/outreachService";

interface LinkedOutreach {
  stepIndex: number;
  outreach: Outreach;
}

interface DevelopmentPathCardProps {
  pathId?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  linkedOutreaches?: LinkedOutreach[];
  availableOutreaches?: Outreach[];
  actv8ContactId?: string;
  onPlanTouchpoint?: (stepIndex: number) => void;
  onLinkOutreach?: (stepIndex: number) => void;
  onAdvanceStep?: () => void;
  onChangePath?: () => void;
}

export function DevelopmentPathCard({
  pathId,
  currentStepIndex,
  completedSteps,
  linkedOutreaches = [],
  availableOutreaches = [],
  actv8ContactId,
  onPlanTouchpoint,
  onLinkOutreach,
  onAdvanceStep,
  onChangePath
}: DevelopmentPathCardProps) {
  const navigate = useNavigate();
  const path = pathId ? getDevelopmentPath(pathId) : null;

  if (!path) {
    return (
      <div className="border border-border/40 rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-3">No development path assigned</p>
        <Button variant="outline" size="sm" onClick={onChangePath}>
          Start Development Path
        </Button>
      </div>
    );
  }

  const stepIndex = currentStepIndex ?? 0;
  const completed = completedSteps ?? [];
  const progress = ((stepIndex) / path.steps.length) * 100;
  const isComplete = stepIndex >= path.steps.length;

  // Helper to find linked outreach for a step
  const getLinkedOutreach = (index: number) => {
    return linkedOutreaches.find(lo => lo.stepIndex === index);
  };

  // Helper to get outreach status badge
  const getOutreachStatusBadge = (outreach: Outreach) => {
    const dueDate = parseISO(outreach.due_date);
    const isOverdue = outreach.status === 'pending' && isPast(dueDate) && !isToday(dueDate);
    
    if (outreach.status === 'completed') {
      return <Badge className="bg-emerald-500 text-[10px] h-5">Done</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive" className="text-[10px] h-5">Overdue</Badge>;
    }
    if (isToday(dueDate)) {
      return <Badge className="bg-amber-500 text-[10px] h-5">Today</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px] h-5">Scheduled</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Path Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{path.name}</h4>
          <p className="text-xs text-muted-foreground">{path.description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onChangePath} className="text-xs">
          Change Path
        </Button>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>Step {Math.min(stepIndex + 1, path.steps.length)} of {path.steps.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {path.steps.map((step, index) => {
          const isCompleted = index < stepIndex || completed.includes(step.id);
          const isCurrent = index === stepIndex;
          const isUpcoming = index > stepIndex;
          const linkedOutreach = getLinkedOutreach(index);

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all ${
                isCurrent 
                  ? 'border-primary/50 bg-primary/5' 
                  : isCompleted 
                    ? 'border-border/30 bg-muted/30' 
                    : 'border-border/20 bg-background/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Step Indicator */}
                <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${isUpcoming ? 'text-muted-foreground' : ''}`}>
                      {step.name}
                    </span>
                    {isCompleted && !linkedOutreach && (
                      <span className="text-[10px] text-emerald-500 font-medium">COMPLETED</span>
                    )}
                    {isCurrent && !linkedOutreach && (
                      <span className="text-[10px] text-primary font-medium">CURRENT</span>
                    )}
                    {isUpcoming && !linkedOutreach && (
                      <span className="text-[10px] text-muted-foreground">UPCOMING</span>
                    )}
                    {linkedOutreach && getOutreachStatusBadge(linkedOutreach.outreach)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  
                  {/* Linked Outreach Info */}
                  {linkedOutreach && (
                    <div className="mt-2 p-2 rounded bg-muted/50 border border-border/30">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {format(parseISO(linkedOutreach.outreach.due_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-6 text-xs gap-1"
                          onClick={() => navigate(`/rel8/outreach/${linkedOutreach.outreach.id}`)}
                        >
                          View Outreach
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-foreground mt-1 truncate">
                        {linkedOutreach.outreach.title}
                      </p>
                    </div>
                  )}
                  
                  {/* Current Step Actions - Only show if no linked outreach */}
                  {isCurrent && !linkedOutreach && (
                    <div className="mt-2 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="h-7 text-xs"
                        onClick={() => onPlanTouchpoint?.(index)}
                      >
                        Plan Touchpoint
                      </Button>
                      {availableOutreaches.length > 0 && onLinkOutreach && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() => onLinkOutreach(index)}
                        >
                          <Link2 className="h-3 w-3" />
                          Link Existing
                        </Button>
                      )}
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
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p className="font-medium text-emerald-600 dark:text-emerald-400">Path Complete!</p>
        </div>
      )}
    </div>
  );
}
