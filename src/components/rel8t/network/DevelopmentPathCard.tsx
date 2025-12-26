import { getDevelopmentPath } from "@/data/mockNetworkData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Calendar, ExternalLink, Link2, Check, ChevronRight, Play } from "lucide-react";
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
  onPlanTouchpoint,
  onLinkOutreach,
  onChangePath
}: DevelopmentPathCardProps) {
  const navigate = useNavigate();
  const path = pathId ? getDevelopmentPath(pathId) : null;

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
  const progress = ((stepIndex) / path.steps.length) * 100;
  const isComplete = stepIndex >= path.steps.length;

  const getLinkedOutreach = (index: number) => {
    return linkedOutreaches.find(lo => lo.stepIndex === index);
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
          Change
        </Button>
      </div>

      {/* Progress Bar - Android style */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.min(stepIndex + 1, path.steps.length)} of {path.steps.length}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List - Settings list style */}
      <div className="space-y-1">
        {path.steps.map((step, index) => {
          const isCompleted = index < stepIndex || completed.includes(step.id);
          const isCurrent = index === stepIndex;
          const linkedOutreach = getLinkedOutreach(index);

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
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                  
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
                  
                  {/* Current Step Actions */}
                  {isCurrent && !linkedOutreach && (
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onPlanTouchpoint?.(index)}
                        className="h-8 text-xs rounded-lg gap-1"
                      >
                        Plan Touchpoint
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                      {availableOutreaches.length > 0 && onLinkOutreach && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onLinkOutreach(index)}
                          className="h-8 text-xs rounded-lg gap-1"
                        >
                          <Link2 className="h-3 w-3" />
                          Link
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
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <div className="flex items-center justify-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <span className="font-medium text-emerald-500">Path Complete!</span>
          </div>
        </div>
      )}
    </div>
  );
}
