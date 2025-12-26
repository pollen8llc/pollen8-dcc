import { MockInteraction, getDevelopmentPath, getWarmthLevel } from "@/data/mockNetworkData";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Outreach } from "@/services/rel8t/outreachService";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface LinkedOutreach {
  stepIndex: number;
  outreach: Outreach;
}

interface DevelopmentTimelineProps {
  interactions: MockInteraction[];
  pathId?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  pathStartedAt?: string;
  linkedOutreaches?: LinkedOutreach[];
}

export function DevelopmentTimeline({
  interactions,
  pathId,
  currentStepIndex,
  completedSteps,
  pathStartedAt,
  linkedOutreaches = []
}: DevelopmentTimelineProps) {
  const path = pathId ? getDevelopmentPath(pathId) : null;

  // Combine interactions, path events, and outreach events into a unified timeline
  type TimelineEvent = {
    id: string;
    date: string;
    type: 'interaction' | 'path_started' | 'step_completed' | 'outreach_scheduled' | 'outreach_completed';
    data: MockInteraction | { stepName: string; stepIndex: number } | { pathName: string } | { outreach: Outreach; stepName?: string };
  };

  const timelineEvents: TimelineEvent[] = [];

  // Add interactions
  interactions.forEach(interaction => {
    timelineEvents.push({
      id: `interaction-${interaction.id}`,
      date: interaction.date,
      type: 'interaction',
      data: interaction
    });
  });

  // Add path started event
  if (path && pathStartedAt) {
    timelineEvents.push({
      id: 'path-started',
      date: pathStartedAt,
      type: 'path_started',
      data: { pathName: path.name }
    });
  }

  // Add outreach events from linked outreaches
  linkedOutreaches.forEach(({ stepIndex, outreach }) => {
    const step = path?.steps[stepIndex];
    const stepName = step?.name;
    
    if (outreach.status === 'completed') {
      // Add completed outreach event
      timelineEvents.push({
        id: `outreach-completed-${outreach.id}`,
        date: outreach.updated_at || outreach.due_date,
        type: 'outreach_completed',
        data: { outreach, stepName }
      });
    } else {
      // Add scheduled outreach event (for pending/overdue)
      timelineEvents.push({
        id: `outreach-scheduled-${outreach.id}`,
        date: outreach.created_at || outreach.due_date,
        type: 'outreach_scheduled',
        data: { outreach, stepName }
      });
    }
  });

  // Add completed steps (only those NOT covered by outreach completions)
  const completed = completedSteps ?? [];
  const outreachCompletedSteps = new Set(
    linkedOutreaches
      .filter(lo => lo.outreach.status === 'completed')
      .map(lo => String(lo.stepIndex))
  );
  
  if (path) {
    completed.forEach((stepId, index) => {
      // Skip if this step was completed via outreach (already shown)
      if (outreachCompletedSteps.has(stepId)) return;
      
      const step = path.steps.find(s => s.id === stepId);
      if (step) {
        timelineEvents.push({
          id: `step-${stepId}`,
          date: new Date(Date.now() - (completed.length - index) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'step_completed',
          data: { stepName: step.name, stepIndex: path.steps.indexOf(step) }
        });
      }
    });
  }

  // Sort by date descending
  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (timelineEvents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No timeline events yet</p>
        <p className="text-xs mt-1">Start a development path to begin tracking</p>
      </div>
    );
  }

  // Helper to get outreach status info
  const getOutreachStatusInfo = (outreach: Outreach) => {
    const dueDate = parseISO(outreach.due_date);
    const isOverdue = outreach.status === 'pending' && isPast(dueDate) && !isToday(dueDate);
    const isDueToday = isToday(dueDate);
    
    if (outreach.status === 'completed') {
      return { color: 'emerald', label: 'Completed', icon: CheckCircle2 };
    }
    if (isOverdue) {
      return { color: 'destructive', label: 'Overdue', icon: AlertCircle };
    }
    if (isDueToday) {
      return { color: 'amber', label: 'Due Today', icon: Clock };
    }
    return { color: 'primary', label: 'Scheduled', icon: Calendar };
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-border/60" />

      {/* Timeline Events */}
      <div className="space-y-4">
        {timelineEvents.map((event, index) => {
          const isFirst = index === 0;
          
          return (
            <div key={event.id} className="relative pl-8">
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full flex items-center justify-center ${
                event.type === 'interaction' 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : event.type === 'path_started'
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : event.type === 'outreach_completed'
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : event.type === 'outreach_scheduled'
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-amber-500/20 border-2 border-amber-500'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  event.type === 'interaction' 
                    ? 'bg-primary' 
                    : event.type === 'path_started'
                      ? 'bg-emerald-500'
                      : event.type === 'outreach_completed'
                        ? 'bg-emerald-500'
                        : event.type === 'outreach_scheduled'
                          ? 'bg-primary'
                          : 'bg-amber-500'
                } ${isFirst ? 'animate-pulse' : ''}`} />
              </div>

              {/* Event Content */}
              <div className={`p-3 rounded-lg border ${
                isFirst ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-card/30'
              }`}>
                {event.type === 'interaction' && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), 'MMM d, yyyy')}
                      </span>
                      {(event.data as MockInteraction).strengthened && (
                        <span className="text-[10px] text-emerald-500 font-medium">STRENGTHENED</span>
                      )}
                    </div>
                    <p className="text-sm font-medium">{(event.data as MockInteraction).location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(event.data as MockInteraction).topics}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <WarmthIndicator warmth={(event.data as MockInteraction).warmth} />
                    </div>
                  </>
                )}

                {event.type === 'path_started' && (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(event.date), 'MMM d, yyyy')}
                    </span>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Started {(event.data as { pathName: string }).pathName} Path
                    </p>
                  </>
                )}

                {event.type === 'step_completed' && (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(event.date), 'MMM d, yyyy')}
                    </span>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Completed: {(event.data as { stepName: string }).stepName}
                    </p>
                  </>
                )}

                {event.type === 'outreach_scheduled' && (() => {
                  const { outreach, stepName } = event.data as { outreach: Outreach; stepName?: string };
                  const statusInfo = getOutreachStatusInfo(outreach);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(event.date), 'MMM d, yyyy')}
                        </span>
                        <Badge variant={statusInfo.color === 'destructive' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <Link to={`/rel8/outreach/${outreach.id}`} className="block hover:underline">
                        <p className="text-sm font-medium text-primary">
                          Touchpoint: {outreach.title}
                        </p>
                      </Link>
                      {stepName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Step: {stepName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {format(parseISO(outreach.due_date), 'MMM d, yyyy')}
                      </p>
                    </>
                  );
                })()}

                {event.type === 'outreach_completed' && (() => {
                  const { outreach, stepName } = event.data as { outreach: Outreach; stepName?: string };
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(event.date), 'MMM d, yyyy')}
                        </span>
                        <Badge className="bg-emerald-500 text-[10px] h-5">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <Link to={`/rel8/outreach/${outreach.id}`} className="block hover:underline">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          Completed: {outreach.title}
                        </p>
                      </Link>
                      {stepName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Step: {stepName} ✓
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WarmthIndicator({ warmth }: { warmth: MockInteraction['warmth'] }) {
  const warmthData = getWarmthLevel(warmth);
  
  const colors: Record<string, string> = {
    cold: 'bg-blue-400',
    neutral: 'bg-muted-foreground',
    warm: 'bg-orange-400',
    enthusiastic: 'bg-rose-500'
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${colors[warmth]}`} />
      <span className="text-xs text-muted-foreground">{warmthData?.label}</span>
    </div>
  );
}
