import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { getDevelopmentPaths } from "@/services/actv8Service";

interface PathSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPath: (pathId: string) => void;
  currentPathId?: string;
}

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
    growing: 'Growing Connection',
    solid: 'Solid Connection',
    thick: 'Deep Bond'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Development Path</DialogTitle>
          <DialogDescription>
            Select a path to guide your relationship development with this contact
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-h-[400px] overflow-y-auto">
            {paths.map((path) => (
              <button
                key={path.id}
                onClick={() => handleSelect(path.id)}
                className={`text-left p-4 rounded-lg border transition-all hover:border-primary/50 ${
                  path.id === currentPathId 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/40 bg-card/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{path.name}</h4>
                  {path.id === currentPathId && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      CURRENT
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{path.description}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  {path.steps?.map((_, index) => (
                    <div
                      key={index}
                      className="h-1.5 flex-1 rounded-full bg-muted"
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{path.steps?.length || 0} steps</span>
                  <span>Target: {strengthLabels[path.target_strength] || path.target_strength}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
