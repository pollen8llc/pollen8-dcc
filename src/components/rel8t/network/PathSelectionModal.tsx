import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Check, Coffee, Users, Handshake, CalendarCheck } from "lucide-react";
import { getDevelopmentPaths } from "@/services/actv8Service";
import { cn } from "@/lib/utils";

interface PathSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPath: (pathId: string) => void;
  currentPathId?: string;
}

// Check if a path is the Build Rapport meeting-focused path
const isBuildRapportPath = (pathId: string) => pathId === 'build_rapport';

// Get icon for Build Rapport steps
const getBuildRapportStepIcon = (index: number) => {
  const icons = [Coffee, Users, Handshake, CalendarCheck];
  return icons[index] || Coffee;
};

export function PathSelectionModal({
  open,
  onOpenChange,
  onSelectPath,
  currentPathId
}: PathSelectionModalProps) {
  const { data: paths = [], isLoading } = useQuery({
    queryKey: ['development-paths'],
    queryFn: getDevelopmentPaths,
    enabled: open,
  });

  const handleSelect = (pathId: string) => {
    onSelectPath(pathId);
    onOpenChange(false);
  };

  const strengthLabels: Record<string, string> = {
    growing: 'Growing',
    solid: 'Solid',
    thick: 'Deep Bond'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
          <DialogTitle className="text-lg sm:text-xl">Choose Development Path</DialogTitle>
          <DialogDescription className="text-sm">
            Select a path to guide your relationship development
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {paths.map((path) => {
                const isCurrent = path.id === currentPathId;
                return (
                  <button
                    key={path.id}
                    onClick={() => handleSelect(path.id)}
                    className={cn(
                      "text-left p-3 sm:p-4 rounded-lg border transition-all",
                      "hover:border-primary/50 hover:bg-primary/5",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20",
                      isCurrent 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/40 bg-card/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                      <h4 className="font-medium text-sm sm:text-base leading-tight">{path.name}</h4>
                      {isCurrent && (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          <Check className="h-3 w-3" />
                          <span className="hidden sm:inline">CURRENT</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{path.description}</p>
                    
                    {/* Step indicators - show meeting icons for Build Rapport */}
                    <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                      {isBuildRapportPath(path.id) ? (
                        path.steps?.map((_, index) => {
                          const Icon = getBuildRapportStepIcon(index);
                          return (
                            <div
                              key={index}
                              className="h-5 sm:h-6 flex-1 rounded bg-primary/10 flex items-center justify-center max-w-8"
                            >
                              <Icon className="h-3 w-3 text-primary" />
                            </div>
                          );
                        })
                      ) : (
                        path.steps?.map((_, index) => (
                          <div
                            key={index}
                            className="h-1 sm:h-1.5 flex-1 rounded-full bg-muted max-w-8"
                          />
                        ))
                      )}
                    </div>
                    
                    <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                      <span>{path.steps?.length || 0} steps</span>
                      <span>→ {strengthLabels[path.target_strength] || path.target_strength}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}